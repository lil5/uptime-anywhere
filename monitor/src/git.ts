import { exec } from "child_process"

export default async function runGit(message: string): Promise<void> {
	await runGitCommand("add", "public/data/")

	await runGitCommand("commit", `-m '${message}'`)

	await runGitCommand("push", "origin")
}

function runGitCommand(...args: string[]): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		exec(`git ${args.join(" ")}`, (err, stdout, stderr) => {
			if (err) {
				reject(err)
			}
			if (stderr) {
				reject(stderr)
			}

			resolve()
		})
	})
}
