import authClient from '@lib/auth-client'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function NuevoProyecto() {
	const navigate = useNavigate()
	const { data: session } = authClient.useSession()
	const [creandoSeccion, setCreandoSeccion] = useState(false)

	async function crearNuevaSeccion() {
		const formData = new FormData()
		formData.append('nombre', 'Nuevo proyecto')
		formData.append('user_id', session.user.id ?? '')

		try {
			setCreandoSeccion(true)

			//TODO esto esta funcionando si "Auth"
			const query = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/create`, {
				method: 'post',
				body: formData,
				credentials: 'include',
			})

			if (!query.ok) throw new Error('No se creo la nueva sección')

			const response = await query.json()
			console.log(response)

			navigate(`/proyectos/${response.proyecto.proyecto_id}`)
		} catch (error) {
			console.log(error)
		} finally {
			setCreandoSeccion(false)
		}
	}

	return (
		<div className='proyecto'>
			<div className='header'>
				<h1>Nuevo proyecto</h1>
			</div>

			<div className='nuevo-proyecto gap-m margin-m'>
				<button disabled={creandoSeccion} onClick={() => crearNuevaSeccion()}>
					<img src='../../../images/desde-0.svg' alt='' />
				</button>

				<Link to=''>
					<img src='../../../images/desde-layout.svg' alt='' />
				</Link>
			</div>
		</div>
	)
}
