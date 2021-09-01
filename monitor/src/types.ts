export type Method =
	| "get"
	| "GET"
	| "delete"
	| "DELETE"
	| "head"
	| "HEAD"
	| "options"
	| "OPTIONS"
	| "post"
	| "POST"
	| "put"
	| "PUT"
	| "patch"
	| "PATCH"
	| "purge"
	| "PURGE"
	| "link"
	| "LINK"
	| "unlink"
	| "UNLINK"

export const S_DOWN = "down"
export const S_UP = "up"

export interface ConfigSite {
	name: string
	url: string
	icon?: string
	method?: Method
	maxResponseTime?: number
	insecure?: boolean
	expectedStatusCodes?: number[]
}
export interface Config {
	sites: ConfigSite[]
	url?: string
}

export interface CSVRecord {
	status: string
	responseTime: number
	httpCode: number
	timestamp: string
}
export interface CSVRecordWithSiteName extends CSVRecord {
	name: string
}
