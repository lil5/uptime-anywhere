import axios from "axios"

import type { Config } from "../types"

//@ts-expect-error
const CONFIG_URL: string = globalThis["config"] || "./data/config.json"

export async function getConfig(): Promise<Config> {
	// get from host
	const res = await axios.get<Config>(CONFIG_URL)

	return res.data
}
