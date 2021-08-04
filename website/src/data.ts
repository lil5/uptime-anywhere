import dayjs, { Dayjs } from "dayjs"
import {
	CalculatedDataSite,
	CalculatedDataItem,
	DataSite,
	PromiseSettle,
	Timeframe,
} from "./types"

export function calcData(
	dataWaitList: Promise<DataSite>[],
	timeframe: Timeframe
): PromiseSettle<CalculatedDataSite> {
	const currentTime = dayjs()

	const earliestTime = currentTime.subtract(...timeframe)

	const calcDataListWait = dataWaitList.map((dWait) =>
		dWait.then((d) => {
			return calcDataSite(d, currentTime, earliestTime)
		})
	)

	return Promise.allSettled(calcDataListWait)
}

function calcDataSite(
	d: DataSite,
	currentTime: Dayjs,
	earliestTime: Dayjs
): CalculatedDataSite {
	// result data
	let data: CalculatedDataItem[] = []

	// Start from end of csv array and decrement till beginning
	let i = d.csvLength - 1
	while (i >= 0) {
		let csvItem = d.csv[i]
		let csvItemDate = dayjs(csvItem.timestamp)
		// is after n
		if (csvItemDate.isBefore(earliestTime)) break
		// push to data
		data.push({
			status: csvItem.status,
			responseTime: csvItem.responseTime,
			httpCode: csvItem.httpCode,
			timestamp: csvItemDate,
			timeUnix: csvItemDate.unix(),
		})

		// Decrement
		i--
	}

	data = data.reverse()

	const statistics = calcStatistics(data, currentTime)

	return {
		name: d.name,
		url: d.url,
		data,
		percentageUptime: statistics.percentageUptime,
		averageResponseTime: statistics.averageResponseTime,
	}
}

interface Statistics {
	averageResponseTime: number
	percentageUptime: number
}
function calcStatistics(
	data: CalculatedDataItem[],
	currentTime: Dayjs
): Statistics {
	// total weight
	let totalWeight = 0
	// total milliseconds
	let totalResponseTime = 0
	// total weight that status is up
	let totalUpWeight = 0

	data.forEach((d, i) => {
		let nextDate: Dayjs
		if (data[i + 1]) {
			nextDate = data[i + 1].timestamp
		} else {
			nextDate = currentTime
		}

		// weight is the difference between current and next timestamp
		let weight = nextDate.valueOf() - d.timestamp.valueOf()

		if (d.status === "up") totalUpWeight += weight
		totalResponseTime += d.responseTime * weight
		totalWeight += weight
	})

	const averageResponseTime = totalResponseTime / totalWeight

	const percentageUptime = (totalUpWeight / totalWeight) * 100

	console.log("calc tot", {
		totalResponseTime,
		totalUpWeight,
		totalWeight,
	})

	return {
		averageResponseTime: Math.round(averageResponseTime),
		percentageUptime: Math.round(percentageUptime),
	}
}
