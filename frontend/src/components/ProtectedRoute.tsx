import { Outlet, useNavigate } from 'react-router'
import Sidebar from '@components/Sidebar'
import useAuthStore from '@context/useAuthContext'
import { useEffect } from 'react'
import pb from '@lib/pocketbase'

export default function ProtectedRoute() {
	const { loading } = useAuthStore()
	const navigate = useNavigate()

	if (loading) {
		return <div>Cargando...</div> // O tu componente de loading
	}

	useEffect(() => {
		const userId = pb.authStore.record?.id
		if (!userId) navigate('/login')
	}, [])

	return (
		<div className='contenedor'>
			<Sidebar />

			<div className='contenido'>
				<Outlet />
			</div>
		</div>
	)
}
