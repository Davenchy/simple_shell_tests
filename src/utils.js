export const createUrl = (taskId, checkId, filename) =>
	`/assets/files/${taskId}/${checkId}/${filename}`

export const copyText = (text) => navigator.clipboard.writeText(text)

export const fetchCode = (url) => new Promise((resolve, reject) => {
	fetch(url).then(res => {
		if (!res.ok)
			reject()
		res.text().then(code => resolve(code))
	})
})
