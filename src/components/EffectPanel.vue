<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendMessageToMCU } from '@/lib/mcu';
import { EffectType, LEDControllerParameter } from '@/types/wsTypes';
import { ref, watch } from 'vue';
import EffectSpecificParams from './EffectSpecificParams.vue';

const { offEffect = false } = defineProps<{
	offEffect?: boolean;
}>();

const label = offEffect ? 'Off effect' : 'On effect';
const parameter = offEffect ? LEDControllerParameter.OFF_EFFECT : LEDControllerParameter.ON_EFFECT;

const effect = ref<EffectType>(EffectType.LIGHTSABER[0]);

watch(effect, (newEffect) => {
	sendMessageToMCU(`${parameter} ${newEffect}`);
});
</script>

<template>
	<div class="grid grid-rows-[min-content_1fr] pr-4 overflow-hidden">
		<div class="flex flex-col items-center pb-4 border-b-2 space-y-2 px-1">
			<Label for="startup-anim-select">{{ label }}</Label>
			<Select id="startup-anim-select" v-model="effect">
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
		<EffectSpecificParams class="py-4 overflow-y-auto overflow-x-hidden" :offEffect :effect></EffectSpecificParams>
	</div>
</template>
