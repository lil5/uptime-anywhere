import { Dayjs, OpUnitType } from "dayjs"

export type Status = "up" | "down"

export interface CSVLine {
	status: Status
	responseTime: number
	httpCode: number
	timestamp: string
}

export interface DataSite {
	name: string
	url: string
	csv: CSVLine[]
	csvLength: number
}

export interface CalculatedDataSite {
	name: string
	url: string
	averageResponseTime: number
	percentageUptime: number
	data: CalculatedDataItem[]
}
export interface CalculatedDataItem {
	status: Status
	responseTime: number
	httpCode: number
	timestamp: Dayjs
}

export interface ChartDataItem {}

export interface ConfigSite {
	name: string
	url: string
}
export interface Config {
	host: string
	owner: string
	repo: string
	branch: string
	sites: ConfigSite[]
}

export type PromiseSettle<R> = Promise<PromiseSettledResult<R>[]>

export type Timeframe = [value: number, unit: OpUnitType]
