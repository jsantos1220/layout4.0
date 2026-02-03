import { Navigate, Outlet } from 'react-router'
import Sidebar from '@components/Sidebar'
import authClient from '@lib/auth-client'

export default function ProtectedRoute() {
	const { data: session, isPending } = authClient.useSession()

	if (isPending) {
		return <div>Cargando...</div> // O tu componente de loading
	}

	if (!session) return <Navigate to='/login' replace />

	return (
		<div className='contenedor'>
			<Sidebar />

			<div className='contenido'>
				<Outlet />
			</div>
		</div>
	)
}
