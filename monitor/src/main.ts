import { loadConfig } from "./config"
import { callAll } from "./call"
import { writeAll } from "./write"
import buildMessage from "./message"
import { runDiscord } from "./notifications"
import runGit from "./git"

const DISCORD_TOKEN =
	process.env.npm_config_discord || process.env.DISCORD_TOKEN

// if running as developer
const IS_DEV = process.env.NODE_ENV === "dev"
// if running as jest
const IS_TEST = process.env.NODE_ENV === "test"

async function main() {
	// configurations from public/data/config.json
	const config = await loadConfig()

	const httpResults = await callAll(config.sites)

	const { sscList, hasAnyWritten } = await writeAll(httpResults)

	if (!hasAnyWritten) {
		console.info("nothing new has happened")
		return
	}

	const message = buildMessage(httpResults, sscList)

	if (!IS_TEST && !IS_DEV) {
		await runGit(message)
	} else {
		console.info("git will not run in dev mode")
	}

	if (DISCORD_TOKEN && DISCORD_TOKEN.length) {
		runDiscord(DISCORD_TOKEN, message)
	}
}

main()
