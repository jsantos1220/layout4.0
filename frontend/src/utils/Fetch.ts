import useAuthStore from '@context/useAuthContext'

type FetchOptions = RequestInit & {
	headers?: HeadersInit
}

const Fetch = async (
	url: string,
	options: FetchOptions = {},
	isFormData = false,
): Promise<Response> => {
	const { token, restoreSession } = useAuthStore.getState()

	const executeRequest = async (tokenToUse: string | null) => {
		const headers: HeadersInit = {
			...(options.headers || {}),
			...(tokenToUse && { Authorization: tokenToUse }),
		}

		// IMPORTANTE: Solo agregar Content-Type si NO es FormData
		if (!isFormData) {
			headers['Content-Type'] = 'application/json'
		}

		return fetch(url, {
			headers,
			credentials: 'include',
			...options,
		})
	}

	try {
		// Primera petición con el token actual
		const response = await executeRequest(token)

		// Si el token expiró (401), intentamos refrescarlo
		if (response.status === 401) {
			await restoreSession()
			const newResponse = await executeRequest(token)

			return newResponse
		}

		return response
	} catch (error) {
		console.error('Auth fetch error:', error)
		throw error
	}
}

export default Fetch
