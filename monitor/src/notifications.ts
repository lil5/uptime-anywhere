import { WebhookClient } from "discord.js"

export function runDiscord(webhookUrl: string, message: string) {
	const webhookClient = new WebhookClient({
		url: webhookUrl,
	})

	webhookClient.send({
		content: message,
		username: "uptime-anywhere",
		avatarURL:
			"https://raw.githubusercontent.com/lil5/uptime-anywhere/main/website/public/android-chrome-512x512.png",
	})
}
