import axios from "axios"
import yaml from "js-yaml"

import type { Config } from "../types"

//@ts-expect-error
const CONFIG_URL: string = globalThis["config"]

export async function getConfig(): Promise<Config> {
	// get from host
	const res = await axios.get<string>(CONFIG_URL)

	const data = yamlLoad<Config>(res.data)

	return data
}

function yamlLoad<D>(str: string): D {
	let res = yaml.load(str)
	return res as any
}
