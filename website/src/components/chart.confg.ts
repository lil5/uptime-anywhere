import type { ChartConfiguration } from "chart.js"

const WARNING = "#F87171"
const DEFAULT = "#89e0cf"
const DATE_FORMAT = "YYYY-MM-DD HH:mm"

interface S {
	x: number
	y: number
}

function config<D extends S>(
	data: Array<D>
): ChartConfiguration<"scatter", D[]> {
	return {
		type: "scatter",
		data: {
			datasets: [
				{
					fill: true,
					data,
					borderWidth: -10,
					segment: {
						// backgroundColor: (ctx: any) =>
						// 	data[ctx.p0DataIndex].status === "up" ? DEFAULT : WARNING,
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
						// label: (ctx: any) =>
						// 	`${data[ctx.dataIndex].httpCode} ${data[ctx.dataIndex].w} ms`,
						// afterLabel: (ctx: any) =>
						// 	`${data[ctx.dataIndex].timestamp.format(DATE_FORMAT)}`,
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
					min: 0,
					max: 100,
					display: false,
				},
				yAxis: {
					display: false,
				},
				x: {
					min: 0,
					max: 160,
					display: false,
				},
				xAxis: {
					display: false,
				},
			},
		},
	}
}

export default config
