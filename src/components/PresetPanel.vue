<script setup lang="ts">
import PresetButton from '@/components/PresetButton.vue';
import { Button } from '@/components/ui/button';
import { state, type State } from '@/store/state';
import { useLocalStorage } from '@vueuse/core';
import { Plus } from 'lucide-vue-next';
import { toRaw } from 'vue';

const presets = useLocalStorage<Map<string, State>>('presets', new Map());

function addCurrentStateToPresets(): void {
	const presetCount = presets.value.size;
	const newPresetId = presetCount + 1;
	presets.value.set(`Preset ${newPresetId}`, structuredClone(toRaw(state.value)));
}

function setName(newName: string, oldName: string): void {
	const preset = presets.value.get(oldName);
	if (!preset) return;

	presets.value.delete(oldName);
	presets.value.set(newName, preset);
}

function setPreset(presetName: string): void {
	const preset = presets.value.get(presetName);
	if (!preset) return;

	state.value = structuredClone(toRaw(preset));
}

function deletePreset(presetName: string): void {
	presets.value.delete(presetName);
}
</script>

<template>
	<div class="flex flex-col gap-y-2 items-center overflow-x-auto px-2">
		<div class="flex gap-x-2">
			<Button variant="outline" @click="addCurrentStateToPresets"> <Plus></Plus>Add as preset </Button>
		</div>
		<div class="flex gap-x-2 justify-center-safe w-full pb-10 overflow-x-auto">
			<PresetButton
				v-for="[presetName, preset] in presets"
				:key="presetName"
				:presetName
				:preset
				@set-preset="setPreset($event)"
				@set-name="setName($event, presetName)"
				@delete="deletePreset($event)"
			></PresetButton>
		</div>
	</div>
</template>
