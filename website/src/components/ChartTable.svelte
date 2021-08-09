<script lang="ts">
	import type { DataItem } from "../types"
	import {
		Chart,
		LineElement,
		PointElement,
		LineController,
		ScatterController,
		LinearScale,
		LogarithmicScale,
		Tooltip,
	} from "chart.js"
	import { onMount } from "svelte"
	import config from "./chart.confg"

	Chart.register(
		LineElement,
		PointElement,
		LineController,
		ScatterController,
		LinearScale,
		LogarithmicScale,
		Tooltip
	)

	export let data: DataItem[]

	let el: HTMLCanvasElement
	let isMounted = false

	onMount(() => {
		isMounted = true
	})
	$: {
		if (isMounted) {
			new Chart(el, config(data))
		}
	}
</script>

<canvas bind:this={el} width="160" height="107" />
