import type { Dayjs, OpUnitType } from "dayjs"

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
	sites: ConfigSite[]
	url: string
}

// ---- API ----

export interface RawDataSite {
	name: string
	url: string
	csv: CSVLine[]
	csvLength: number
}

export interface DataItem {
	status: Status
	responseTime: number
	httpCode: number
	timestamp: Dayjs
	x: number
	y: number
}

// ---- Props ----
export interface ChartProps {
	data: DataItem[]
	currentTime: Dayjs
	earliestTime: Dayjs
}

export interface LiveStatusProps {
	status: Status
	name: string
	link: string
	icon: string
	percentageUptime: number
	avgResponseTime: number
	chart: ChartProps
}

export interface LiveStatusErrorProps {
	status: "error"
	title: string
	err: Error
}

// ---- Utilities ----

export type PromiseSettle<R> = Promise<PromiseSettledResult<R>[]>

export type Timeframe = [value: number, unit: OpUnitType]
