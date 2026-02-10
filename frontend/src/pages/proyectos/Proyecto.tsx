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
import { useParams } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import type { Proyecto, Pagina, Seccion, ProyectoUpdatePayload } from '@/index'
import TextoEditable from '@components/inputs/TextoEditable'
import { useControlSave } from '@components/hooks/useControlSave'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProyectoById, updateProyecto } from '@/src/api/crudProyectos'
import { getAllSecciones } from '@/src/api/crudSecciones'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default function Proyecto() {
	//const navigate = useNavigate()
	const { id } = useParams()
	const {
		setProyecto,
		paginas,
		setPaginas,
		secciones,
		setSecciones,
		nuevaImagen,
		setNuevaImagen,
	} = useProjectContext()
	const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null)
	const [titulo, setTitulo] = useState<string>('')
	const queryClient = useQueryClient()
	const notyf = new Notyf()

	//Buscar la información del proyecto
	const { data: proyecto } = useQuery({
		queryKey: ['proyectos', id],
		enabled: !!id,
		queryFn: async () => await getProyectoById(id),
	})

	useEffect(() => {
		setProyecto(proyecto)
		setTitulo(proyecto?.nombre)

		if (typeof proyecto?.paginas === 'string' && proyecto?.paginas != '') {
			setPaginas(JSON.parse(proyecto?.paginas))
		}

		if (proyecto?.paginas == '') {
			setPaginas([])
		}
	}, [proyecto])

	//Buscar todas las secciones
	const { data: dataSecciones } = useQuery({
		queryKey: ['secciones'],
		queryFn: async () => await getAllSecciones(),
	})

	useEffect(() => {
		if (typeof dataSecciones == 'object') {
			console.log('esto entra?')
			//Agregar el draggable_id a cada sección de las paginas
			const nuevasSecciones = dataSecciones.map((seccion: Seccion) => {
				return {
					...seccion,
					draggable_id: uuidv4(),
				}
			})

			//setSecciones(secciones)
			setSecciones(nuevasSecciones)
		}
	}, [dataSecciones])

	const { mutate: handleUpdateProyecto, isPending } = useMutation({
		mutationFn: async () => {
			//Opcion para grabar con las secciones son codigo
			//const paginasActuales = JSON.stringify(paginas)

			//Quitarle a las secciones el contenido antes de guardar
			const nuevasPaginas = paginas.map(pagina => {
				const secciones = pagina.secciones.map(seccion => {
					return { ...seccion, codigo: '' }
				})

				return { ...pagina, secciones: secciones }
			})

			const payload: ProyectoUpdatePayload = {
				usuario: proyecto.usuario,
				cliente: proyecto.cliente || '',
				nombre: proyecto.nombre || '',
				imagen: nuevaImagen || proyecto.imagen,
				codigo: proyecto.codigo || '',
				contenido: proyecto.contenido || '',
				activo: proyecto.activo || true,
				created: proyecto.contenido || '',
				updated: proyecto.contenido || '',
				paginas: JSON.stringify(nuevasPaginas) || proyecto.paginas,
			}

			await updateProyecto(proyecto.id, payload)

			//Limpiar las imagenes
			setNuevaImagen(undefined)
		},
		onSuccess: () => {
			notyf.success('Proyecto actualizado')
			queryClient.invalidateQueries({ queryKey: ['proyectos', id] })
		},
		onError: () => {
			notyf.error('Error al actualizar la sección')
		},
	})

	//Guardar con control + s
	useControlSave(handleUpdateProyecto)

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

		console.log(secciones)

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
					if (pagina.id === idPaginaActiva) {
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
				if (pagina.id === paginaActiva.id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaActiva,
					}
				}
				if (pagina.id === paginaOver.id) {
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
				if (pagina.id === paginaOver.id) {
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
				if (pagina.id === paginaActiva.id) {
					return {
						...pagina,
						secciones: nuevasSeccionesPaginaActiva,
					}
				}
				if (pagina.id === paginaOver.id) {
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
			if (seccion.id != seccionActiva?.id) {
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
		return paginas.find(pagina => pagina.id === id)
	}

	return (
		<div className='proyecto'>
			<div className='header margin-bottom-3xs'>
				<h1 className='flex-row items-middle flex-wrap gap-2xs'>
					{proyecto?.activo == false && <div className='estado-borrado'></div>}
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

				<SidebarControllers loading={isPending} handleUpdateProyecto={handleUpdateProyecto} />
			</div>
		</div>
	)
}
