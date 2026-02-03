import { createAuthClient } from 'better-auth/react'
const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: 'http://localhost:5173',
})

export default authClient
