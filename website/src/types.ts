import { Dayjs, OpUnitType } from "dayjs"

export type Status = "up" | "down"

// ---- CSV ----

export interface CSVLine {
	status: Status
	responseTime: number
	httpCode: number
	timestamp: string
}

// ---- Config ----

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

// ---- Data ----

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
	chartMaxY: number
	data: DataItem[]
}
export interface DataItem extends CalculatedDataItem, ChartDataItem {}

export interface CalculatedDataItem {
	status: Status
	responseTime: number
	httpCode: number
	timestamp: Dayjs
}
export interface ChartDataItem {
	status: Status
	httpCode: number
	timestamp: Dayjs
	x: number
	y: number
}

// ---- Utilities ----

export type PromiseSettle<R> = Promise<PromiseSettledResult<R>[]>

export type Timeframe = [value: number, unit: OpUnitType]
