export interface Options {
	changedToUp?: boolean
	changedToDown?: boolean
	laterThanN?: boolean
	first?: boolean
}

export default class SiteStatusChange {
	changedToUp: boolean = false
	changedToDown: boolean = false
	laterThanN: boolean = false
	first: boolean = false

	constructor(options: Options) {
		Object.assign(this, options)
	}

	ShouldWrite(): boolean {
		return (
			this.changedToDown || this.changedToUp || this.laterThanN || this.first
		)
	}
}
