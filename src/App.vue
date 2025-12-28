<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ref, watch } from 'vue';

import { Label } from '@/components/ui/label';
import { useColorMode } from '@vueuse/core';
import { throttle } from 'lodash-es';
import EffectSpecificParams from './components/EffectSpecificParams.vue';
import { Slider } from './components/ui/slider';
import { EffectParameter, EffectType, LEDControllerParameter } from './types/wsTypes';

const ws = new WebSocket('/ws');

ws.addEventListener('open', () => console.log('CONNECTED'));
ws.addEventListener('message', (e) => {
	console.log(e.data);
});

const sendMessageToMCU = throttle(
	(message: string) => {
		if (ws.readyState !== WebSocket.OPEN) {
			alert('Not connected yet to the MCU, wait a bit!');
			return;
		}
		ws.send(message);

		console.log(`sening message: ${message}`);
	},
	50,
	{ leading: true, trailing: true },
);

const mode = useColorMode({ disableTransition: false });
mode.value = 'dark';

const brightness = ref([0]);
const colorTemperature = ref([0]);

const onEffect = ref<EffectType>(1);
const offEffect = ref<EffectType>(1);

watch(brightness, (newBrightness) => {
	sendMessageToMCU(`${LEDControllerParameter.BRIGHTNESS} ${newBrightness[0]}`);
});

watch(colorTemperature, (newColorTemperature) => {
	sendMessageToMCU(`${LEDControllerParameter.COLOR_TEMPERATURE} ${newColorTemperature[0]}`);
});

watch(onEffect, (newOnEffect) => {
	sendMessageToMCU(`${LEDControllerParameter.ON_EFFECT} ${EffectParameter.TYPE} ${newOnEffect}`);
});

watch(offEffect, (newOffEffect) => {
	sendMessageToMCU(`${LEDControllerParameter.OFF_EFFECT} ${EffectParameter.TYPE} ${newOffEffect}`);
});
</script>

<template>
	<div class="grid grid-rows-2 w-full h-full content-around max-w-150">
		<div class="grid grid-cols-2 p-4 border-b-2">
			<div class="grid grid-rows-[min-content_1fr] pr-4 border-r-2 overflow-hidden">
				<div class="flex flex-col items-center pb-4 border-b-2 space-y-2">
					<Label for="startup-anim-select">On effect</Label>
					<Select id="startup-anim-select" v-model="onEffect">
						<SelectTrigger class="w-full">
							<SelectValue placeholder="On effect" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="[effectId, effectName] in Object.values(EffectType)"
								:value="effectId"
								:key="effectId"
							>
								{{ effectName }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<EffectSpecificParams
					class="py-4 overflow-y-auto overflow-x-hidden"
					:effect="onEffect"
				></EffectSpecificParams>
			</div>
			<div class="grid grid-rows-[min-content_1fr] pl-4 overflow-hidden">
				<div class="flex flex-col items-center pb-4 border-b-2 space-y-2">
					<Label for="startup-anim-select">Off effect</Label>
					<Select id="startup-anim-select" v-model="offEffect">
						<SelectTrigger class="w-full">
							<SelectValue placeholder="Off effect" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								v-for="[effectId, effectName] in Object.values(EffectType)"
								:value="effectId"
								:key="effectId"
							>
								{{ effectName }}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<EffectSpecificParams
					class="py-4 overflow-y-auto overflow-x-hidden"
					:effect="offEffect"
				></EffectSpecificParams>
			</div>
		</div>
		<div class="grid grid-rows-2 items-center">
			<div>
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
							{{ value }}&nbsp;≈&nbsp;{{ 3000 + Math.round((value / 255) * 3000) }}k
						</template>
					</Slider>
					<Label>6000k</Label>
				</div>
			</div>
		</div>
	</div>

	<!-- TODO: Ez kell-e -->
	<!-- <Button @click="mode === 'light' ? (mode = 'dark') : (mode = 'light')">
		<component :is="mode === 'light' ? Moon : Sun"></component>
	</Button> -->
</template>

<style scoped>
.color-temp-slider :deep([data-slot='slider-track']) {
	background: linear-gradient(to right, #ffd27f, #bbdfff);
}

.color-temp-slider :deep([data-slot='slider-range']) {
	background: transparent;
}
</style>
