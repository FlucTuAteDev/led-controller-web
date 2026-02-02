<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from '@/components/ui/number-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialStateInjectionKey } from '@/injectionKeys';
import { sendMessageToMCUThrottled, sendMessageToMCUThrottledQueued } from '@/lib/mcu';
import { stateChanged } from '@/store/stateChanged';
import { Command, EffectParameter, EffectType } from '@/types/wsTypes';
import { inject, ref, watch } from 'vue';

const { offEffect = false } = defineProps<{
	offEffect?: boolean;
}>();

const initialState = inject(initialStateInjectionKey)!;

// const selectId = offEffect ? 'off-effect-select' : 'on-effect-select';
const label = offEffect ? 'Off effect' : 'On effect';
const initialEffectState = offEffect ? initialState.offEffect : initialState.onEffect;
const setCommand = offEffect ? Command.SET_OFF_EFFECT : Command.SET_ON_EFFECT;
const previewCommand = offEffect ? Command.PREVIEW_OFF_EFFECT : Command.PREVIEW_ON_EFFECT;

const effect = ref(initialEffectState.type);

const numLeds = 120;

const command = offEffect ? Command.SET_OFF_EFFECT_PARAMETER : Command.SET_ON_EFFECT_PARAMETER;
const duration = ref(initialEffectState.duration);
const startLedIndex = ref(initialEffectState.startLedIndex);

watch(effect, (newEffect) => {
	stateChanged.value = true;
	sendMessageToMCUThrottledQueued(`${setCommand} ${newEffect}`);
	if (newEffect !== EffectType.NONE[0]) {
		sendMessageToMCUThrottledQueued(getDurationMessage(duration.value));
	}
	if (newEffect === EffectType.LIGHTSABER[0]) {
		sendMessageToMCUThrottledQueued(getStartLedIndexMessage(startLedIndex.value));
	}
});

watch(duration, (newDuration) => {
	stateChanged.value = true;
	sendMessageToMCUThrottled(getDurationMessage(newDuration));
});

watch(startLedIndex, (newStartLedIndex) => {
	stateChanged.value = true;
	sendMessageToMCUThrottled(getStartLedIndexMessage(newStartLedIndex));
});

function getDurationMessage(duration: number): string {
	return `${command} ${EffectParameter.DURATION} ${duration}`;
}

function getStartLedIndexMessage(index: number): string {
	return `${command} ${EffectParameter.START_LED_INDEX} ${index}`;
}

function preview(): void {
	sendMessageToMCUThrottled(`${previewCommand}`);
}
</script>

<template>
	<div class="grid grid-rows-[min-content_1fr] pr-4 overflow-y-auto">
		<div class="flex flex-col items-center space-y-2 px-1">
			<Label>{{ label }}</Label>
			<Select v-model="effect">
				<SelectTrigger class="w-full">
					<SelectValue :placeholder="label" />
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
		<div class="flex flex-col gap-y-3 px-1 py-4 border-y-2 my-4">
			<NumberField v-if="effect !== EffectType.NONE[0]" v-model="duration" :min="0" :max="10000" class="mb-2">
				<Label class="flex w-full justify-center">Duration</Label>
				<NumberFieldContent>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldContent>
			</NumberField>

			<div v-if="effect === EffectType.LIGHTSABER[0]">
				<NumberField v-model="startLedIndex" :min="0" :max="numLeds - 1">
					<Label class="flex w-full justify-center">Start LED Index</Label>
					<NumberFieldContent>
						<NumberFieldDecrement />
						<NumberFieldInput />
						<NumberFieldIncrement />
					</NumberFieldContent>
				</NumberField>
			</div>
		</div>
		<Button class="dark" variant="outline" @click="preview">Preview</Button>
	</div>
</template>
