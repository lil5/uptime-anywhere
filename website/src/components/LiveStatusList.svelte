<script lang="ts">
	import { calcData } from "../data"

	import type {
		LiveStatusErrorProps,
		LiveStatusProps,
		RawDataSite,
		Timeframe,
	} from "../types"
	import LiveStatusItem from "./LiveStatusItem.svelte"

	// props
	export let data: PromiseSettledResult<RawDataSite>[]

	type TimeOptions = "24H" | "7D" | "30D"
	let selectedTimeScale: TimeOptions = "7D"

	$: sites = runCalcData()

	function runCalcData(): Array<LiveStatusProps | LiveStatusErrorProps> {
		let timeframe: Timeframe
		switch (selectedTimeScale) {
			case "24H":
				timeframe = [24, "hours"]
				break
			case "7D":
				timeframe = [7, "days"]
				break
			case "30D":
				timeframe = [30, "days"]
				break
		}

		return calcData(data, timeframe)
	}
</script>

<section class="section">
	<div class="section__title">
		<h2>Live Status</h2>
		<div>
			<label
				class:font-bold={selectedTimeScale === "24H"}
				class="ml-1 cursor-pointer"
				><input
					type="radio"
					name="live-status-time"
					bind:group={selectedTimeScale}
					class="appearance-none"
					value="24H"
				/><time datetime="24H">24h</time></label
			>
			<label
				class:font-bold={selectedTimeScale === "7D"}
				class="ml-1 cursor-pointer"
				><input
					type="radio"
					name="live-status-time"
					bind:group={selectedTimeScale}
					class="appearance-none"
					value="7D"
				/><time datetime="7D">7d</time></label
			>
			<label
				class:font-bold={selectedTimeScale === "30D"}
				class="ml-1 cursor-pointer"
				><input
					type="radio"
					name="live-status-time"
					bind:group={selectedTimeScale}
					class="appearance-none"
					value="30D"
				/><time datetime="30D">30d</time></label
			>
		</div>
	</div>
	<ul id="live-status">
		{#each sites as site}
			{#if site.status === "error"}
				<li class="card card--danger">
					<h4>{site.title}</h4>
					<p>{site.err.stack}</p>
				</li>
			{:else}
				<LiveStatusItem {site} />
			{/if}
		{/each}
	</ul>
</section>
