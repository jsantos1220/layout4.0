import TabalaOpciones from '@components/inputs/TablaOpciones'
import { Alert, Snackbar } from '@mui/material'
import Fetch from '@utils/Fetch'
import { Opcion } from 'index'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Opciones() {
	const [opciones, setOpciones] = useState<Opcion[]>([])
	const [search, setSearch] = useState('')
	const [filteredOpciones, setFilteredOpciones] = useState<Opcion[]>([])
	const [nuevaOpcion, setNuevaOpcion] = useState<string | undefined>(undefined)
	const [creandoOpcion, setCreandoOpcion] = useState(false)
	const [errorCrearOpcion, setErrorCrearOpcion] = useState(false)
	const [successCrearOpcion, setSuccessCrearOpcion] = useState(false)

	//Buscar las opciones
	useEffect(() => {
		buscarOpcionesGenerales()
	}, [])

	//Actualizar el search
	useEffect(() => {
		if (!search) {
			setFilteredOpciones(opciones)
		} else {
			setFilteredOpciones(
				opciones.filter(cat => cat.nombre.toLowerCase().includes(search.toLowerCase()))
			)
		}
	}, [search, opciones])

	async function buscarOpcionesGenerales() {
		try {
			const query = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/`, {
				credentials: 'include',
			})
			const response = await query.json()
			setOpciones(response.opciones)
			setFilteredOpciones(response.opciones)
		} catch (error) {
			console.log(error)
		}
	}

	//Crear una nueva categoría
	async function crearNuevaOpcion() {
		try {
			setCreandoOpcion(true)

			if (nuevaOpcion == '') return

			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/create`, {
				method: 'POST',
				body: JSON.stringify({ nombre: nuevaOpcion }),
			})

			const response = await query.json()

			if (response.message == 'El nombre ya existe') {
				setErrorCrearOpcion(true)
				return
			}

			if (query.ok) {
				setSuccessCrearOpcion(true)
				setNuevaOpcion('')
				buscarOpcionesGenerales()
			}
		} catch (error) {
			console.log(error)
		} finally {
			setCreandoOpcion(false)
		}
	}

	//Esto debe actualizar la categoría
	async function handleEdit(opcion: Opcion) {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/update`, {
				method: 'post',
				body: JSON.stringify({
					opcion_id: opcion.opcion_id,
					nombre: opcion.nombre,
				}),
			})

			if (query.ok) {
				buscarOpcionesGenerales()
			}
		} catch (error) {
			console.log(error)
		}
	}

	//Para borrar la categoría en cuestión
	async function handleDelete(opcion: Opcion) {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/delete`, {
				method: 'post',
				body: JSON.stringify({
					opcion_id: opcion.opcion_id,
				}),
			})

			if (query.ok) {
				buscarOpcionesGenerales()
			}
		} catch (error) {
			console.log(error)
		}
	}

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
							placeholder='Nueva caetgoría'
						/>
						<button
							className='btn-secondary'
							onClick={() => crearNuevaOpcion()}
							disabled={creandoOpcion}
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
