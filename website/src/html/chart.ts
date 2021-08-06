import {
	Chart,
	ChartConfiguration,
	registerables,
	ScriptableLineSegmentContext,
} from "chart.js"

import { ERROR_GET_ELEMENT_BY_ID } from "../errors"
import { ChartDataItem } from "../types"

Chart.register(...registerables)

const WARNING = "#F87171"
const DEFAULT = "#89e0cf"

const DATE_FORMAT = "LLL"

export function generateChart(
	data: ChartDataItem[],
	xAxisMax: number,
	siteName: string
) {
	const el = document.getElementById(`canvas-live-status-${siteName}`)
	if (!el)
		throw Error(ERROR_GET_ELEMENT_BY_ID(`canvas-live-status-${siteName}`))

	function statusColor(ctx: ScriptableLineSegmentContext): string {
		return data[ctx.p0DataIndex].status === "up" ? DEFAULT : WARNING
	}

	const config: ChartConfiguration<"scatter", any[]> = {
		type: "scatter",
		data: {
			datasets: [
				{
					fill: true,
					data,
					borderWidth: -10,
					segment: {
						backgroundColor: statusColor,
					},
				},
			],
		},
		options: {
			animation: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					enabled: true,
					displayColors: false,
					callbacks: {
						label: (ctx) =>
							`${data[ctx.dataIndex].httpCode} ${data[ctx.dataIndex].y} ms`,
						afterLabel: (ctx) =>
							`${data[ctx.dataIndex].timestamp.format(DATE_FORMAT)}`,
					},
				},
			},
			elements: {
				line: {
					stepped: true,
					borderWidth: 0,
				},
			},
			interaction: {
				mode: "nearest",
				intersect: false,
			},
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: 160 / 107,
			scales: {
				y: {
					beginAtZero: true,
					display: false,
				},
				yAxis: {
					display: false,
				},
				x: {
					min: 0,
					max: xAxisMax,
					display: false,
				},
				xAxis: {
					display: false,
				},
			},
		},
	}

	new Chart(el as HTMLCanvasElement, config)
}
