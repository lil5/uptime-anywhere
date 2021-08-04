import { render } from "lit-html"

import { CalculatedDataSite } from "../types"
import {
	LiveStatusErrorProps,
	LiveStatusList,
	LiveStatusProps,
} from "./components"
import { ERROR_GET_ELEMENT_BY_ID, ERROR_REJECTED_SITE } from "../errors"
import { generateChart } from "./chart"

export function renderHtml(
	calculatedData: PromiseSettledResult<CalculatedDataSite>[]
) {
	const elLiveStatus = document.getElementById("sections")
	if (!elLiveStatus) {
		console.error(ERROR_GET_ELEMENT_BY_ID("sections"))
		return
	}

	const statusListData = calculatedData.map((settledRes) => {
		if (settledRes.status === "rejected") {
			const mappedErr: LiveStatusErrorProps = {
				status: "error",
				title: ERROR_REJECTED_SITE(settledRes.reason),
				err: settledRes.reason,
			}
			return mappedErr
		}

		return mapPropsFromDataSite(settledRes.value)
	})

	render(LiveStatusList(statusListData), elLiveStatus)
}

export function renderChart(
	calculatedData: PromiseSettledResult<CalculatedDataSite>[]
) {
	calculatedData.forEach((settledRes) => {
		if (settledRes.status === "rejected") return

		generateChart(settledRes.value)
	})
}

function mapPropsFromDataSite(d: CalculatedDataSite): LiveStatusProps {
	let lastEntry = d.data[d.data.length - 1]

	return {
		name: d.name,
		status: lastEntry.status,
		link: d.url,
		icon: toBaseURL(d.url) + "/favicon.ico",
		percentageUptime: d.percentageUptime,
		avgResponseTime: d.averageResponseTime,
	}
}

function toBaseURL(fullURL: string) {
	return fullURL.replace(/https?:\/\/[^\/]*/g, (a) => a)
}
