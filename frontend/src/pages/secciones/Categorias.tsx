import EnhancedTable from '@components/inputs/TablaCategorias'
import { Alert, Snackbar } from '@mui/material'
import Fetch from '@utils/Fetch'
import { Categoria } from 'index'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Categorias() {
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [search, setSearch] = useState('')
	const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([])
	const [nuevaCategoria, setNuevaCategoria] = useState<string | undefined>(undefined)
	const [creandoCategoria, setCreandoCategoria] = useState(false)
	const [errorCrearCat, setErrorCrearCat] = useState(false)
	const [successCrearCat, setSuccessCrearCat] = useState(false)

	//Buscar las categorias
	useEffect(() => {
		buscarCategoriasGenerales()
	}, [])

	//Actualizar el search
	useEffect(() => {
		if (!search) {
			setFilteredCategorias(categorias)
		} else {
			setFilteredCategorias(
				categorias.filter(cat => cat.nombre.toLowerCase().includes(search.toLowerCase()))
			)
		}
	}, [search, categorias])

	async function buscarCategoriasGenerales() {
		try {
			const query = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/`, {
				credentials: 'include',
			})
			const response = await query.json()
			setCategorias(response.categorias)
			setFilteredCategorias(response.categorias)
		} catch (error) {
			console.log(error)
		}
	}

	//Crear una nueva categoría
	async function crearNuevaCategoria() {
		try {
			setCreandoCategoria(true)

			if (nuevaCategoria == '') return

			//TODO esto esta funcionando sin "Auth"
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/create`, {
				method: 'POST',
				body: JSON.stringify({ nombre: nuevaCategoria }),
			})

			const response = await query.json()

			if (response.message == 'El nombre ya existe') {
				setErrorCrearCat(true)
				return
			}

			if (response.message == 'Categoría creada') {
				setSuccessCrearCat(true)
				setNuevaCategoria('')
				buscarCategoriasGenerales()
			}
		} catch (error) {
			console.log(error)
		} finally {
			setCreandoCategoria(false)
		}
	}

	//Esto debe actualizar la categoría
	async function handleEdit(categoria: Categoria) {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/update`, {
				method: 'post',
				body: JSON.stringify({
					categoria_id: categoria.categoria_id,
					nombre: categoria.nombre,
				}),
			})

			if (query.ok) {
				buscarCategoriasGenerales()
			}
		} catch (error) {
			console.log(error)
		}
	}

	//Para borrar la categoría en cuestión
	async function handleDelete(categoria: Categoria) {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/delete`, {
				method: 'post',
				body: JSON.stringify({
					categoria_id: categoria.categoria_id,
				}),
			})

			if (query.ok) {
				buscarCategoriasGenerales()
			}
		} catch (error) {
			console.log(error)
		}
	}

	function handleClose() {
		setErrorCrearCat(false)
		setSuccessCrearCat(false)
	}

	return (
		<div className=''>
			<div className='header margin-bottom-s'>
				<h1>Categorias de secciones</h1>
			</div>

			<div className='seccion-int'>
				<div className='panel-taxonomia'>
					<div className='inputs margin-md'>
						<input
							type='text'
							value={nuevaCategoria}
							onChange={e => setNuevaCategoria(e.target.value)}
							placeholder='Nueva caetgoría'
						/>
						<button
							className='btn-secondary'
							onClick={() => crearNuevaCategoria()}
							disabled={creandoCategoria}
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

					<EnhancedTable
						rows={filteredCategorias}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={errorCrearCat}
				autoHideDuration={2000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity='error' variant='filled' sx={{ width: '100%' }}>
					No se pudo crear la categoría
				</Alert>
			</Snackbar>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				open={successCrearCat}
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
