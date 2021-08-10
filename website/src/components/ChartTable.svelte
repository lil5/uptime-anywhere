<script lang="ts">
	import type { ChartProps } from "../types"
	import {
		Chart,
		LineElement,
		BarElement,
		PointElement,
		LineController,
		ScatterController,
		LinearScale,
		TimeScale,
		LogarithmicScale,
		Filler,
		Tooltip,
	} from "chart.js"
	import "../libs/chartjs-adapter-dayjs"
	import { onMount } from "svelte"
	import config from "./chart.confg"

	Chart.register(
		LineElement,
		BarElement,
		PointElement,
		LineController,
		ScatterController,
		LinearScale,
		TimeScale,
		LogarithmicScale,
		Filler,
		Tooltip
	)

	export let data: ChartProps["data"]
	export let currentTime: ChartProps["currentTime"]
	export let earliestTime: ChartProps["earliestTime"]

	let el: HTMLCanvasElement
	let isMounted = false
	let chart: Chart

	onMount(() => {
		isMounted = true
	})
	$: {
		if (isMounted) {
			if (chart) {
				chart.destroy()
			}

			chart = new Chart(el, config(data, currentTime, earliestTime))
		}
	}
</script>

<canvas bind:this={el} width="160" height="107" />
