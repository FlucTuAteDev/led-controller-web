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
import { sendMessageToMCUThrottled } from '@/lib/mcu';
import { state } from '@/store/state';
import { Command, EffectType } from '@/types/wsTypes';
import { computed } from 'vue';

const { offEffect = false } = defineProps<{
	offEffect?: boolean;
}>();

const label = offEffect ? 'Off effect' : 'On effect';
const previewCommand = offEffect ? Command.PREVIEW_OFF_EFFECT : Command.PREVIEW_ON_EFFECT;

const numLeds = 120;

const effectState = computed(() => (offEffect ? state.value.offEffect : state.value.onEffect));

function preview(): void {
	sendMessageToMCUThrottled(`${previewCommand}`);
}
</script>

<template>
	<div class="grid grid-rows-[min-content_1fr] pr-4 overflow-y-auto">
		<div class="flex flex-col items-center space-y-2 px-1">
			<Label>{{ label }}</Label>
			<Select v-model="effectState.type">
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
			<NumberField
				v-if="effectState.type !== EffectType.NONE[0]"
				v-model="effectState.duration"
				:min="0"
				:max="10000"
				class="mb-2"
			>
				<Label class="flex w-full justify-center">Duration</Label>
				<NumberFieldContent>
					<NumberFieldDecrement />
					<NumberFieldInput />
					<NumberFieldIncrement />
				</NumberFieldContent>
			</NumberField>

			<div v-if="effectState.type === EffectType.LIGHTSABER[0]">
				<NumberField v-model="effectState.startLedIndex" :min="0" :max="numLeds - 1">
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
