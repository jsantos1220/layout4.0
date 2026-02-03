import { Autocomplete, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material'
import Fetch from '@utils/Fetch'
import { ArrowLeftToLine, Copy, Plus, Trash2 } from 'lucide-react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import type { Seccion } from '@/index'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />
const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function Secciones() {
	const [secciones, setSecciones] = useState<Seccion[] | null>()
	const [seccionesFiltradas, setSeccionesFiltradas] = useState<Seccion[] | null>()
	const [categorias, setCategorias] = useState<string[]>([])
	const [categoriasFiltradas, setCategoriasFiltradas] = useState<string[]>([])
	const [opciones, setOpciones] = useState<string[]>([])
	const [opcionesFiltradas, setOpcionesFiltradas] = useState<string[] | undefined>([])
	const [creandoSeccion, setCreandoSeccion] = useState(false)
	const [borrados, setBorrados] = useState<boolean>(false)
	let navigate = useNavigate()

	async function buscarSecciones() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/`)
			const response = await query.json()

			setSecciones(response.secciones)
		} catch (error) {
			console.log(error)
		}
	}

	//Busca las secciones
	useEffect(() => {
		buscarSecciones()
	}, [])

	//Llena las categorias y las opciones
	useEffect(() => {
		let categorias: string[] = []
		let opciones: string[] = []

		secciones?.forEach(seccion => {
			seccion.categorias?.forEach(categoria => {
				categorias.push(categoria.nombre)
			})

			seccion.opciones?.forEach(opcion => {
				opciones.push(opcion.nombre)
			})
		})
		const nuevasCategorias = new Set([...categorias])
		const nuevasOpciones = new Set([...opciones])

		setCategorias([...nuevasCategorias])
		setCategoriasFiltradas([...nuevasCategorias])
		setOpciones([...nuevasOpciones])
	}, [secciones])

	//Filtrar las secciones
	useEffect(() => {
		if (!secciones) return

		// Si todas las categorías están seleccionadas, ignorar filtro de categorías
		const todasCatSeleccionadas = categoriasFiltradas.length === categorias.length

		const nuevasSeccionesFiltradas = secciones.filter(seccion => {
			// NUEVO: Filtro por estado activo (siempre se aplica primero)
			const estadoRequerido = borrados ? '0' : '1'
			if (seccion.activo != estadoRequerido) {
				return false
			}

			// Filtro por opciones (si hay alguna seleccionada)
			if (opcionesFiltradas && opcionesFiltradas.length > 0) {
				return seccion.opciones?.some(opcion => opcionesFiltradas.includes(opcion.nombre))
			}

			// Filtro por categorías (solo si no están todas seleccionadas)
			if (!todasCatSeleccionadas) {
				return seccion.categorias?.some(categoria =>
					categoriasFiltradas.includes(categoria.nombre),
				)
			}

			// Si todas las categorías están seleccionadas y no hay opciones seleccionadas, mostrar todo
			return true
		})

		console.log(nuevasSeccionesFiltradas)

		setSeccionesFiltradas(nuevasSeccionesFiltradas)
	}, [
		secciones,
		categoriasFiltradas,
		opcionesFiltradas,
		categorias.length,
		categoriasFiltradas.length,
		borrados,
	])

	async function crearNuevaSeccion() {
		const formData = new FormData()
		formData.append('nombre', 'Nueva sección')

		try {
			setCreandoSeccion(true)

			//const Fetch2 = async (url: string, options: FetchOptions = {}): Promise<Response> => {
			//	const { token, restoreSession } = useAuthStore.getState()

			//	const executeRequest = async (tokenToUse: string | null) => {
			//		const headers: HeadersInit = {
			//			...(options.headers || {}),
			//			...(tokenToUse && { Authorization: tokenToUse }),
			//			//'Content-Type': 'application/json',
			//		}

			//		return fetch(url, {
			//			headers,
			//			credentials: 'include',
			//			...options,
			//		})
			//	}

			//	try {
			//		// Primera petición con el token actual
			//		const response = await executeRequest(token)

			//		// Si el token expiró (401), intentamos refrescarlo
			//		if (response.status === 401) {
			//			await restoreSession()
			//			const newResponse = await executeRequest(token)

			//			return newResponse
			//		}

			//		return response
			//	} catch (error) {
			//		console.error('Auth fetch error:', error)
			//		throw error
			//	}
			//}

			//TODO esto esta funcionando sin "Auth"
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/sections/create`,
				{
					method: 'post',
					body: formData,
				},
				true,
			)
			//if (!query.ok) throw new Error('No se creo la nueva sección')

			const response = await query.json()
			if (response.seccion.seccion_id) {
				navigate(`/secciones/${response.seccion.seccion_id}`)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setCreandoSeccion(false)
		}
	}

	function handleInputSearch(e: React.ChangeEvent<HTMLInputElement>) {
		if (!secciones) return

		// NUEVO: Filtrar por estado activo primero
		const estadoRequerido = borrados ? '0' : '1'
		const seccionesPorEstado = secciones.filter(seccion => seccion.activo == estadoRequerido)

		const nuevasSecciones = seccionesPorEstado.filter(seccion => {
			if (seccion.nombre.toLocaleLowerCase().includes(e.target.value.toLowerCase())) {
				console.log(true)
				return true
			}

			return false
		})

		setSeccionesFiltradas(nuevasSecciones)
	}

	return (
		<>
			<div className='header margin-bottom-s'>
				<div className='left'>
					<h1>Secciones</h1>

					<button
						onClick={() => crearNuevaSeccion()}
						className='btn-secondary'
						disabled={creandoSeccion}
					>
						<Plus />
						Nueva sección
					</button>
				</div>

				<div className='right'>
					<input
						onChange={e => handleInputSearch(e)}
						className='input-buscar'
						type='text'
						placeholder='Bucscar'
					/>

					<Autocomplete
						className='auto-complete'
						multiple
						options={opciones || []}
						sx={{ width: 300 }}
						size='small'
						limitTags={2}
						disableCloseOnSelect
						getOptionLabel={option => option}
						value={opcionesFiltradas}
						onChange={(_e, value) => {
							setOpcionesFiltradas(value)
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
									{option}
								</li>
							)
						}}
						renderInput={params => <TextField {...params} placeholder='Buscar' />}
					/>

					<button className='borrados btn-lined' onClick={() => setBorrados(!borrados)}>
						{borrados ? (
							<>
								<ArrowLeftToLine />
								Secciones activas
							</>
						) : (
							<>
								<Trash2 />
								Secciones borradas
							</>
						)}
					</button>
				</div>
			</div>

			<div className='secciones-container'>
				<div className='sidebar-secciones'>
					<h3>Categorias</h3>

					<div className='categorias'>
						<FormGroup>
							<FormControlLabel
								className='check-label'
								control={
									<Checkbox
										name='todas'
										checked={categoriasFiltradas.length === categorias?.length}
										onChange={e => {
											if (e.target.checked) {
												setCategoriasFiltradas(categorias ? [...categorias] : [])
											} else {
												setCategoriasFiltradas([])
											}
										}}
									/>
								}
								label='Todas las categorias'
							/>

							{categorias &&
								categorias.map(categoria => (
									<FormControlLabel
										className='check-label'
										key={categoria}
										control={
											<Checkbox
												name={categoria}
												checked={categoriasFiltradas.some(cat => cat === categoria)}
												onChange={e => {
													if (e.target.checked) {
														setCategoriasFiltradas(prev =>
															prev.concat(
																prev.some(cat => cat === categoria)
																	? []
																	: [categoria],
															),
														)
													} else {
														setCategoriasFiltradas(prev =>
															prev.filter(cat => cat !== categoria),
														)
													}
												}}
											/>
										}
										label={categoria}
									/>
								))}
						</FormGroup>
					</div>
				</div>

				<div className='contenido-secciones'>
					{seccionesFiltradas &&
						seccionesFiltradas.map(seccion => (
							<div key={seccion.seccion_id} className='seccion-individual'>
								<div className='imagen'>
									<Link to={`/secciones/${seccion.seccion_id}`}>
										{seccion.imagen_principal == '' ? (
											<img src={`${backendUrl}/uploads/placeholder.jpg`} />
										) : (
											<img src={`${backendUrl}/uploads/${seccion.imagen_principal}`} />
										)}
									</Link>
								</div>

								<div className='meta'>
									<p className='nombre'>{seccion.nombre}</p>

									<div className='botones'>
										<button
											onClick={() => {
												navigator.clipboard.writeText(seccion.codigo || '')
											}}
											className='codigo'
										>
											<Copy /> Copiar
										</button>

										<button className='like'>
											<FavoriteIcon />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</>
	)
}
