// stores/auth.store.ts
import { create } from 'zustand'
import pb from '@lib/pocketbase'
import type { RecordModel } from 'pocketbase'

type AuthState = {
	user: RecordModel | null
	isAuth: boolean
	loading: boolean

	init: () => void
	login: (email: string, password: string) => Promise<void>
	logout: () => void
}

const useAuthStore = create<AuthState>(set => ({
	user: null,
	isAuth: false,
	loading: false,

	init: () => {
		// hidrata desde authStore
		set({
			user: pb.authStore.record,
			isAuth: pb.authStore.isValid,
			loading: false,
		})

		// escucha cambios (login / logout / refresh)
		pb.authStore.onChange((_token, model) => {
			console.log(model)
			set({
				user: model,
				isAuth: pb.authStore.isValid,
				loading: false,
			})
		})
	},

	login: async (email, password) => {
		set({ loading: true })
		await pb.collection('users').authWithPassword(email, password)
		set({ loading: false })
	},

	logout: () => {
		pb.authStore.clear()
		set({ user: null, isAuth: false })
	},
}))

export default useAuthStore
