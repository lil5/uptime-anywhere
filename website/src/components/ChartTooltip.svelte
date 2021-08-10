<script lang="ts">
	import type { DataItem } from "../types"

	export let hidden: string | undefined
	export let data: DataItem | undefined

	const DATE_FORMAT = "YYYY-MM-DD HH:mm"

	let left = 0
	let top = 0

	function mousemove(e: MouseEvent) {
		left = e.pageX
		top = e.pageY
	}
</script>

<svelte:body on:mousemove={mousemove} />

<div
	id="tooltip"
	class="block rounded-md border fixed border-gray-400 transform -translate-x-1/2 translate-y-5 cursor-default p-1 bg-white bg-opacity-80 duration-500 transition-opacity {hidden
		? 'invisible opacity-0'
		: 'visible'}"
	style={`left: ${left}px; top: ${top}px`}
	aria-hidden
>
	{#if data}
		<span
			class="font-bold"
			class:text-red-500={data.status === "down"}
			class:text-green-500={data.status === "up"}>{data.httpCode}</span
		>
		<span>{data.responseTime} ms</span><br />
		<span class="text-sm">{data.timestamp.format(DATE_FORMAT)}</span>
	{/if}
</div>
