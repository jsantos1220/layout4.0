import { useEffect, useState } from 'react'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverEvent,
	DragOverlay,
	DropAnimation,
	defaultDropAnimation,
	DragStartEvent,
	DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SeccionDragagle } from '@components/editor/SeccionDragagle'
import SidebarSecciones from '@components/editor/SidebarSecciones'
import Canvas from '@components/editor/Canvas'
import SidebarControllers from '@components/editor/SidebarControllers'
import useProjectContext from '@context/useProjectContext'
import Fetch from '@utils/Fetch'
import { useNavigate, useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import type { Proyecto, Pagina, Seccion } from '@/index'
import TextoEditable from '@components/inputs/TextoEditable'
import { useControlSave } from '@components/hooks/useControlSave'
import authClient from '@lib/auth-client'

export default function Proyecto() {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()
	const { proyecto_id } = useParams()
	const { proyecto, setProyecto, paginas, setPaginas, nuevaImagen, setNuevaImagen } =
		useProjectContext()
	const [secciones, setSecciones] = useState<Seccion[] | undefined>(undefined)
	const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [titulo, setTitulo] = useState<string>('')

	//Guardar con control + s
	useControlSave(handleUpdateProyecto)

	useEffect(() => {
		buscarProyecto()
		buscarSecciones()
	}, [])

	async function buscarProyecto() {
		try {
			const query = await Fetch(
				//`${import.meta.env.VITE_BACKEND_URL}/api/projects/full/${proyecto_id}`
				`${import.meta.env.VITE_BACKEND_URL}/api/projects/${proyecto_id}`,
			)
			const response = await query.json()

			if (typeof response.proyecto == 'object') {
				setProyecto(response.proyecto)
				setTitulo(response.proyecto.nombre)

				//console.log(response.proyecto)

				//Agregar las paginas si no es un string vacio
				if (response.proyecto.paginas !== '') {
					setPaginas(JSON.parse(response.proyecto.paginas))
				}

				if (response.proyecto?.paginas == '') {
					setPaginas([])
				}
			} else {
				console.log('No esta encontrando el proyecto')
				//navigate('/proyectos')
			}
		} catch (error) {
			//navigate('/proyectos')
			console.log(error)
		}
	}

	async function buscarSecciones() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sections`)
			const response = await query.json()

			if (typeof response.secciones == 'object') {
				//Agregar el draggable_id a cada sección de las paginas
				const nuevasSecciones = response.secciones.map((seccion: Seccion) => {
					return {
						...seccion,
						draggable_id: uuidv4(),
					}
				})

				//setSecciones(response.secciones)
				setSecciones(nuevasSecciones)

				//console.log(response.secciones)
			}
		} catch (error) {
			navigate('/proyectos')
			console.log(error)
		}
	}

	async function handleUpdateProyecto() {
		if (!proyecto || !session.user.id || !proyecto_id) return

		const formData = new FormData()

		// Agrega todos los campos de seccion (excepto imágenes)
		Object.entries(proyecto).forEach(([key, value]) => {
			// Si el valor es null o undefined, no lo agregues
			if (value !== undefined && value !== null) {
				formData.append(key, String(value))
			}
		})

		//Agregar el titulo al FormData
		formData.set('nombre', titulo)
		formData.set('user_id', session.user.id)
		formData.set('proyecto_id', proyecto_id)
		formData.set('activo', '1')
		formData.set('paginas', JSON.stringify(paginas))

		// Solo agrega las imágenes si hay nuevas seleccionadas
		if (nuevaImagen) {
			formData.append('imagen', nuevaImagen)
		}

		// Ejemplo de envío
		try {
			setLoading(true)

			const response = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/projects/update`,
				{
					method: 'POST', // o 'PUT' según tu API
					body: formData,
					credentials: 'include',
				},
				true,
			)
			//const data = await response.json()

			//console.log(data)

			if (response.ok) {
				// Refresca la sección después de un update exitoso
				await buscarProyecto()
				//Limpiar las imagenes
				setNuevaImagen(undefined)
			}
		} catch (error) {
			console.log(error)
			// Maneja el error aquí
		} finally {
			setLoading(false)
		}
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const dropAnimation: DropAnimation = {
		...defaultDropAnimation,
	}

	//Esto basicamente selecciona la seccion que se esta
	//agarrando y la coloca en el state de seccionActiva
	function handleDragStart({ active }: DragStartEvent) {
		if (!secciones || !paginas) return

		const allSections = getAllSeccionsInProject(paginas)

		//Esto es para buscar entre las secciones cual es la que se activa al
		//empezar el drag
		let seccionActiva = secciones.find(seccion => seccion.draggable_id === active.id)
		if (!seccionActiva) {
			seccionActiva = allSections.find(seccion => seccion.draggable_id === active.id)
		}
		//console.log(seccionActiva)
		if (!seccionActiva) return

		setSeccionActiva(seccionActiva)
	}

	function handleDragOver(event: DragEndEvent) {
		if (!paginas) return

		const { active, over } = event

		const seccionDelSidebar: boolean = active.data.current?.adicional

		const idSeccionActiva = active.id
		const idPaginaActiva = active.data.current?.sortable?.containerId
		const idPaginaOver = over?.data.current?.sortable?.containerId

		//Obtener las paginas en las que se estan cambiando las secciones
		const paginaActiva = obtenerPaginaPorId(paginas, idPaginaActiva)
		const paginaOver = obtenerPaginaPorId(paginas, idPaginaOver)

		// --- NUEVO: Reordenar dentro de la misma página en dragOver ---
		if (
			idPaginaActiva === idPaginaOver &&
			paginaActiva &&
			over?.id !== active.id // solo si el over es diferente al active
		) {
			const activeIndex = paginaActiva.secciones?.findIndex(
				seccion => seccion.draggable_id === idSeccionActiva,
			)
			const overIndex = paginaActiva.secciones?.findIndex(
				seccion => seccion.draggable_id === over?.id,
			)

			if (activeIndex !== undefined && overIndex !== undefined && activeIndex !== overIndex) {
				const nuevasPaginas = paginas.map(pagina => {
					if (pagina.pagina_id === idPaginaActiva) {
						return {
							...pagina,
							secciones: arrayMove(pagina.secciones || [], activeIndex, overIndex),
						}
					}
					return pagina
				})
				setPaginas(nuevasPaginas)
				return // Importante: salir para no ejecutar el resto
			}
		}

		//Si el cambio es desde una pagina a otra
		if (idPaginaActiva !== idPaginaOver && paginaActiva && paginaOver) {
			if (!seccionActiva) return

			// 1. Crear nuevas secciones para ambas páginas
			const nuevasSeccionesPaginaActiva =
				paginaActiva.secciones?.filter(seccion => seccion.draggable_id !== idSeccionActiva) ||
				[]

			const nuevasSeccionesPaginaOver = [...(paginaOver.secciones || []), seccionActiva]

			// 2. Crear el nuevo array de páginas
			const nuevasPaginas = paginas.map(pagina => {
				if (pagina.pagina_id === paginaActiva.pagina_id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaActiva,
					}
				}
				if (pagina.pagina_id === paginaOver.pagina_id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaOver,
					}
				}
				return pagina
			})

			setPaginas(nuevasPaginas)
		}

		//Si el elemento es del sidebar para agregarlo a una pagina
		if (seccionDelSidebar && paginaOver) {
			if (!seccionActiva) return

			//Actualiza las secciones agregando la sección activa a
			//la pagina a la que se esta arrastrando
			const nuevasSeccionesPaginaOver = [...(paginaOver.secciones || []), seccionActiva]

			const nuevasPaginas = paginas.map(pagina => {
				if (pagina.pagina_id === paginaOver.pagina_id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaOver,
					}
				}
				return pagina
			})

			setPaginas(nuevasPaginas)
		}
	}

	function handleDragEnd(event: DragOverEvent) {
		const { active, over } = event
		if (!paginas || !over) return

		const idPaginaActiva = active.data.current?.sortable?.containerId
		const idPaginaOver = over?.data.current?.sortable.containerId
		const idSeccionActiva = active.id
		//const idSeccionOver = over.id

		const paginaActiva = obtenerPaginaPorId(paginas, idPaginaActiva)
		const paginaOver = obtenerPaginaPorId(paginas, idPaginaOver)

		//Si se arrasto pero no fue hacia una pagina y se quedo en el sidebar
		if (!paginaActiva || !paginaOver) return

		//Esto se aplica si se arrastra de una pagina a otra
		if (idPaginaActiva != idPaginaOver) {
			const seccionActiva = paginaActiva.secciones?.find(
				seccion => seccion.draggable_id === idSeccionActiva,
			)

			if (!seccionActiva) return

			const nuevasSeccionesPaginaActiva =
				paginaActiva.secciones?.filter(seccion => seccion.draggable_id !== idSeccionActiva) ||
				[]

			const overIndex = over.data.current?.sortable.index || 0
			const nuevasSeccionesPaginaOver = [...(paginaOver.secciones || [])]
			nuevasSeccionesPaginaOver.splice(overIndex, 0, seccionActiva)

			const nuevasPaginas = paginas.map(pagina => {
				if (pagina.pagina_id === paginaActiva.pagina_id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaActiva,
					}
				}
				if (pagina.pagina_id === paginaOver.pagina_id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaOver,
					}
				}
				return pagina
			})

			setPaginas(nuevasPaginas)
		}

		//Cambiar el draggable_id de se sección usada

		const nuevasSecciones = secciones?.map(seccion => {
			if (seccion.seccion_id != seccionActiva?.seccion_id) {
				return { ...seccion }
			}

			return {
				...seccion,
				draggable_id: uuidv4(),
			}
		})
		setSecciones(nuevasSecciones)
		setSeccionActiva(null)
	}

	function getAllSeccionsInProject(paginas: Pagina[]): Seccion[] {
		const seccionesCompletas: Seccion[] = []

		paginas?.forEach(pagina => {
			pagina.secciones?.forEach(seccion => {
				seccionesCompletas.push(seccion)
			})
		})

		return seccionesCompletas
	}

	function obtenerPaginaPorId(paginas: Pagina[], id: string): Pagina | undefined {
		return paginas.find(pagina => pagina.pagina_id === id)
	}

	return (
		<div className='proyecto'>
			<div className='header margin-bottom-3xs'>
				<h1 className='flex-row items-middle flex-wrap gap-2xs'>
					{proyecto.activo == '0' && <div className='estado-borrado'></div>}
					<TextoEditable texto={titulo} setTexto={setTitulo} size={34} />
				</h1>
			</div>

			<div className='proyectos-int'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<SidebarSecciones secciones={secciones} />

					<Canvas />

					<DragOverlay dropAnimation={dropAnimation}>
						{seccionActiva ? <SeccionDragagle seccion={seccionActiva} /> : null}
					</DragOverlay>
				</DndContext>

				<SidebarControllers loading={loading} handleUpdateProyecto={handleUpdateProyecto} />
			</div>
		</div>
	)
}
