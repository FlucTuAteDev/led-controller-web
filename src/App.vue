<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import { getInitialState } from '@/config';
import MainPage from '@/pages/MainPage.vue';
import { setupStateWatchers, state } from '@/store/state';
import { ref } from 'vue';

const mode = useColorMode({ disableTransition: false });
mode.value = 'dark';

const loadingInitialState = ref(true);
getInitialState().then((initialState) => {
	state.value = initialState;

	loadingInitialState.value = false;

	setupStateWatchers();
});
</script>

<template>
	<Transition name="fade" mode="out-in">
		<div v-if="loadingInitialState" class="flex flex-col justify-center items-center">
			<Spinner class="size-12"></Spinner>
			<p class="font-bold">Fetching data...</p>
		</div>
		<MainPage v-else></MainPage>
	</Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
