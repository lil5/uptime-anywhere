import SiteStatusChange from "./site-status-change.class"
import { Config, CSVRecord } from "./types"

const e_UP = "🟩"
const e_DOWN = "🟥"

const e_CHANGE = "📝"
const e_CREATED = "🆕"
const e_TIMER = "📅"

enum MessageType {
	HTML = 1,
	MARKDOWN = 2,
}

export default function buildMessage(
	resultSites: Record<string, CSVRecord>,
	sscList: Record<string, SiteStatusChange>
): string {
	const changedToUp: string[] = []
	const changedToDown: string[] = []
	const createdAndIsUp: string[] = []
	const createdAndIsDown: string[] = []
	// const noChangeAndIsUp: string[] = []
	const noChangeAndIsDown: string[] = []

	for (const siteName in sscList) {
		let ssc = sscList[siteName]
		if (!ssc)
			throw new Error(`ssc of siteName: ${siteName} not found in ${sscList}`)

		if (ssc.first) {
			if (ssc.changedToUp) {
				createdAndIsUp.push(siteName)
			} else {
				createdAndIsDown.push(siteName)
			}
		} else {
			if (ssc.changedToUp) {
				changedToUp.push(siteName)
			} else if (ssc.changedToDown) {
				changedToDown.push(siteName)
			} else {
				let resultSite = resultSites[siteName]
				if (resultSite?.status === "down") {
					noChangeAndIsDown.push(siteName)
				}
			}
		}
	}

	const changedToUpEmpty = changedToUp.length == 0
	const changedToDownEmpty = changedToDown.length == 0
	const createdAndIsUpEmpty = createdAndIsUp.length == 0
	const createdAndIsDownEmpty = createdAndIsDown.length == 0
	// const noChangeAndIsUpEmpty = noChangeAndIsUp.length == 0
	const noChangeAndIsDownEmpty = noChangeAndIsDown.length == 0

	let emoji = ""

	if (
		changedToUpEmpty &&
		changedToDownEmpty &&
		createdAndIsUpEmpty &&
		createdAndIsDownEmpty
	) {
		emoji = e_TIMER
	} else if (createdAndIsUpEmpty && createdAndIsDownEmpty) {
		emoji = e_CHANGE
	} else {
		emoji = e_CREATED
	}

	let result = ""

	if (changedToDownEmpty && createdAndIsDownEmpty && noChangeAndIsDownEmpty) {
		result = `${e_UP}${emoji} all sites are up`
	} else {
		const allDown = [
			...createdAndIsDown,
			...changedToDown,
			...noChangeAndIsDown,
		]
		let isAre = grammerIsAre(allDown.length)
		result = `${e_DOWN}${emoji} ${grammerAndComma(allDown)} ${isAre} down`
	}

	return result
}

function grammerIsAre(n: number): string {
	return n > 1 ? "are" : "is"
}

function grammerAndComma(arr: string[]): string {
	const last = arr[arr.length - 1]
	// n - 1
	const commaArr = arr.slice(0, -1)

	let result = last

	if (commaArr.length) {
		result = `${commaArr.join(", ")} & ${last}`
	}
	return result
}

export function BuildMessageBody(c: Config, mt: MessageType): string {
	const bodyTemplate = (s: string) =>
		`For more information please go to the webste status page ${s}.`

	let websiteALink = ""
	if (c.url) {
		switch (mt) {
			case MessageType.HTML:
				websiteALink = `<a href=\"${c.url}\" alt=\"Status Webpage\">link</a>`
				break
			case MessageType.MARKDOWN:
				websiteALink = `[link](${c.url})`
				break
		}
	}

	return bodyTemplate(websiteALink)
}
