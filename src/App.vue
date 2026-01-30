<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

import Spinner from '@/components/ui/spinner/Spinner.vue';
import MainPage from '@/pages/MainPage.vue';

const mode = useColorMode({ disableTransition: false });
mode.value = 'dark';
</script>

<template>
	<Transition name="fade" mode="out-in">
		<Suspense>
			<MainPage></MainPage>
			<template #fallback>
				<div class="flex flex-col justify-center items-center">
					<Spinner class="size-12"></Spinner>
					<p class="font-bold">Fetching data...</p>
				</div>
			</template>
		</Suspense>
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

.color-temp-slider :deep([data-slot='slider-track']) {
	background: linear-gradient(to right, #ffd27f, #bbdfff);
}

.color-temp-slider :deep([data-slot='slider-range']) {
	background: transparent;
}
</style>
