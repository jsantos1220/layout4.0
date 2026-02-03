//Da formato a las fechas
export default function formatDate(fecha: string | number | undefined): string {
	if (!fecha) return ''
	let dateObj: Date
	if (typeof fecha === 'number') {
		dateObj = new Date(fecha)
	} else if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
		// formato tipo '2025-05-24 22:52:38'
		dateObj = new Date(fecha.replace(' ', 'T'))
	} else if (!isNaN(Number(fecha))) {
		dateObj = new Date(Number(fecha))
	} else {
		return ''
	}
	const day = String(dateObj.getDate()).padStart(2, '0')
	const month = String(dateObj.getMonth() + 1).padStart(2, '0')
	const year = dateObj.getFullYear()
	return `${day}-${month}-${year}`
}
