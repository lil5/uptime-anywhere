import faker from "faker"
import { CSVRecord } from "../src/types"

export function entryFactory(override: Partial<CSVRecord> = {}): CSVRecord {
	return {
		status: "up",
		responseTime: faker.datatype.number({
			min: 1,
			max: 4000,
		}),
		httpCode: 200,
		timestamp: new Date().toISOString(),
		...override,
	}
}
