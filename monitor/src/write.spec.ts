import { getLastCSVRecord, getSiteStatusChange, openFile } from "./write"
import * as path from "path"
import faker from "faker"
import { CSVRecord } from "./types"
import { promises as fsp } from "fs"

describe("read last line of file and parse csv data", () => {
	const nonExistingFilePath = path.join(
		"public",
		"data",
		"non-existent-file.csv"
	)

	afterAll(async () => {
		await fsp.rm(nonExistingFilePath)
	})

	it("should return null when given a non-existent file", async () => {
		const { f, fstats } = await openFile(nonExistingFilePath)

		expect(fstats).toBe(null)
		expect(typeof f).toBe("object")

		await f.close()
	})

	it("should return the last csv entry", async () => {
		const fp = path.join("test", "test.csv")

		const { f, fstats } = await openFile(fp)

		expect(fstats).not.toBeNull()
		if (fstats === null) return

		const sut = await getLastCSVRecord(f, fstats)

		expect(sut).not.toBe(null)
		expect(sut?.status).toBe("up")
		expect(sut?.responseTime).toBe(115)
		expect(sut?.httpCode).toBe(200)
		expect(sut?.timestamp).toBe("2021-08-18T09:46:56+02:00")
	})
})

describe("from the last entry and the current entry determin what the status change is", () => {
	function entryFactory(override: Partial<CSVRecord> = {}): CSVRecord {
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
	it("should state first as true if the last entry is null", () => {
		const sut = getSiteStatusChange(null, entryFactory())

		expect(sut.first).toBe(true)
	})

	it("should return changed to up if the last entry was down", () => {
		const sut = getSiteStatusChange(
			entryFactory({
				status: "down",
				timestamp: faker.date.past().toISOString(),
			}),
			entryFactory({
				status: "up",
			})
		)
		expect(sut.changedToUp).toBe(true)
	})

	it("should return changed to down if the last entry was up", () => {
		const sut = getSiteStatusChange(
			entryFactory({
				status: "up",
				timestamp: faker.date.past().toISOString(),
			}),
			entryFactory({
				status: "down",
			})
		)
		expect(sut.changedToDown).toBe(true)
	})
})
