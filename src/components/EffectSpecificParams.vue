<script lang="ts" setup>
import { sendMessageToMCU } from '@/lib/mcu';
import { EffectParameter, EffectType, LEDControllerParameter } from '@/types/wsTypes';
import { ref, useId, watch } from 'vue';
import { Label } from './ui/label';
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from './ui/number-field';

const { effect, offEffect = false } = defineProps<{
	offEffect?: boolean;
	effect: EffectType;
}>();

const numLeds = 121;

const id = useId();
const durationId = `duration-${id}`;
const startLedIndexId = `led-index-slider-${id}`;

const parameter = offEffect ? LEDControllerParameter.OFF_EFFECT_PARAMETER : LEDControllerParameter.ON_EFFECT_PARAMETER;
const duration = ref(3000);
const startLedIndex = ref(0);

watch(duration, (newDuration) => {
	sendMessageToMCU(`${parameter} ${EffectParameter.DURATION} ${newDuration}`);
});

watch(startLedIndex, (newStartLedIndex) => {
	sendMessageToMCU(`${parameter} ${EffectParameter.START_LED_INDEX} ${newStartLedIndex}`);
});
</script>

<template>
	<div v-if="effect !== EffectType.NONE[0]" class="flex flex-col gap-y-3 px-1">
		<NumberField v-model="duration" :id="durationId" :min="0" :max="10000" class="mb-2">
			<Label :for="durationId" class="flex w-full justify-center">Duration</Label>
			<NumberFieldContent>
				<NumberFieldDecrement />
				<NumberFieldInput />
				<NumberFieldIncrement />
			</NumberFieldContent>
		</NumberField>

		<div v-if="effect === EffectType.LIGHTSABER[0]">
			<NumberField v-model="startLedIndex" :id="startLedIndexId" :min="0" :max="numLeds - 1">
				<Label :for="startLedIndexId" class="flex w-full justify-center">Start LED Index</Label>
				<NumberFieldContent>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldContent>
			</NumberField>
		</div>
	</div>
</template>
