import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, LoaderPinwheel, Save, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import Swal from 'sweetalert2'
import { activateSeccion, deactivateSeccion } from '../api/crudSecciones'
import { Seccion } from '@/index'

type SidebarType = {
	loading: boolean
	handleUpdateSeccion: UseMutateFunction<void, Error, void, unknown>
	seccion: Seccion
}

export default function SidebarSeccionIndividual({
	loading,
	handleUpdateSeccion,
	seccion,
}: SidebarType) {
	const { id } = useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { mutate: handleSemiDelete } = useMutation({
		mutationFn: async () => await deactivateSeccion(id),
		onSuccess: data => {
			console.log(data)
			Swal.fire({
				title: 'Sección borrada',
				icon: 'success',
				showConfirmButton: false,
				timer: 500,
				timerProgressBar: true,
			}).then(() => {
				navigate('/secciones/')
			})
			queryClient.invalidateQueries({ queryKey: ['secciones', id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al desactivar la sección',
				text: error.message,
				icon: 'error',
			})
		},
	})

	const { mutate: handleActivate } = useMutation({
		mutationFn: async () => await activateSeccion(id),
		onSuccess: data => {
			console.log(data)
			Swal.fire({
				title: 'Sección borrada',
				icon: 'success',
				showConfirmButton: false,
				timer: 500,
				timerProgressBar: true,
			}).then(() => {
				//navigate('/secciones/')
			})
			queryClient.invalidateQueries({ queryKey: ['secciones', id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al desactivar la sección',
				text: error.message,
				icon: 'error',
			})
		},
	})

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
				{seccion?.activo == true ? (
					<button onClick={() => handleSemiDelete()}>
						<Trash2 />
						Borrar
					</button>
				) : (
					<button onClick={() => handleActivate()}>
						<Eye />
						Activar
					</button>
				)}
			</div>
		</div>
	)
}
