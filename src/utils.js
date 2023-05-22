export const createUrl = (taskId, checkId, filename) =>
	`/assets/files/${taskId}/${checkId}/${filename}`

export const copyText = (text) => navigator.clipboard.writeText(text);
