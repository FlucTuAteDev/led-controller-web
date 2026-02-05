<script setup lang="ts">
import ColorPanel from '@/components/ColorPanel.vue';
import EffectPanel from '@/components/EffectPanel.vue';
import { Button } from '@/components/ui/button';
import { sendMessageToMCU } from '@/lib/mcu';
import { stateChanged } from '@/store/state';
import { Command } from '@/types/wsTypes';
import { Save } from 'lucide-vue-next';

function save(): void {
	stateChanged.value = false;
	sendMessageToMCU(`${Command.SAVE}`);
}
</script>

<template>
	<div class="grid grid-rows-[max-content_max-content] w-full h-full content-center-safe max-w-150">
		<div class="grid grid-cols-2 p-4 border-b-2">
			<EffectPanel class="pr-4 border-r-2"></EffectPanel>
			<EffectPanel class="pl-4" off-effect></EffectPanel>
		</div>
		<ColorPanel></ColorPanel>
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
	<!-- <div class="grid grid-rows-[max-content_max-content] w-full h-full content-center-safe max-w-150">
		<PresetPanel></PresetPanel>
	</div> -->

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
</style>
