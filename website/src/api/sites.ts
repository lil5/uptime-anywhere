import axios from "axios"
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
		a.push(getSiteCsv(c, site))
	}

	return await Promise.allSettled(a)
}

async function getSiteCsv(c: Config, site: ConfigSite): Promise<RawDataSite> {
	const url = genUrlByHost(c, site.name)
	const res = await axios.get(url)

	const data = csv.parse<CSVLine>(res.data, CSV_OPTIONS)

	return {
		name: site.name,
		url: site.url,
		csvLength: data.data.length,
		csv: data.data,
	}
}

function genUrlByHost(c: Config, site: string): string {
	switch (c.host) {
		case "gitlab":
			return `https://gitlab.com/${c.owner}/${c.repo}/-/raw/${c.branch}/data/${site}.csv`
		case "github":
			return `https://raw.githubusercontent.com/${c.owner}/${c.repo}/${c.branch}/data/${site}.csv`
		default:
			return c.host
				.replace("{{owner}}", c.owner)
				.replace("{{repo}}", c.repo)
				.replace("{{branch}}", c.branch)
				.replace("{{site}}", site)
	}
}
