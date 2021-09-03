import runGit from "./git"
import faker from "faker"
import child_process from "child_process"

type Callback = (
	error: child_process.ExecException | null,
	stdout: string,
	stderr: string
) => void

test("git command runs proper commands", async () => {
	const message = faker.lorem.sentence()
	const execSpy = jest
		.spyOn(child_process, "exec")
		//@ts-ignore
		.mockImplementation((s: string, callback: Callback) => {
			callback(null, faker.lorem.paragraph(), "")
		})

	await runGit(message)

	expect(execSpy.mock.calls[0][0]).toBe(`git add public/data/`)
	expect(execSpy.mock.calls[1][0]).toBe(`git commit -m '${message}'`)
	expect(execSpy.mock.calls[2][0]).toBe(`git push origin`)
})
