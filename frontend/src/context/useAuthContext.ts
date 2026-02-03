import { create } from 'zustand'

import type { User } from '@/index'

interface AuthState {
	isAuthenticated: boolean
	user?: User | null
	token: string | null
	loading: boolean
	login: (user: User, token: string) => void
	logout: () => Promise<void>
	restoreSession: () => Promise<void>
}

const useAuthStore = create<AuthState>(set => ({
	user: null,
	token: null,
	isAuthenticated: false,
	loading: true,

	login: (user, token) => {
		set({
			user,
			token,
			isAuthenticated: true,
		})
	},

	logout: async () => {
		try {
			//console.log(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
				credentials: 'include',
				method: 'POST',
			})

			if (response.ok) {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
				})
			}
		} catch (err) {
			set({ loading: false })
			console.error(err)
		}
	},

	restoreSession: async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
				{
					credentials: 'include',
					method: 'POST',
				},
			)

			const data = await response.json()

			if (data.accessToken) {
				set({
					isAuthenticated: true,
					token: data.accessToken,
					loading: false,
					user: data.user,
				})
			} else {
				set({ loading: false })
			}
		} catch (err) {
			set({ loading: false })
			console.error(err)
		}
	},
}))

export default useAuthStore
