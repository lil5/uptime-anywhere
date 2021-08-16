import type { Config, RawDataSite } from "./types"

import { getSiteCsvs } from "./api/sites"
import { getConfig } from "./api/config"

import LiveStatusList from "./components/LiveStatusList.svelte"
import Links from "./components/Links.svelte"
import ChartTooltip from "./components/ChartTooltip.svelte"

import { ERROR_GET_ELEMENT_BY_ID } from "./errors"

interface Data {
	csvs: PromiseSettledResult<RawDataSite>[]
	config: Config
}

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

async function prepareData(): Promise<Data> {
	const config = await getConfig()
	const csvs = await getSiteCsvs(config)

	return { csvs, config }
}

function render(data: Data) {
	// ---- links
	const elLinks = document.getElementById("links")
	if (!elLinks) throw Error(ERROR_GET_ELEMENT_BY_ID("links"))

	new Links({
		target: elLinks,
		props: {
			config: data.config,
		},
	})

	// ---- tooltip
	const elBody = document.body

	//@ts-ignore
	globalThis["my-tooltip"] = new ChartTooltip({
		target: elBody,
		props: {
			hidden: true,
			data: undefined,
		},
	})

	// ---- sections
	const elSections = document.getElementById("sections")
	if (!elSections) throw Error(ERROR_GET_ELEMENT_BY_ID("sections"))

	elSections.innerHTML = ""
	new LiveStatusList({
		target: elSections,
		props: {
			data: data.csvs,
		},
	})
}
