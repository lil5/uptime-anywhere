import { Command } from "commander"
import { loadConfig } from "./config"
import { callAll } from "./call"
import { writeAll } from "./write"
import buildMessage from "./message"
import { runDiscord } from "./notifications"
import runGit from "./git"

interface CLIOptions {
	discord: string
}

const program = new Command()

// if running as developer
const IS_DEV = process.env.NODE_ENV === "dev"
// if running as jest
const IS_TEST = process.env.NODE_ENV === "test"

async function main() {
	// configurations from cli
	program.option("--discord [token]", "discord token").parse()

	const options = program.opts<CLIOptions>()

	// configurations from public/data/config.json
	const config = await loadConfig()

	const httpResults = await callAll(config.sites)

	const { sscList, hasAnyWritten } = await writeAll(httpResults)

	if (!hasAnyWritten) {
		return
	}

	const message = buildMessage(httpResults, sscList)

	if (!IS_TEST && !IS_DEV) {
		await runGit(message)
	} else {
		console.info("git will not run in dev mode")
	}

	if (options.discord) {
		runDiscord(options.discord, message)
	}
}

main()
