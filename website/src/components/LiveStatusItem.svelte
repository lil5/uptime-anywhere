<script lang="ts">
	import ChartTable from "./ChartTable.svelte"
	import type { LiveStatusProps } from "../types"

	export let site: LiveStatusProps

	$: classStatus = site.status === "up" ? "card--default" : "card--danger"
</script>

<li class="card card--grid {classStatus}">
	<h4>
		<a href={site.link} target="_blank" rel="noreferrer" title="Go to site">
			<img class="align-middle inline-block" src={site.icon} alt="🌐" /></a
		>
		{site.name}
	</h4>
	<p>Overall uptime: {site.percentageUptime}%</p>
	<p>Average response time: {site.avgResponseTime} ms</p>
	<div class="card__chart">
		<ChartTable {...site.chart} />
	</div>
</li>
