<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';

import EffectPanel from '@/components/EffectPanel.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { initialStatePromise } from '@/config';
import { initialStateInjectionKey } from '@/injectionKeys';
import { sendMessageToMCU, sendMessageToMCUThrottled } from '@/lib/mcu';
import { stateChanged } from '@/store/stateChanged';
import { Command } from '@/types/wsTypes';
import { getColorFromBrightnessAndColdBrightness } from '@/utils/color';
import { lerp, roundDownToNearest } from '@/utils/math';
import { clamp } from 'lodash-es';
import { Save } from 'lucide-vue-next';

const initialState = await initialStatePromise;
provide(initialStateInjectionKey, initialState);

/**
 * Brightness is the sum of the cold and warm brightness. It cannot be set to 0!
 */
const brightness = ref(initialState.brightness);
const brightnessPercent = computed(() => {
	return ((brightness.value / 510) * 100).toFixed(2);
});

const coldBrightness = ref(initialState.coldBrightness);
/**
 * colorTemperature is the ratio of the warm brightness to the cold brightness
 */
const colorTemperature = ref(getColorTemperature(initialState.brightness, initialState.coldBrightness));
const colorTemperatureInKelvin = computed(
	() => 3000 + roundDownToNearest((coldBrightness.value / brightness.value) * 3000, 10),
);

const minColdBrightness = computed(() => Math.max(brightness.value - 255, 0));
const maxColdBrightness = computed(() => Math.min(brightness.value, 255));

const gradient = computed(() => {
	const left = { r: 0xff, g: 0xd2, b: 0x7f };
	const right = { r: 0xbb, g: 0xdf, b: 0xff };
	const middle = {
		r: Math.round((left.r + right.r) / 2),
		g: Math.round((left.g + right.g) / 2),
		b: Math.round((left.b + right.b) / 2),
	};

	const t = minColdBrightness.value / 255;

	const leftColor = {
		r: lerp(left.r, middle.r, t),
		g: lerp(left.g, middle.g, t),
		b: lerp(left.b, middle.b, t),
	};

	const rightColor = {
		r: lerp(right.r, middle.r, t),
		g: lerp(right.g, middle.g, t),
		b: lerp(right.b, middle.b, t),
	};

	return `linear-gradient(to right, rgb(${leftColor.r}, ${leftColor.g}, ${leftColor.b}), rgb(${rightColor.r}, ${rightColor.g}, ${rightColor.b}))`;
});

watch(brightness, (newBrightness) => {
	stateChanged.value = true;

	coldBrightness.value = clamp(
		Math.round(newBrightness / (1 + colorTemperature.value)),
		minColdBrightness.value,
		maxColdBrightness.value,
	);
});

watch([minColdBrightness, maxColdBrightness], ([newMinColdBrightness, newMaxColdBrightness]) => {
	coldBrightness.value = clamp(coldBrightness.value, newMinColdBrightness, newMaxColdBrightness);
});

watch([brightness, coldBrightness], ([newBrightness, newColdBrightness]) => {
	sendMessageToMCUThrottled(
		`${Command.SET_COLOR} ${getColorFromBrightnessAndColdBrightness(newBrightness, newColdBrightness)}`,
	);
});

function save(): void {
	stateChanged.value = false;
	sendMessageToMCU(`${Command.SAVE}`);
}

function getColorTemperature(brightness: number, coldBrightness: number): number {
	if (coldBrightness === 0) return Number.POSITIVE_INFINITY;

	const warmBrightness = brightness - coldBrightness;
	return warmBrightness / coldBrightness;
}

function onColdBrightnessSliderChange(newColdBrightness: number): void {
	stateChanged.value = true;
	coldBrightness.value = newColdBrightness;
	colorTemperature.value = getColorTemperature(brightness.value, newColdBrightness);
}
</script>

<template>
	<div class="grid grid-rows-[max-content_max-content] w-full h-full content-center-safe max-w-150">
		<div class="grid grid-cols-2 p-4 border-b-2">
			<EffectPanel class="pr-4 border-r-2"></EffectPanel>
			<EffectPanel class="pl-4" off-effect></EffectPanel>
		</div>
		<div class="grid grid-rows-2 items-center h-max">
			<div class="my-8">
				<Label class="flex w-full justify-center">Brightness</Label>
				<div class="grid grid-cols-[min-content_1fr_min-content] p-4 gap-x-4">
					<Label>0%</Label>
					<Slider
						:min="1"
						:max="510"
						:model-value="[brightness]"
						@update:model-value="($event) => (brightness = $event![0])"
					>
						<template #thumb-value> {{ brightnessPercent }}% </template>
					</Slider>
					<Label>100%</Label>
				</div>
			</div>
			<div>
				<Label class="flex w-full justify-center">Color temperature</Label>
				<div class="grid grid-cols-[min-content_1fr_min-content] p-4 gap-x-4">
					<Label>3000k</Label>
					<Slider
						class="cold-brightness-slider"
						:min="minColdBrightness"
						:max="maxColdBrightness"
						:step="1"
						:model-value="[coldBrightness]"
						@update:model-value="onColdBrightnessSliderChange($event![0])"
					>
						<template #thumb-value> {{ colorTemperatureInKelvin }}k </template>
					</Slider>
					<Label>6000k</Label>
				</div>
			</div>
		</div>
		<Transition name="ease">
			<Button
				v-if="stateChanged"
				class="fixed bottom-6 right-6 size-10 text-white border border-white bg-background hover:bg-accent"
				variant="default"
				@click="save"
			>
				<Save class="size-5"></Save>
			</Button>
		</Transition>
	</div>

	<!-- TODO: Ez kell-e -->
	<!-- <Button @click="mode === 'light' ? (mode = 'dark') : (mode = 'light')">
		<component :is="mode === 'light' ? Moon : Sun"></component>
	</Button> -->
</template>

<style scoped>
.ease-enter-active,
.ease-leave-active {
	transition-property: opacity, transform;
	transition-duration: 0.3s;
	transition-timing-function: ease-in-out;
}

.ease-enter-from,
.ease-leave-to {
	transform: translateY(50%);
	opacity: 0;
}

.cold-brightness-slider :deep([data-slot='slider-track']) {
	background: v-bind(gradient);
}

.cold-brightness-slider :deep([data-slot='slider-range']) {
	background: transparent;
}
</style>
