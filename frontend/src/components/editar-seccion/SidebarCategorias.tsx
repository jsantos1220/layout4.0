import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { Categoria } from '@/index'
import { Check } from 'lucide-react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useCallback, useEffect, useState } from 'react'
import Fetch from '@utils/Fetch'
import debounce from '@utils/debounce'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function SidebarCategorias({ seccion_id }: { seccion_id: string | undefined }) {
	const [categoriasGral, setCategoriasGenerales] = useState<Categoria[] | undefined>()
	const [categoriasFinales, setCategoriasFinales] = useState<Categoria[] | undefined>([])
	const [addNew, setAddNew] = useState(false)
	const [newCategory, setNewCategory] = useState<string>('')
	const [error, setError] = useState(false)

	//Buscar todas las categorias
	useEffect(() => {
		if (!seccion_id) return

		async function buscarCategoriasGenerales() {
			try {
				const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/`)
				const response = await query.json()

				setCategoriasGenerales(response.categorias)
			} catch (error) {
				console.log(error)
			}
		}

		//buscarCategoriasGenerales()
	}, [seccion_id])

	//Buscar categorías que ya se asosia con este recurso
	useEffect(() => {
		if (!seccion_id || !categoriasGral) return

		async function fetchFinales() {
			try {
				const query = await Fetch(
					`${import.meta.env.VITE_BACKEND_URL}/api/categorias-secciones/all/${seccion_id}`,
				)
				const response = await query.json()
				const finales = response.categorias
					.map((catFinal: Categoria) => categoriasGral?.find(cat => cat.id === catFinal.id))
					.filter(Boolean) as Categoria[]
				setCategoriasFinales(finales)
			} catch (error) {
				console.log(error)
			}
		}

		//fetchFinales()
	}, [seccion_id, categoriasGral])

	//Se ejecuta cuando se actualizan las categorias finales
	useEffect(() => {}, [categoriasFinales])

	//Esta función borra y crea las conexiones de categorias y secciones
	async function actualizarCategoriasEnSeccion(categorias: Categoria[]) {
		try {
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/categorias-secciones/update-multiple/`,
				{
					method: 'post',
					body: JSON.stringify({ seccion_id, categorias }),
				},
			)

			if (query.ok) {
				console.log('Si se actualiazaron las categorias')
			} else {
				console.log('No se actualiazaron las categorias')
			}
		} catch (error) {
			console.log(error)
		}
	}

	//Esta función se dispara esperando 3 segundos para actualizar despacio
	const debouncedActualizarCategorias = useCallback(
		debounce((categorias: Categoria[]) => actualizarCategoriasEnSeccion(categorias), 2000),
		[seccion_id],
	)

	async function handleNewCategory() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categorias/create/`, {
				method: 'post',
				body: JSON.stringify({ nombre: newCategory }),
			})

			const response = await query.json()
			const nuevaCategoria = response.categoria

			if (query.ok) {
				setCategoriasFinales(categorias => {
					const categoriasNuevas = [...(categorias || []), nuevaCategoria]

					//agregar la nueva categoria en la db
					actualizarCategoriasEnSeccion(categoriasNuevas)

					//Actualizar el estado
					return categoriasNuevas
				})

				setNewCategory('')
				setAddNew(false)
			}

			if (!query.ok) {
				setError(true)

				setTimeout(() => setError(false), 1200)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className='cotenido-panel'>
			<div className='contenedor-taxonomia'>
				<Autocomplete
					multiple
					className='auto-complete'
					options={categoriasGral || []}
					disableCloseOnSelect
					getOptionLabel={option => option.nombre}
					value={categoriasFinales}
					onChange={(_e, value) => {
						setCategoriasFinales(value)
						debouncedActualizarCategorias(value)
					}}
					renderOption={(props, option, { selected }) => {
						const { key, ...optionProps } = props
						return (
							<li key={key} {...optionProps}>
								<Checkbox
									icon={icon}
									checkedIcon={checkedIcon}
									style={{ marginRight: 8 }}
									checked={selected}
								/>
								{option.nombre}
							</li>
						)
					}}
					renderInput={params => <TextField {...params} placeholder='Buscar' />}
				/>

				<div className='separador'></div>

				<button onClick={() => setAddNew(!addNew)} className='agregar'>
					+ Añadir categoría
				</button>

				{addNew && (
					<div className='form'>
						<input
							type='text'
							name='categoria'
							placeholder='Nueva categoría'
							value={newCategory}
							onChange={e => setNewCategory(e.target.value)}
						/>

						{error && <p className='error'>No se agrego la categoría</p>}

						<button onClick={handleNewCategory}>
							<Check />
							Agregar categoría
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
