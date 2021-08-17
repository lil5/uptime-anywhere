import csv, { ParseConfig } from "papaparse"
import type { CSVLine, RawDataSite, Config, ConfigSite } from "../types"

const CSV_OPTIONS: ParseConfig = {
	newline: "\n",
	header: true,
	dynamicTyping: {
		name: false,
		status: false,
		responseTime: true,
		httpCode: true,
		timestamp: false,
	},
	fastMode: true,
	skipEmptyLines: true,
}

export async function getSiteCsvs(c: Config): PromiseSettle<RawDataSite> {
	let a: Promise<RawDataSite>[] = []
	for (let site of c.sites) {
		a.push(getSiteCsv(site))
	}

	return await Promise.allSettled(a)
}

async function getSiteCsv(site: ConfigSite): Promise<RawDataSite> {
	const url = genUrlByHost(site.name)
	const res = await fetch(url, { cache: "no-cache" })
	const resBody = await res.text()

	const data = csv.parse<CSVLine>(resBody, CSV_OPTIONS)

	return {
		name: site.name,
		url: site.url,
		csvLength: data.data.length,
		csv: data.data,
	}
}

function genUrlByHost(site: string): string {
	let siteDir = "./data/"
	//@ts-ignore
	const globalSiteDir = globalThis["siteDir"]

	if (globalSiteDir) {
		siteDir = globalSiteDir
	}

	return `${siteDir}${site}.csv`
}
