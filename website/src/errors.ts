export const ERROR_GET_ELEMENT_BY_ID = (id: string) =>
	`Could not find element by id: ${id}`

export const ERROR_REJECTED_SITE = (err: Error) =>
	`Failed to retreive site data: ${err.message}`

export const ERROR_DATA_LENGHT_0 = "Length of data array is less than 1"
