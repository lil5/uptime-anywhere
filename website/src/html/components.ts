import { html, TemplateResult } from "lit-html"
import { Status } from "../types"

export interface LiveStatusProps {
	status: Status
	name: string
	link: string
	icon: string
	percentageUptime: number
	avgResponseTime: number
}

export interface LiveStatusErrorProps {
	status: "error"
	title: string
	err: Error
}

export function LiveStatusList(
	list: Array<LiveStatusProps | LiveStatusErrorProps>
): TemplateResult {
	let l: TemplateResult[] = []
	list.forEach((site) => {
		if (site.status === "error") {
			l.push(html`
			<li class="card card--danger">
				<h4>${site.title}</h4>
				<p>${site.err.stack}</p>
				</div>
			</li>
			`)
			return
		}

		let classStatus = site.status === "up" ? "card--default" : "card--danger"

		l.push(html`
			<li class="card card--grid ${classStatus}">
				<h4>
					<img src="${site.icon}" />
					<a href="${site.link}">${site.name}</a>
				</h4>
				<p>Overall uptime: ${site.percentageUptime}%</p>
				<p>Average response time: ${site.avgResponseTime} ms</p>
				<div class="card__canvas">
					<canvas id="canvas-live-status-${site.name}"></canvas>
				</div>
			</li>
		`)
	})
	return html`
		<section class="section">
			<div class="section__title">
				<h2>Live Status</h2>
				<button>7d</button>
			</div>
			<ul id="live-status">
				${l}
			</ul>
		</section>
	`
}
