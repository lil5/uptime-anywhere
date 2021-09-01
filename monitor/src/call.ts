import got, { OptionsOfTextResponseBody, Method } from "got"
import { ConfigSite, CSVRecord, S_DOWN, S_UP } from "./types"

// //@ts-ignore
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

export async function callAll(
	sites: ConfigSite[]
): Promise<Record<string, CSVRecord>> {
	const ws: Promise<CSVRecord>[] = []
	for (let i = 0; i < sites.length; i++) {
		const site = sites[i]

		ws.push(call(site))
	}

	const callRes = await Promise.all(ws)

	let resultDict: Record<string, CSVRecord> = {}
	for (let i = 0; i < sites.length; i++) {
		const site = sites[i]

		resultDict[site.name] = callRes[i]
	}

	return resultDict
}

export async function call(site: ConfigSite): Promise<CSVRecord> {
	let status = S_DOWN
	let method = "get"
	if (site.method) {
		method = site.method
	}
	let timeout = 3000
	if (site.maxResponseTime) {
		timeout = site.maxResponseTime
	}

	const controller = new AbortController()
	const requestConfig: OptionsOfTextResponseBody = {
		method: method as Method,
		timeout,
	}
	if (site.insecure) {
		requestConfig.https = {
			rejectUnauthorized: false,
		}
	}

	const startTime = new Date()
	const response = await got(site.url, requestConfig).catch((err: Error) => err)
	const endTime = new Date()

	const responseTime = endTime.valueOf() - startTime.valueOf()
	if (response instanceof Error) {
		let httpCode = 0
		if (response instanceof got.HTTPError) {
			httpCode = response.response.statusCode
		}
		return {
			status: S_DOWN,
			responseTime,
			httpCode,
			timestamp: startTime.toISOString(),
		}
	}

	if (site.expectedStatusCodes) {
		status = site.expectedStatusCodes.includes(response.statusCode)
			? S_UP
			: S_DOWN
	} else {
		status =
			response.statusCode >= 200 && response.statusCode < 300 ? S_UP : S_DOWN
	}

	return {
		status,
		responseTime,
		httpCode: response.statusCode,
		timestamp: startTime.toISOString(),
	}
}
