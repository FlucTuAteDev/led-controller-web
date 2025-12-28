import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		vueDevTools(),
		compression({
			algorithms: ['gzip'],
			deleteOriginalAssets: true,
		}),
	],
	build: {
		reportCompressedSize: false,
		emptyOutDir: true,
		outDir: '../led-controller-firmware/data',
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
