export default function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300) {
	let timer: ReturnType<typeof setTimeout>

	return (...args: Parameters<T>) => {
		clearTimeout(timer)

		timer = setTimeout(() => {
			func(...args)
		}, timeout)
	}
}
