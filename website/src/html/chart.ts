import {
	Chart,
	ChartConfiguration,
	ChartDataset,
	registerables,
	ScriptableLineSegmentContext,
} from "chart.js"

import { ERROR_GET_ELEMENT_BY_ID } from "../errors"
import { CalculatedDataSite, CalculatedDataItem, DataSite } from "../types"

Chart.register(...registerables)

const WARNING = "#F87171"
const DEFAULT = "#89e0cf"

export function generateChart(d: CalculatedDataSite) {
	const el = document.getElementById(`canvas-live-status-${d.name}`)
	if (!el) throw Error(ERROR_GET_ELEMENT_BY_ID(`canvas-live-status-${d.name}`))

	const data = [
		{ x: 30, y: 20, date: "2021-05-02", status: "up" },
		{ x: 40, y: 100, date: "2021-05-01", status: "up" },
		{ x: 90, y: 120, date: "2021-05-01", status: "down" },
		{ x: 119, y: 80, date: "2021-05-08", status: "up" },
		{ x: 120, y: 80, date: "2021-05-08", status: "up" },
	]

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
						label: (ctx) => `${data[ctx.dataIndex].y} ms`,
						afterLabel: (ctx) => `${data[ctx.dataIndex].date}`,
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
					min: 30,
					max: 120,
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

// this finds the where to start reading from the csv data

function generateDataSet(): ChartDataset<"line", number[]> {
	return
}
