import { CalculatedDataSite, PromiseSettle } from "./types"

import { getSiteCsvs } from "./api/sites"
import { getConfig } from "./api/config"

import { calcData } from "./data"
import { renderChart, renderHtml } from "./html/render"

async function init() {
	const waitLoad = waitDocumentLoad()
	const waitData = prepareData()

	const [, data] = await Promise.all([waitLoad, waitData])

	renderHtml(data)
	renderChart(data)
}
init()

async function waitDocumentLoad() {
	return new Promise<void>((resolve) =>
		window.addEventListener("load", () => resolve())
	)
}

async function prepareData(): PromiseSettle<CalculatedDataSite> {
	const config = await getConfig()
	const csvs = getSiteCsvs(config)

	const data = await calcData(csvs, [7, "days"])

	return data
}
