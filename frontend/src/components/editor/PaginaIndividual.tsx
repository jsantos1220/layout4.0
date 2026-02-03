import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './SortableItem'
import { v4 as uuid } from 'uuid'
import { useEffect, useState } from 'react'
import useProjectContext from '@context/useProjectContext'
import type { Bricks, BricksContent, GlobalClasses, Pagina, Seccion } from 'index'
import TextoEditable from '@components/inputs/TextoEditable'
import { ArrowBigLeft, ArrowBigRight, Copy, FileJson2, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import jsonToObject from '@utils/jsonToObject'

type PaginaIndividualType = {
	id: string
	pagina: Pagina
	setPaginas: (paginas: Pagina[]) => void
	secciones?: Seccion[]
	zoom: number
}

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function PaginaIndividual({
	id,
	secciones,
	zoom,
	pagina,
}: PaginaIndividualType) {
	const { paginas, setPaginas } = useProjectContext()
	const { setNodeRef } = useDroppable({ id })
	const [nombre, setNombre] = useState(pagina.nombre)

	const sortableItems =
		secciones?.map(seccion => ({
			id: seccion.seccion_id,
		})) || []

	function handleDeletePagina() {
		const newPages = paginas.filter(pagina => pagina.pagina_id !== id)
		setPaginas(newPages)
	}

	function handleDeleteSection(draggable_id: string | undefined) {
		const nuevasSecciones = pagina.secciones?.filter(
			seccion => seccion.draggable_id !== draggable_id
		)

		const paginasActualizadas = paginas.map(pagina => {
			if (pagina.pagina_id !== id) return pagina

			return {
				...pagina,
				secciones: nuevasSecciones,
			}
		})

		setPaginas(paginasActualizadas)
	}

	function handleDuplicateSection(seccion: Seccion) {
		if (!pagina.secciones) return

		const nuevaSeccion: Seccion = {
			...seccion,
			draggable_id: uuidv4(),
		}

		const newPage: Pagina = {
			...pagina,
			secciones: [...pagina.secciones, nuevaSeccion],
		}

		const paginaActualizada = paginas.map(p => {
			if (p.pagina_id == pagina.pagina_id) {
				return newPage
			}

			return p
		})

		setPaginas(paginaActualizada)
	}

	function handleDuplicatePage() {
		if (!pagina) return

		const nuevaPagina: Pagina = {
			...pagina,
			pagina_id: uuidv4(),
			nombre: 'Nueva pagina',
			secciones: pagina.secciones?.map(seccion => {
				return {
					...seccion,
					draggable_id: uuidv4(),
				}
			}),
		}

		setPaginas([...paginas, nuevaPagina])
	}

	function handleMoveLeft() {
		const index = paginas.findIndex(p => p.pagina_id === id)

		if (index > 0) {
			const nuevasPaginas = [...paginas]
			const temp = nuevasPaginas[index - 1]
			nuevasPaginas[index - 1] = nuevasPaginas[index]
			nuevasPaginas[index] = temp
			setPaginas(nuevasPaginas)
		}
	}

	function handleMoveRight() {
		const index = paginas.findIndex(p => p.pagina_id === id)
		if (index < paginas.length - 1) {
			const nuevasPaginas = [...paginas]
			const temp = nuevasPaginas[index + 1]
			nuevasPaginas[index + 1] = nuevasPaginas[index]
			nuevasPaginas[index] = temp
			setPaginas(nuevasPaginas)
		}
	}

	function copyPageCode() {
		console.log(pagina.secciones)

		const secciones = pagina.secciones?.map(seccion => {
			for (const property in seccion) {
				if (property == 'codigo') {
					return jsonToObject(seccion[property])
				}
			}
		})

		let content: BricksContent[] = []
		let globalClasses: GlobalClasses[] = []

		secciones?.forEach(seccion => {
			seccion?.content.forEach(cont => {
				content.push(cont)
			})
			seccion?.globalClasses.forEach(cont => {
				globalClasses.push(cont)
			})
		})

		const nuevaPagina: Bricks = {
			nombre,
			content,
			source: 'bricksCopiedElements',
			sourceUrl: 'http://localhost:10267',
			globalClasses,
		}

		navigator.clipboard.writeText(JSON.stringify(nuevaPagina) || '')
	}

	useEffect(() => {
		const paginasActualizadas = paginas.map(pagina => {
			if (pagina.pagina_id !== id) return pagina

			return {
				...pagina,
				nombre,
			}
		})

		setPaginas(paginasActualizadas)
	}, [nombre])

	return (
		<SortableContext
			id={id}
			items={sortableItems}
			strategy={verticalListSortingStrategy}
		>
			<div
				className='pagina-sorteable'
				ref={setNodeRef}
				style={{ minWidth: `${300 * zoom}px`, marginRight: `${5 * zoom}px` }}
			>
				<div className='cabecera'>
					<div className='left'>
						<h4>
							<TextoEditable texto={nombre} setTexto={setNombre} size={16} />
						</h4>

						<button className='btn-copiar-gris' onClick={copyPageCode}>
							<FileJson2 />
						</button>

						<button className='btn-copiar-gris' onClick={handleDuplicatePage}>
							<Copy />
						</button>

						<button className='btn-borrar-gris' onClick={handleDeletePagina}>
							<Trash2 />
						</button>
					</div>

					<div className='right'>
						<button onClick={handleMoveLeft}>
							<ArrowBigLeft />
						</button>

						<button onClick={handleMoveRight}>
							<ArrowBigRight />
						</button>
					</div>
				</div>

				{secciones?.length !== 0 ? (
					secciones?.map(seccion => (
						<div key={seccion.draggable_id} className='seccion-contenido'>
							<SortableItem
								id={seccion.draggable_id ?? seccion.seccion_id}
								key={seccion.draggable_id}
							>
								<img src={`${backendUrl}/uploads/${seccion.imagen_principal}`} />
							</SortableItem>

							<button
								className='duplicate-section'
								onClick={() => handleDuplicateSection(seccion)}
							>
								<Copy />
							</button>

							<button
								className='delete-section'
								onClick={() => handleDeleteSection(seccion.draggable_id)}
							>
								<Trash2 />
							</button>
						</div>
					))
				) : (
					<SortableItem id={uuid()}>
						<div className='seccion-vacia'>
							<div className='seccion-vacia-int'>
								<img src={`http://localhost:3001/uploads/empty-page.png`} />
							</div>
						</div>
					</SortableItem>
				)}
			</div>
		</SortableContext>
	)
}
