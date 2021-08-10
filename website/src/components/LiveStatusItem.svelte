<script lang="ts">
	import ChartTable from "./ChartTable.svelte"
	import type { LiveStatusProps } from "../types"

	export let site: LiveStatusProps

	$: classStatus = site.status === "up" ? "card--default" : "card--danger"
</script>

<li class="card card--grid {classStatus}">
	<h4>
		<img src={site.icon} alt={`Favicon for ${site.name}`} />
		<a href={site.link}>{site.name}</a>
	</h4>
	<p>Overall uptime: {site.percentageUptime}%</p>
	<p>Average response time: {site.avgResponseTime} ms</p>
	<div class="card__chart">
		<ChartTable {...site.chart} />
	</div>
</li>
