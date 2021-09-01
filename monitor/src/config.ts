import { promises as fs } from "fs"
import path from "path"
import { Config } from "./types"

export async function loadConfig(): Promise<Config> {
	const fpath = path.join("public", "data", "config.json")
	const contents = await fs.readFile(fpath, { encoding: "utf-8" })

	const config = JSON.parse(contents)

	return config as Config
}
