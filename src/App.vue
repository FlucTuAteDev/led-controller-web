<script setup lang="ts">
import { ref, watch } from 'vue';

import { Label } from '@/components/ui/label';
import { useColorMode } from '@vueuse/core';
import EffectPanel from './components/EffectPanel.vue';
import { Slider } from './components/ui/slider';
import { sendMessageToMCU } from './lib/mcu';
import { LEDControllerParameter } from './types/wsTypes';

const mode = useColorMode({ disableTransition: false });
mode.value = 'dark';

const brightness = ref([0]);
const colorTemperature = ref([0]);

watch(brightness, (newBrightness) => {
	sendMessageToMCU(`${LEDControllerParameter.BRIGHTNESS} ${newBrightness[0]}`);
});

watch(colorTemperature, (newColorTemperature) => {
	sendMessageToMCU(`${LEDControllerParameter.COLOR_TEMPERATURE} ${newColorTemperature[0]}`);
});
</script>

<template>
	<div class="grid grid-rows-2 w-full h-full content-around max-w-150">
		<div class="grid grid-cols-2 p-4 border-b-2">
			<EffectPanel class="pr-4 border-r-2"></EffectPanel>
			<EffectPanel class="pl-4" off-effect></EffectPanel>
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
