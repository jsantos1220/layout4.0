import { Autocomplete, Checkbox, TextField } from '@mui/material'
import { Opcion } from 'index'
import { Check } from 'lucide-react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useCallback, useEffect, useState } from 'react'
import Fetch from '@utils/Fetch'
import debounce from '@utils/debounce'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

export default function SidebarOpciones({
	seccion_id,
}: {
	seccion_id: string | undefined
}) {
	const [opcionesGral, setOpcionesGenerales] = useState<Opcion[] | undefined>()
	const [opcionesFinales, setOpcionesFinales] = useState<Opcion[] | undefined>([])
	const [addNew, setAddNew] = useState(false)
	const [newOption, setNewOption] = useState<string>('')
	const [error, setError] = useState(false)

	//Buscar todas las opciones
	useEffect(() => {
		if (!seccion_id) return

		async function buscarOpcionesGenerales() {
			try {
				const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/opciones/`)
				const response = await query.json()

				setOpcionesGenerales(response.opciones)
			} catch (error) {
				console.log(error)
			}
		}

		buscarOpcionesGenerales()
	}, [seccion_id])

	//Buscar opciones que ya se asosia con este recurso
	useEffect(() => {
		if (!seccion_id || !opcionesGral) return

		async function fetchFinales() {
			try {
				const query = await Fetch(
					`${
						import.meta.env.VITE_BACKEND_URL
					}/api/opciones-secciones/all/${seccion_id}`
				)
				const response = await query.json()
				const finales = response.opciones
					.map((opcionFinal: Opcion) =>
						opcionesGral?.find(cat => cat.opcion_id === opcionFinal.opcion_id)
					)
					.filter(Boolean) as Opcion[]
				setOpcionesFinales(finales)
			} catch (error) {
				console.log(error)
			}
		}

		fetchFinales()
	}, [seccion_id, opcionesGral])

	//Se ejecuta cuando se actualizan las opciones finales
	useEffect(() => {}, [opcionesFinales])

	//Esta función borra y crea las conexiones de opciones y secciones
	async function actualizarOpcionesEnSeccion(opciones: Opcion[]) {
		try {
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/opciones-secciones/update-multiple/`,
				{
					method: 'post',
					body: JSON.stringify({ seccion_id, opciones }),
				}
			)

			if (query.ok) {
				console.log('Si se actualiazaron las opciones')
			} else {
				console.log('No se actualiazaron las opciones')
			}
		} catch (error) {
			console.log(error)
		}
	}

	//Esta función se dispara esperando 3 segundos para actualizar despacio
	const debouncedActualizarOpciones = useCallback(
		debounce((opciones: Opcion[]) => actualizarOpcionesEnSeccion(opciones), 2000),
		[seccion_id]
	)

	async function handleNewOption() {
		try {
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/opciones/create/`,
				{
					method: 'post',
					body: JSON.stringify({ nombre: newOption }),
				}
			)

			const response = await query.json()
			const nuevaOpcion = response.opcion

			if (query.ok) {
				setOpcionesFinales(opciones => {
					const opcionesNuevas = [...(opciones || []), nuevaOpcion]

					//agregar la nueva categoria en la db
					actualizarOpcionesEnSeccion(opcionesNuevas)

					//Actualizar el estado
					return opcionesNuevas
				})

				setNewOption('')
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
					options={opcionesGral || []}
					disableCloseOnSelect
					getOptionLabel={option => option.nombre}
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

						{error && <p className='error'>No se agrego la opción</p>}

						<button onClick={handleNewOption}>
							<Check />
							Agregar opción
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
