import EnhancedTable from '@components/inputs/TablaCategorias'
import { Alert, Snackbar } from '@mui/material'
import { Categoria } from '@/index'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createCategoria,
	deleteCategoria,
	getAllCategorias,
	updateCategoria,
} from '@/src/api/crudCategorias'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default function Categorias() {
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [search, setSearch] = useState('')
	const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([])
	const [nuevaCategoria, setNuevaCategoria] = useState<string | undefined>(undefined)
	const [errorCrearCat, setErrorCrearCat] = useState(false)
	const [successCrearCat, setSuccessCrearCat] = useState(false)
	const queryClient = useQueryClient()
	const notyf = new Notyf()

	//Buscar las categorias
	const { data: dataCategorias } = useQuery({
		queryKey: ['categorias'],
		queryFn: async () => getAllCategorias(),
	})

	useEffect(() => {
		setCategorias(dataCategorias)
		setFilteredCategorias(dataCategorias)
	}, [dataCategorias])

	//Actualizar el search
	useEffect(() => {
		if (!search) {
			setFilteredCategorias(categorias)
		} else {
			setFilteredCategorias(
				categorias.filter(cat => cat.nombre.toLowerCase().includes(search.toLowerCase())),
			)
		}
	}, [search, categorias])

	const { mutate: crearNuevaCategoria, isPending } = useMutation({
		mutationFn: async () => {
			if (nuevaCategoria == '') throw new Error('Nombre vacio')

			return await createCategoria(nuevaCategoria)
		},
		onSuccess: () => {
			setNuevaCategoria('')
			notyf.success('Categoría creada')
			queryClient.invalidateQueries({ queryKey: ['categorias'] })
		},
		onError: () => {
			notyf.error('No se pudo crear la categoría')
		},
	})

	//Esto debe actualizar la categoría
	const { mutate: handleEdit } = useMutation({
		mutationFn: async (categoria: Categoria) =>
			await updateCategoria(categoria.id, categoria.nombre),
		onSuccess: () => {
			notyf.success('Categoría editada')
			queryClient.invalidateQueries({ queryKey: ['categorias'] })
		},
		onError: () => {
			notyf.error('No se pudo editar la categoría')
		},
	})

	//Para borrar la categoría en cuestión
	const { mutate: handleDelete } = useMutation({
		mutationFn: async (categoria: Categoria) => await deleteCategoria(categoria.id),
		onSuccess: () => {
			notyf.success('Categoría borrada')
			queryClient.invalidateQueries({ queryKey: ['categorias'] })
		},
		onError: () => {
			notyf.error('No se pudo borrar la categoría')
		},
	})

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
