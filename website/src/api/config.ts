import type { Config } from "../types"

//@ts-expect-error
const CONFIG_URL: string = globalThis["config"] || "./data/config.json"

export async function getConfig(): Promise<Config> {
	// get from host
	const res = await fetch(CONFIG_URL, { cache: "no-cache" })
	const resJSON = (await res.json()) as Config

	return resJSON
}
