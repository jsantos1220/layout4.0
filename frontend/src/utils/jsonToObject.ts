import { Bricks } from 'index'

export default function jsonToObject(json: string | undefined): Bricks | null {
	if (!json) return null

	try {
		return JSON.parse(json)
	} catch {
		return null // o false, o {}
	}
}
