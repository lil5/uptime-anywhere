import {
	Chart,
	ChartConfiguration,
	ChartDataset,
	registerables,
} from "chart.js"

import { ERROR_GET_ELEMENT_BY_ID } from "../errors"
import { CalculatedDataSite, CalculatedDataItem, DataSite } from "../types"

Chart.register(...registerables)

export function generateChart(d: CalculatedDataSite) {
	console.log(d)
	const el = document.getElementById(`canvas-live-status-${d.name}`)
	if (!el) throw Error(ERROR_GET_ELEMENT_BY_ID(`canvas-live-status-${d.name}`))

	const isUp = false

	// similar to
	const config: ChartConfiguration<"scatter", any[]> = {
		type: "scatter",
		data: {
			datasets: [
				{
					fill: true,
					data: [
						{ x: 30, y: 20 },
						{ x: 40, y: 100 },
						{ x: 90, y: 120 },
						{ x: 120, y: 80 },
					],
					backgroundColor: isUp ? "#89e0cf" : "#F87171",
					borderWidth: 2,
				},
			],
			labels: ["1", "2", "3", "4"],
		},
		options: {
			animation: false,
			showLine: true,
			plugins: {
				legend: { display: false },
				filler: { propagate: false },
				tooltip: { enabled: false },
			},
			elements: {
				point: {
					radius: 0,
					hitRadius: 0,
				},
				line: {
					tension: 0,
					stepped: true,
				},
			},
			responsive: true,
			aspectRatio: 160 / 107,
			scales: {
				y: {
					display: false,
					grid: { display: false },
					beginAtZero: true,
				},
				yAxis: {
					ticks: { display: false },
					display: false,
					grid: { display: false },
				},
				x: {
					min: 30,
					max: 120,
					display: false,
					grid: { display: false },
				},
				xAxis: {
					display: false,
					grid: { display: false },
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
