import type { PromiseSettle, RawDataSite } from "./types"

import { getSiteCsvs } from "./api/sites"
import { getConfig } from "./api/config"

import LiveStatusList from "./components/LiveStatusList.svelte"
import ChartTooltip from "./components/ChartTooltip.svelte"
import { ERROR_GET_ELEMENT_BY_ID } from "./errors"

async function init() {
	const waitLoad = waitDocumentLoad()
	const waitData = prepareData()

	const [, data] = await Promise.all([waitLoad, waitData])

	render(data)
}
init()

async function waitDocumentLoad() {
	return new Promise<void>((resolve) =>
		window.addEventListener("load", () => resolve())
	)
}

async function prepareData(): PromiseSettle<RawDataSite> {
	const config = await getConfig()
	const csvs = await getSiteCsvs(config)

	return csvs
}

function render(data: PromiseSettledResult<RawDataSite>[]) {
	// tooltip
	const elBody = document.body

	//@ts-ignore
	globalThis["my-tooltip"] = new ChartTooltip({
		target: elBody,
		props: {
			hidden: true,
		},
	})

	// sections
	const elSections = document.getElementById("sections")
	if (!elSections) throw Error(ERROR_GET_ELEMENT_BY_ID("sections"))

	elSections.innerHTML = ""
	new LiveStatusList({
		target: elSections,
		props: {
			data,
		},
	})
}
