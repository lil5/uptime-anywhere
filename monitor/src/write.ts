import { CSVRecord } from "./types"
import fs, { promises as fsp } from "fs"
import * as path from "path"
import { readLastLinesWithFileHandle } from "./lib/read-last-lines"
import dayjs from "dayjs"
import SiteStatusChange from "./site-status-change.class"

const DELIMITER = ","
const LATER_THAN: [number, dayjs.OpUnitType] = [6, "hours"]
const basePath = path.join("public", "data")
const csvHeaders = "status,responseTime,httpCode,timestamp"

export async function writeAll(
	httpResults: Record<string, CSVRecord>
): Promise<{
	hasAnyWritten: boolean
	sscList: Record<string, SiteStatusChange>
}> {
	let hasAnyWritten = false
	let sscList: Record<string, SiteStatusChange> = {}

	for (let siteName in httpResults) {
		let result = httpResults[siteName]

		if (!result) {
			console.error({ result, siteName, httpResults })
			throw new Error(`result is undefined from ${httpResults[siteName]}`)
		}

		const { hasWritten, ssc } = await write(siteName, result)
		sscList[siteName] = ssc
		if (hasWritten) {
			hasAnyWritten = true
		}
	}

	return { hasAnyWritten, sscList }
}

async function write(
	siteName: string,
	currentRecord: CSVRecord
): Promise<{ hasWritten: boolean; ssc: SiteStatusChange }> {
	let hasWritten = false
	const csvData =
		[
			currentRecord.status,
			currentRecord.responseTime,
			currentRecord.httpCode,
			currentRecord.timestamp,
		].join(DELIMITER) + "\n"

	const fp = path.join(basePath, `${siteName}.csv`)
	const { f, fstats } = await openFile(fp)

	let lastRecord: CSVRecord | null = null
	if (fstats) {
		lastRecord = await getLastCSVRecord(f, fstats).catch(async (err) => {
			await f.close()
			throw err
		})
	}

	// see if it is nessesary to write
	const ssc = getSiteStatusChange(lastRecord, currentRecord)

	// if there are no changes skip write and return
	if (!ssc.ShouldWrite())
		return {
			hasWritten: false,
			ssc,
		}

	// append or create file
	await fsp.appendFile(f, csvData, { encoding: "utf8" })

	await f.close()

	return { hasWritten, ssc }
}

export function getSiteStatusChange(
	lastRecord: CSVRecord | null,
	currentRecord: CSVRecord
): SiteStatusChange {
	if (lastRecord === null) {
		return new SiteStatusChange({ first: true })
	}

	if (lastRecord.status !== currentRecord.status) {
		if (currentRecord.status === "up") {
			return new SiteStatusChange({ changedToUp: true })
		}

		return new SiteStatusChange({ changedToDown: true })
	}

	const currentTime = dayjs(currentRecord.timestamp)
	const lastTime = dayjs(lastRecord.timestamp)
	const lastTimePlusN = lastTime.subtract(...LATER_THAN)

	const isNotLaterThanN = currentTime > lastTimePlusN
	return new SiteStatusChange({ laterThanN: !isNotLaterThanN })
}

export async function getLastCSVRecord(
	f: fsp.FileHandle,
	fstats: fs.Stats
): Promise<null | CSVRecord> {
	const buf = await readLastLinesWithFileHandle(f, fstats)
	const lastLine = buf.toString("utf-8")

	const csv = lastLine.replace("\n", "").split(DELIMITER)

	if (csv.length !== 4) throw new Error(`Last CSV line invalid ${lastLine}`)

	return {
		status: csv[0],
		responseTime: parseInt(csv[1], 10),
		httpCode: parseInt(csv[2], 10),
		timestamp: csv[3],
	}
}

export async function openFile(fpath: string) {
	const fstats = await fsp.stat(fpath).catch((err) => {
		if (err.code !== "ENOENT") {
			throw err
		}
		return null
	})
	const f = await fsp.open(fpath, "a+")
	return { fstats, f }
}
