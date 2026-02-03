import Fetch from '@utils/Fetch'
import { LoaderPinwheel, Save, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'

type SidebarType = {
	loading: boolean
	handleUpdateSeccion: () => Promise<void>
}

export default function SidebarSeccionIndividual({ loading, handleUpdateSeccion }: SidebarType) {
	const { seccion_id } = useParams()
	const navigate = useNavigate()

	async function handleSemiDelete() {
		if (!seccion_id) return

		const formData = new FormData()
		formData.set('seccion_id', seccion_id)
		formData.set('activo', '0')

		// Ejemplo de envío
		try {
			//TODO esto esta funcionando si "Auth"
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/sections/update`,
				{
					method: 'POST', // o 'PUT' según tu API
					body: formData,
				},
				true,
			)

			if (!query.ok) throw new Error('No se pudo borrar')

			navigate('/secciones/')
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div className='controllers'>
			<div className='container-controllers'>
				<button
					className='guardar'
					disabled={loading ? true : false}
					onClick={() => handleUpdateSeccion()}
				>
					{loading ? <LoaderPinwheel className='spinner' /> : <Save />}
					{loading ? 'Enviando' : 'Guardar'}
				</button>
			</div>

			<div className='container-controllers'>
				<button onClick={handleSemiDelete}>
					<Trash2 />
					Borrar
				</button>
			</div>
		</div>
	)
}
