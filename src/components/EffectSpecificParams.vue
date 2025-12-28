<script lang="ts" setup>
import { EffectType } from '@/types/wsTypes';
import { useId } from 'vue';
import { Label } from './ui/label';
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from './ui/number-field';
import { Slider } from './ui/slider';

const { effect } = defineProps<{
	effect: EffectType;
}>();

const numLeds = 121;

const id = useId();
const durationId = `duration-${id}`;
const ledIndexSliderId = `led-index-slider-${id}`;
</script>

<template>
	<div v-if="effect !== EffectType.NONE[0]" class="flex flex-col gap-y-3">
		<NumberField :id="durationId" :default-value="3000" :min="0" :max="10000">
			<Label :for="durationId" class="flex w-full justify-center">Duration</Label>
			<NumberFieldContent>
				<NumberFieldDecrement />
				<NumberFieldInput />
				<NumberFieldIncrement />
			</NumberFieldContent>
		</NumberField>

		<div class="px-2">
			<Label :for="ledIndexSliderId" class="flex w-full justify-center mb-4">Start LED Index</Label>
			<Slider :id="ledIndexSliderId" :min="0" :max="numLeds" show-thumb-value>
				<template #thumb-value="{ value }"> {{ value }} </template>
			</Slider>
		</div>
	</div>
</template>
