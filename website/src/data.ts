import dayjs, { Dayjs } from "dayjs"
import { ERROR_REJECTED_SITE } from "./errors"
import type {
	RawDataSite,
	Timeframe,
	CSVLine,
	DataItem,
	LiveStatusErrorProps,
	LiveStatusProps,
} from "./types"

const CHART_WIDTH = 160
const CHART_HEIGHT = 107

interface CSVLineWithDayjs extends Omit<CSVLine, "timestamp"> {
	timestamp: Dayjs
}

export function calcData(
	settledSiteList: PromiseSettledResult<RawDataSite>[],
	timeframe: Timeframe
): Array<LiveStatusProps | LiveStatusErrorProps> {
	const currentTime = dayjs()

	const earliestTime = currentTime.subtract(...timeframe)

	return settledSiteList.map((s) => {
		if (s.status === "rejected") {
			return {
				status: "error",
				title: ERROR_REJECTED_SITE(s.reason),
				err: s.reason,
			}
		}

		return calcDataItems(s.value, currentTime, earliestTime)
	})
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

	const statistics = calcStatistics(linesWithDayjs, currentTime, earliestTime)

	let data: DataItem[] = linesWithDayjs.map((d, i) => {
		return {
			...d,
			...statistics.perItemDimentions[i],
		}
	})

	let lastEntry = data[data.length - 1]

	return {
		status: lastEntry.status,
		name: d.name,
		link: d.url,
		icon: toBaseURL(d.url) + "/favicon.ico",
		percentageUptime: statistics.percentageUptime,
		avgResponseTime: statistics.averageResponseTime,
		chart: data,
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
	currentTime: Dayjs,
	earliestTime: Dayjs
): Statistics {
	/** total weight measured by unix time  */
	let timespanWeightUnix = currentTime.valueOf() - earliestTime.valueOf()
	/** total weight difference between current and earliest time
	 *  by unix time  */
	let totalAvailibleWeightUnix = 0
	/** total response time in milliseconds */
	let totalResponseTime = 0
	/** total weighted response time
	 * that is each response time * weight in unix time
	 */
	let totalWeightUnixResponseTime = 0
	/** maximum response time recorded */
	let maxResponseTime = 0
	/** total unix time that status is "up" */
	let totalUpWeightUnix = 0
	/** unix time difference in an array where the index is keyed to data */
	let perItemWeightUnix: number[] = []

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
		totalResponseTime += d.responseTime
		totalWeightUnixResponseTime += d.responseTime * weightUnix
		totalAvailibleWeightUnix += weightUnix
		perItemWeightUnix[i] = weightUnix
	})

	const averageResponseTime =
		totalWeightUnixResponseTime / totalAvailibleWeightUnix

	const percentageUptime = (totalUpWeightUnix / totalAvailibleWeightUnix) * 100

	/** list of dimintions of data */
	const perItemDimentions = perItemWeightUnix.map((itemWeightUnix, i) => {
		return {
			x: (itemWeightUnix / totalAvailibleWeightUnix) * CHART_WIDTH,
			y: (data[i].responseTime / totalResponseTime) * CHART_HEIGHT,
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
