import { entryFactory } from "../test/factories"
import buildMessage from "./message"
import SiteStatusChange from "./site-status-change.class"

describe("build message", () => {
	const e_UP = "🟩"
	const e_DOWN = "🟥"

	const e_CHANGE = "📝"
	const e_CREATED = "🆕"
	const e_TIMER = "📅"

	describe("should return update type", () => {
		test("when only a timer happened", () => {
			const sut = buildMessage(
				{
					foo: entryFactory(),
				},
				{
					foo: new SiteStatusChange({ first: true, changedToUp: true }),
				}
			)

			expect(sut).toInclude(e_CREATED)
		})
		test("when only a change happened", () => {
			const sut = buildMessage(
				{
					fee: entryFactory(),
				},
				{
					fee: new SiteStatusChange({ changedToUp: true }),
				}
			)

			expect(sut).toInclude(e_CHANGE)
		})
		test("when only a created happened", () => {
			const sut = buildMessage(
				{
					faa: entryFactory(),
				},
				{
					faa: new SiteStatusChange({ laterThanN: true }),
				}
			)

			expect(sut).toInclude(e_TIMER)
		})
	})

	describe("should return a message stating that all sites are up", () => {
		it("when there is one site", () => {
			const sut = buildMessage(
				{
					faa: entryFactory(),
				},
				{
					faa: new SiteStatusChange({ laterThanN: true }),
				}
			)

			expect(sut).toInclude("all sites are up")
			expect(sut).toInclude(e_UP)
		})

		it("when there are multiple sites", () => {
			const sut = buildMessage(
				{
					foo: entryFactory(),
					fee: entryFactory(),
					faa: entryFactory(),
				},
				{
					foo: new SiteStatusChange({ first: true, changedToUp: true }),
					fee: new SiteStatusChange({ changedToUp: true }),
					faa: new SiteStatusChange({ laterThanN: true }),
				}
			)

			expect(sut).toInclude("all sites are up")
			expect(sut).toInclude(e_UP)
		})
	})

	describe("should return a message stating that a site is down", () => {
		it("should return foo site down", () => {
			const sut = buildMessage(
				{
					foo: entryFactory({ status: "down" }),
				},
				{
					foo: new SiteStatusChange({ first: true, changedToDown: true }),
				}
			)

			expect(sut).toInclude("foo is down")
			expect(sut).toInclude(e_DOWN)
		})

		it("should return foo, fee & faa site down", () => {
			const sut = buildMessage(
				{
					foo: entryFactory({ status: "down" }),
					fee: entryFactory({ status: "down" }),
					faa: entryFactory({ status: "down" }),
				},
				{
					foo: new SiteStatusChange({ first: true, changedToDown: true }),
					fee: new SiteStatusChange({ changedToDown: true }),
					faa: new SiteStatusChange({ laterThanN: true }),
				}
			)

			expect(sut).toInclude("foo, fee & faa are down")
			expect(sut).toInclude(e_DOWN)
		})
	})

	// it.each(["up", "down"])(
	// 	"should return a message that a status change has occurred to %s",
	// 	(status) => {
	// 		const isUp = status === "up"
	// 	}
	// )
})
