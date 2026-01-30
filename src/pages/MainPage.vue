<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import EffectPanel from '@/components/EffectPanel.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { initialStatePromise } from '@/config';
import { initialStateInjectionKey } from '@/injectionKeys';
import { sendMessageToMCUThrottled } from '@/lib/mcu';
import { stateChanged } from '@/store/stateChanged';
import { Command } from '@/types/wsTypes';
import { getColorFromBrightnessAndColorTemperature } from '@/utils/color';
import { roundDownToNearest } from '@/utils/math';
import { Save } from 'lucide-vue-next';

const initialState = await initialStatePromise;
provide(initialStateInjectionKey, initialState);

const brightness = ref([initialState.brightness]);
const colorTemperature = ref([initialState.colorTemperature]);

watch(brightness, (newBrightness) => {
	stateChanged.value = true;
	sendMessageToMCUThrottled(
		`${Command.SET_COLOR} ${getColorFromBrightnessAndColorTemperature(newBrightness[0]!, colorTemperature.value[0]!)}`,
	);
});

watch(colorTemperature, (newColorTemperature) => {
	stateChanged.value = true;
	sendMessageToMCUThrottled(
		`${Command.SET_COLOR} ${getColorFromBrightnessAndColorTemperature(brightness.value[0]!, newColorTemperature[0]!)}`,
	);
});

function getTemperatureInKelvin(value: number) {
	return 3000 + roundDownToNearest((value / 255) * 3000, 10);
}

function save(): void {
	stateChanged.value = false;
	sendMessageToMCUThrottled(`${Command.SAVE}`);
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
					<Slider :min="0" :max="255" v-model="brightness" show-thumb-value>
						<template #thumb-value="{ value }"> {{ Math.round((value / 255) * 100) }}% </template>
					</Slider>
					<Label>100%</Label>
				</div>
			</div>
			<div>
				<Label class="flex w-full justify-center">Color temperature</Label>
				<div class="grid grid-cols-[min-content_1fr_min-content] p-4 gap-x-4">
					<Label>3000k</Label>
					<Slider class="color-temp-slider" :min="0" :max="255" v-model="colorTemperature" show-thumb-value>
						<template #thumb-value="{ value }">
							{{ value }}&nbsp;≈&nbsp;{{ getTemperatureInKelvin(value) }}k
						</template>
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

.color-temp-slider :deep([data-slot='slider-track']) {
	background: linear-gradient(to right, #ffd27f, #bbdfff);
}

.color-temp-slider :deep([data-slot='slider-range']) {
	background: transparent;
}
</style>
