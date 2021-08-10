import dayjs, { Dayjs } from "dayjs"
import { ERROR_REJECTED_SITE } from "./errors"
import type {
	RawDataSite,
	Timeframe,
	CSVLine,
	DataItem,
	LiveStatusErrorProps,
	LiveStatusProps,
	Status,
} from "./types"

const CHART_MAX_HEIGHT = 1200
const CHART_MIN_HEIGHT = 20

interface CSVLineWithDayjs extends Omit<CSVLine, "timestamp"> {
	timestamp: Dayjs
}

export function calcData(
	settledSiteList: PromiseSettledResult<RawDataSite>[],
	timeframe: Timeframe
): Array<LiveStatusProps | LiveStatusErrorProps> {
	const currentTime = dayjs()

	const earliestTime = currentTime.subtract(...timeframe)

	let sites = settledSiteList.map((s) => {
		if (s.status === "rejected") {
			return {
				status: "error" as "error",
				title: ERROR_REJECTED_SITE(s.reason),
				err: s.reason as Error,
			}
		}

		return calcDataItems(s.value, currentTime, earliestTime)
	})

	return sites
}

function calcDataItems(
	d: RawDataSite,
	currentTime: Dayjs,
	earliestTime: Dayjs
): LiveStatusProps {
	/**
	 * lines inbetween current time and earliest time.
	 * 'timestamp' has been changed to a Day.js object.
	 */
	let linesWithDayjs: CSVLineWithDayjs[] = []

	// Start from end of csv array and decrement till beginning
	let i = d.csvLength - 1
	while (i >= 0) {
		let csvItem = d.csv[i]
		let csvItemDate = dayjs(csvItem.timestamp)
		// is after n
		if (csvItemDate.isBefore(earliestTime)) break
		// push to data
		linesWithDayjs.push({
			status: csvItem.status,
			responseTime: csvItem.responseTime,
			httpCode: csvItem.httpCode,
			timestamp: csvItemDate,
		})

		// Decrement
		i--
	}
	linesWithDayjs = linesWithDayjs.reverse()

	const statistics = calcStatistics(linesWithDayjs, currentTime)

	let data: DataItem[] = linesWithDayjs.map((d, i) => {
		return {
			...d,
			...statistics.perItemDimentions[i],
		}
	})

	let lastEntry: DataItem | undefined = data[data.length - 1]
	data.push({
		...lastEntry,
		x: currentTime.valueOf(),
	})

	return {
		status: lastEntry ? lastEntry.status : "up",
		name: d.name,
		link: d.url,
		icon: toBaseURL(d.url) + "/favicon.ico",
		percentageUptime: statistics.percentageUptime,
		avgResponseTime: statistics.averageResponseTime,
		chart: {
			data,
			currentTime,
			earliestTime,
		},
	}
}

interface Dimentions {
	x: number
	y: number
}
interface Statistics {
	averageResponseTime: number
	percentageUptime: number
	perItemDimentions: Dimentions[]
}
function calcStatistics(
	data: CSVLineWithDayjs[],
	currentTime: Dayjs
): Statistics {
	/** total weight difference between current and earliest time
	 *  by unix time  */
	let totalAvailibleWeightUnix = 0
	/** total weighted response time
	 * that is each response time * weight in unix time
	 */
	let totalWeightUnixResponseTime = 0
	/** maximum response time recorded */
	let maxResponseTime = 0
	/** total unix time that status is "up" */
	let totalUpWeightUnix = 0

	data.forEach((d, i) => {
		let nextDate: Dayjs

		if (data[i + 1]) {
			nextDate = data[i + 1].timestamp
		} else {
			nextDate = currentTime
		}

		/** weight is the difference between current and next unix timestamp */
		let weightUnix = nextDate.valueOf() - d.timestamp.valueOf()

		if (d.status === "up") totalUpWeightUnix += weightUnix
		if (maxResponseTime < d.responseTime) maxResponseTime = d.responseTime
		totalWeightUnixResponseTime += d.responseTime * weightUnix
		totalAvailibleWeightUnix += weightUnix
	})

	const averageResponseTime =
		totalWeightUnixResponseTime / totalAvailibleWeightUnix

	const percentageUptime = (totalUpWeightUnix / totalAvailibleWeightUnix) * 100

	/** list of dimintions of data */
	const perItemDimentions = data.map((d) => {
		let y = d.responseTime
		if (y > CHART_MAX_HEIGHT) y = CHART_MAX_HEIGHT
		if (y < CHART_MIN_HEIGHT) y = CHART_MIN_HEIGHT
		return {
			x: d.timestamp.valueOf(),
			y,
		}
	})

	return {
		averageResponseTime: Math.round(averageResponseTime),
		percentageUptime: Math.round(percentageUptime),
		perItemDimentions,
	}
}

function toBaseURL(fullURL: string) {
	return fullURL.replace(/https?:\/\/[^\/]*/g, (a) => a)
}
