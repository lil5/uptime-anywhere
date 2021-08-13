import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default ({mode}) => defineConfig({
	plugins: [svelte()],
	publicDir: mode === 'production' ? false : '../data',
	base: mode === 'production' ? "./" : '/',
	build: {
		outDir: "build"
	}
})
