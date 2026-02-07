import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { Opcion } from '@/index'
import { Check } from 'lucide-react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useCallback, useState } from 'react'
import debounce from '@utils/debounce'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOpcion, getAllOpciones } from '@/src/api/crudOpciones'
import { createOpcionSeccion, getAllOpcionesSeccionesById } from '@/src/api/crudOpcionesSecciones'
import pb from '@lib/pocketbase'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import Swal from 'sweetalert2'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function SidebarOpciones({ id }: { id: string | undefined }) {
	const [opcionesGral, setOpcionesGenerales] = useState<Opcion[] | undefined>()
	const [opcionesFinales, setOpcionesFinales] = useState<Opcion[] | undefined>([])
	const [addNew, setAddNew] = useState(false)
	const [newOption, setNewOption] = useState<string>('')
	const queryClient = useQueryClient()
	const notyf = new Notyf()

	//Buscar todas las opciones
	useQuery({
		queryKey: ['opciones'],
		queryFn: async () => {
			const opciones = await getAllOpciones()
			setOpcionesGenerales(opciones)

			return opciones
		},
	})

	//Buscar las categorias relacionadas
	useQuery({
		queryKey: ['opciones-secciones', id],
		enabled: !!id,
		queryFn: async () => {
			const relaciones = await getAllOpcionesSeccionesById(id)
			const opcionesFinales = []

			relaciones.forEach(relacion => {
				opcionesFinales.push(relacion.expand.opcion)
			})
			setOpcionesFinales(opcionesFinales)
			return relaciones
		},
	})

	const { mutate: actualizarOpcionesEnSeccion } = useMutation({
		mutationFn: async (opciones: Opcion[]) => {
			return await pb.send('/api/update-opciones-seccion', {
				method: 'POST',
				body: JSON.stringify({ id, opciones }),
			})
		},
		onSuccess: () => {
			notyf.success('Guardado')
			queryClient.invalidateQueries({ queryKey: ['opciones-secciones'] })
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
	const debouncedActualizarOpciones = useCallback(
		debounce((opciones: Opcion[]) => actualizarOpcionesEnSeccion(opciones), 2000),
		[id],
	)

	//async function handleNewOption() {
	//	try {
	//		const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/create/`, {
	//			method: 'post',
	//			body: JSON.stringify({ nombre: newOption }),
	//		})

	//		const response = await query.json()
	//		const nuevaOpcion = response.opcion

	//		if (query.ok) {
	//			setOpcionesFinales(opciones => {
	//				const opcionesNuevas = [...(opciones || []), nuevaOpcion]

	//				//agregar la nueva categoria en la db
	//				actualizarOpcionesEnSeccion(opcionesNuevas)

	//				//Actualizar el estado
	//				return opcionesNuevas
	//			})

	//			setNewOption('')
	//			setAddNew(false)
	//		}

	//		if (!query.ok) {
	//			setError(true)

	//			setTimeout(() => setError(false), 1200)
	//		}
	//	} catch (error) {
	//		console.log(error)
	//	}
	//}

	const { mutate: handleNewOption, isPending } = useMutation({
		mutationFn: async () => {
			const nuevaOpcion = await createOpcion(newOption)
			if (nuevaOpcion) await createOpcionSeccion(nuevaOpcion.id, id)
			setNewOption('')
			setAddNew(false)
		},
		onSuccess: () => {
			notyf.success('Opción creada')
			queryClient.invalidateQueries({ queryKey: ['opciones-secciones'] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al crear la opción',
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
					options={opcionesGral || []}
					disableCloseOnSelect
					getOptionLabel={option => option.nombre}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					value={opcionesFinales}
					onChange={(_e, value) => {
						setOpcionesFinales(value)
						debouncedActualizarOpciones(value)
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
					+ Añadir opción
				</button>

				{addNew && (
					<div className='form'>
						<input
							type='text'
							placeholder='Nueva opcion'
							value={newOption}
							onChange={e => setNewOption(e.target.value)}
						/>

						<button onClick={() => handleNewOption()} disabled={isPending}>
							<Check />
							Agregar opción
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
