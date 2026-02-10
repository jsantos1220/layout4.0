import TabalaOpciones from '@components/inputs/TablaOpciones'
import { Alert, Snackbar } from '@mui/material'
import { Opcion } from '@/index'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOpcion, deleteOpcion, getAllOpciones, updateOpcion } from '@/src/api/crudOpciones'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default function Opciones() {
	const [opciones, setOpciones] = useState<Opcion[]>([])
	const [search, setSearch] = useState('')
	const [filteredOpciones, setFilteredOpciones] = useState<Opcion[]>([])
	const [nuevaOpcion, setNuevaOpcion] = useState<string | undefined>(undefined)
	const [errorCrearOpcion, setErrorCrearOpcion] = useState(false)
	const [successCrearOpcion, setSuccessCrearOpcion] = useState(false)
	const queryClient = useQueryClient()
	const notyf = new Notyf()

	//Buscar las opciones
	const { data: dataOpciones } = useQuery({
		queryKey: ['opciones'],
		queryFn: async () => getAllOpciones(),
	})

	useEffect(() => {
		setOpciones(dataOpciones)
		setFilteredOpciones(dataOpciones)
	}, [dataOpciones])

	//Actualizar el search
	useEffect(() => {
		if (!search) {
			setFilteredOpciones(opciones)
		} else {
			setFilteredOpciones(
				opciones.filter(cat => cat.nombre.toLowerCase().includes(search.toLowerCase())),
			)
		}
	}, [search, opciones])

	//Crear una nueva opción
	const { mutate: crearNuevaOpcion, isPending } = useMutation({
		mutationFn: async () => {
			if (nuevaOpcion == '') throw new Error('Nombre vacio')

			return await createOpcion(nuevaOpcion)
		},
		onSuccess: () => {
			setNuevaOpcion('')
			notyf.success('Categoría creada')
			queryClient.invalidateQueries({ queryKey: ['opciones'] })
		},
		onError: () => {
			notyf.error('No se pudo crear la categoría')
		},
	})

	//Esto debe actualizar la opción
	const { mutate: handleEdit } = useMutation({
		mutationFn: async (opcion: Opcion) => await updateOpcion(opcion.id, opcion.nombre),
		onSuccess: () => {
			notyf.success('Opción editada')
			queryClient.invalidateQueries({ queryKey: ['opciones'] })
		},
		onError: () => {
			notyf.error('No se pudo editar la opcion')
		},
	})

	//Para borrar la categoría en cuestión
	const { mutate: handleDelete } = useMutation({
		mutationFn: async (opcion: Opcion) => await deleteOpcion(opcion.id),
		onSuccess: () => {
			notyf.success('Categoría borrada')
			queryClient.invalidateQueries({ queryKey: ['opciones'] })
		},
		onError: () => {
			notyf.error('No se pudo borrar la categoría')
		},
	})

	function handleClose() {
		setErrorCrearOpcion(false)
		setSuccessCrearOpcion(false)
	}

	return (
		<div className=''>
			<div className='header margin-bottom-s'>
				<h1>Opciones de secciones</h1>
			</div>

			<div className='seccion-int'>
				<div className='panel-taxonomia'>
					<div className='inputs margin-md'>
						<input
							type='text'
							value={nuevaOpcion}
							onChange={e => setNuevaOpcion(e.target.value)}
							placeholder='Nueva opción'
						/>
						<button
							className='btn-secondary'
							onClick={() => crearNuevaOpcion()}
							disabled={isPending}
						>
							<Plus />
							Agregar
						</button>
					</div>

					<div className='separador'></div>

					<div className='contenido-taxonomia'>
						<input
							className='input-buscar'
							type='text'
							placeholder='Buscar'
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>

					<div className='separador'></div>

					<TabalaOpciones
						rows={filteredOpciones}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={errorCrearOpcion}
				autoHideDuration={2000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity='error' variant='filled' sx={{ width: '100%' }}>
					No se pudo crear la categoría
				</Alert>
			</Snackbar>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={successCrearOpcion}
				autoHideDuration={2000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity='success' variant='filled' sx={{ width: '100%' }}>
					La categoría se creo correctamente
				</Alert>
			</Snackbar>
		</div>
	)
}
