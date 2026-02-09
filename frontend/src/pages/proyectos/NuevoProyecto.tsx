import { createProyecto } from '@/src/api/crudProyectos'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Swal from 'sweetalert2'

export default function NuevoProyecto() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { mutate: crearNuevaSeccion, isPending } = useMutation({
		mutationFn: async () => await createProyecto(),
		onSuccess: data => {
			console.log(data)
			Swal.fire({
				title: 'Proyecto creado',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				navigate(`/proyectos/${data.id}`)
			})
			queryClient.invalidateQueries({ queryKey: ['proyectos'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	return (
		<div className='proyecto'>
			<div className='header'>
				<h1>Nuevo proyecto</h1>
			</div>

			<div className='nuevo-proyecto gap-m margin-m'>
				<button disabled={isPending} onClick={() => crearNuevaSeccion()}>
					<img src='../../../images/desde-0.svg' alt='' />
				</button>

				<Link to=''>
					<img src='../../../images/desde-layout.svg' alt='' />
				</Link>
			</div>
		</div>
	)
}
