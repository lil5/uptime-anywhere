import type {
	ChartConfiguration,
	BubbleDataPoint,
	Chart,
	ChartTypeRegistry,
	ScatterDataPoint,
	TooltipModel,
} from "chart.js"
import type { Dayjs } from "dayjs"
import type { SvelteComponent } from "svelte"
import type { DataItem } from "../types"
import pattern from "patternomaly"

const WARNING = "#F87171"
const DEFAULT = "#89e0cf"

export default function config(
	data: DataItem[],
	currentTime: Dayjs,
	earliestTime: Dayjs
): ChartConfiguration<"scatter", DataItem[]> {
	return {
		type: "scatter",
		data: {
			datasets: [
				{
					fill: true,
					data,
					borderWidth: -10,
					segment: {
						backgroundColor: (ctx: any) =>
							data[ctx.p0DataIndex].status === "up"
								? DEFAULT
								: pattern.draw("zigzag-vertical", WARNING),
					},
				},
			],
		},
		options: {
			animation: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					enabled: false,
					position: "nearest",
					external: externalTooltipHandeler,
				},
			},
			elements: {
				line: {
					stepped: true,
					borderWidth: 3,
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
				yAxis: {
					display: false,
					min: 0,
					max: 1200,
				},
				xAxis: {
					type: "time",
					min: earliestTime.valueOf(),
					max: currentTime.valueOf(),
					display: false,
				},
			},
		},
	}
}

type ScatterChart = Chart<
	keyof ChartTypeRegistry,
	(number | ScatterDataPoint | BubbleDataPoint | null)[],
	unknown
>
type Tooltip = TooltipModel<"scatter">

function externalTooltipHandeler(ctx: {
	chart: ScatterChart
	tooltip: Tooltip
}) {
	const { tooltip } = ctx
	let dataPoint = tooltip.dataPoints[0]

	//@ts-ignore
	let dataItem: DataItem = dataPoint.dataset.data[dataPoint.dataIndex]

	//@ts-ignore
	const compontent: SvelteComponent = globalThis["my-tooltip"]

	let hidden = !tooltip.opacity

	if (hidden) {
		compontent.$set({ hidden: true })
		return
	}

	compontent.$set({
		hidden: false,
		data: dataItem,
	})
}
