export const ERROR_GET_ELEMENT_BY_ID = (id: string) =>
	`Could not find element by id: ${id}`

export const ERROR_REJECTED_SITE = (err: Error) =>
	`Failed to retreive site data: ${err.message}`
