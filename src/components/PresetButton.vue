<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import type { State } from '@/store/state';
import { vOnClickOutside } from '@vueuse/components';
import { useEventListener } from '@vueuse/core';
import { Edit, Save, Trash, X } from 'lucide-vue-next';
import { nextTick, ref, useTemplateRef } from 'vue';

const { presetName } = defineProps<{
	presetName: string;
	// TODO: Do something with this
	preset: State;
}>();

const emit = defineEmits<{
	'set-preset': [name: string];
	'set-name': [newName: string];
	delete: [name: string];
}>();

const presetButton = useTemplateRef('preset-button');
const editableDiv = useTemplateRef('editable-div');

const showEditButtons = ref(false);
const isEditing = ref(false);

function onContextMenu(): void {
	showEditButtons.value = !showEditButtons.value;
}

async function toggleEdit(): Promise<void> {
	if (!editableDiv.value) return;

	isEditing.value = !isEditing.value;

	if (isEditing.value) {
		await nextTick();

		editableDiv.value.focus();
		getSelection()?.selectAllChildren(editableDiv.value);
	} else {
		saveEdit();
	}
}

function saveEdit(): void {
	emit('set-name', editableDiv.value!.textContent);
	showEditButtons.value = false;
}

function cancelEdit(): void {
	isEditing.value = false;
	editableDiv.value!.textContent = presetName;
}

function deletePreset(): void {
	emit('delete', presetName);

	showEditButtons.value = false;
}

function setPreset(): void {
	emit('set-preset', presetName);
}

useEventListener(window, 'pointerdown', (e) => {
	if (presetButton.value!.$el.contains(e.target)) return;

	cancelEdit();
	showEditButtons.value = false;
});
</script>

<template>
	<Button
		ref="preset-button"
		variant="outline"
		class="relative"
		@contextmenu.prevent="onContextMenu"
		@click="setPreset"
	>
		<div
			ref="editable-div"
			class="preset-button-editable"
			:contenteditable="isEditing"
			@keydown.enter.prevent="saveEdit"
			@keydown.esc="cancelEdit"
		>
			{{ presetName }}
		</div>

		<Transition name="slide">
			<!-- Prevent mousedown to stop blur on the contenteditable div -->
			<ButtonGroup
				v-if="showEditButtons"
				class="absolute -bottom-1 left-[50%] -translate-x-[50%] translate-y-full"
				@click.stop
				v-on-click-outside="() => (showEditButtons = false)"
			>
				<Button variant="secondary" @click="toggleEdit">
					<Edit v-if="!isEditing"></Edit>
					<Save v-else></Save>
				</Button>
				<Button v-if="isEditing" variant="secondary" @click="cancelEdit">
					<X></X>
				</Button>
				<Button v-if="!isEditing" variant="destructive" @click="deletePreset">
					<Trash></Trash>
				</Button>
			</ButtonGroup>
		</Transition>
	</Button>
</template>

<style scoped>
.preset-button-editable:not([contenteditable='true']) {
	user-select: none;
}

.slide-enter-active,
.slide-leave-active {
	transition-property: translate, opacity;
	transition-duration: 0.2s;
	transition-timing-function: ease;
}

.slide-enter-from,
.slide-leave-to {
	translate: -50% 0;
	opacity: 0;
}
</style>
