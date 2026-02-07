import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { Categoria } from '@/index'
import { Check } from 'lucide-react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useCallback, useState } from 'react'
import debounce from '@utils/debounce'
import { createCategoria, getAllCategorias } from '@/src/api/crudCategorias'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createCategoriaSeccion,
	getAllCategoriaSeccionesById,
} from '@/src/api/crudCategoriaSecciones'
import pb from '@lib/pocketbase'
import Swal from 'sweetalert2'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function SidebarCategorias({ id }: { id: string | undefined }) {
	const [categoriasGral, setCategoriasGenerales] = useState<Categoria[] | undefined>()
	const [categoriasFinales, setCategoriasFinales] = useState<Categoria[] | undefined>([])
	const [addNew, setAddNew] = useState(false)
	const [newCategory, setNewCategory] = useState<string>('')
	const queryClient = useQueryClient()
	const notyf = new Notyf()

	//Buscar todas las categorias
	useQuery({
		queryKey: ['categorias'],
		queryFn: async () => {
			const categorias = await getAllCategorias()
			setCategoriasGenerales(categorias)

			return categorias
		},
	})

	//Buscar las categorias relacionadas
	useQuery({
		queryKey: ['categorias-secciones', id],
		enabled: !!id,
		queryFn: async () => {
			const relaciones = await getAllCategoriaSeccionesById(id)
			const categoriassFinales = []

			relaciones.forEach(relacion => {
				categoriassFinales.push(relacion.expand.categoria)
			})
			setCategoriasFinales(categoriassFinales)
			return relaciones
		},
	})

	const { mutate: actualizarCategoriasEnSeccion } = useMutation({
		mutationFn: async (categorias: Categoria[]) => {
			return await pb.send('/api/update-categorias-seccion', {
				method: 'POST',
				body: JSON.stringify({ id, categorias }),
			})
		},
		onSuccess: () => {
			notyf.success('Guardado')
			queryClient.invalidateQueries({ queryKey: ['categorias-secciones'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear factura',
				text: error.message,
				icon: 'error',
			})
		},
	})

	//Esta función se dispara esperando 3 segundos para actualizar despacio
	const debouncedActualizarCategorias = useCallback(
		debounce((categorias: Categoria[]) => actualizarCategoriasEnSeccion(categorias), 1500),
		[id],
	)

	const { mutate: handleNewCategory, isPending } = useMutation({
		mutationFn: async () => {
			const nuevaCategoria = await createCategoria(newCategory)
			if (nuevaCategoria) await createCategoriaSeccion(nuevaCategoria.id, id)
			setNewCategory('')
			setAddNew(false)
		},
		onSuccess: () => {
			notyf.success('Categoría creada')
			queryClient.invalidateQueries({ queryKey: ['categorias-secciones'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear la categoria',
				text: error.message,
				icon: 'error',
			})
		},
	})

	return (
		<div className='cotenido-panel'>
			<div className='contenedor-taxonomia'>
				<Autocomplete
					multiple
					className='auto-complete'
					options={categoriasGral || []}
					disableCloseOnSelect
					getOptionLabel={option => option.nombre}
					isOptionEqualToValue={(option, value) => option.id === value.id}
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

						<button onClick={() => handleNewCategory()} disabled={isPending}>
							<Check />
							Agregar categoría
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
