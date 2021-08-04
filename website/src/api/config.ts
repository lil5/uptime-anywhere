import axios from "axios"
import { Config } from "../types"

export async function getConfig(): Promise<Config> {
	const res = await axios.get<Config>("../public/config.json")

	return res.data
}
