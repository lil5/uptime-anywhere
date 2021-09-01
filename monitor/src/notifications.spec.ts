import { runDiscord } from "./notifications"

const DISCORD_TOKEN = process.env.DISCORD_TOKEN

if (DISCORD_TOKEN) {
	test("discord sends message using webhook successfully", () => {
		runDiscord(DISCORD_TOKEN, "Webhook test🟩")
	})
}
