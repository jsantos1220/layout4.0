import PaginaIndividual from './PaginaIndividual'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import type { Pagina, Proyecto } from '@/index'
import useProjectContext from '@context/useProjectContext'

export type CanvasType = {
	proyecto: Proyecto
	paginas: Pagina[]
	setPaginas: React.Dispatch<React.SetStateAction<Pagina[]>>
}

export default function Canvas() {
	const { proyecto, paginas, setPaginas } = useProjectContext()
	const [nivelZoom, setNivelZoom] = useState<number>(1.25)
	const [altura, setAltura] = useState<number>(0)
	const seccionesRef = useRef<HTMLDivElement>(null)

	//Darle la altura necesaria
	useEffect(() => {
		const calcularAltura = () => {
			if (seccionesRef.current) {
				const rect = seccionesRef.current.getBoundingClientRect()
				const distanciaDelTop = rect.top // Qué tan lejos está del top de la ventana
				const alturaDisponible = window.innerHeight - distanciaDelTop - 20 // Restar 20px de margen
				setAltura(Math.max(alturaDisponible, 200)) // Mínimo 200px
			}
		}

		calcularAltura()
		window.addEventListener('resize', calcularAltura)

		return () => {
			window.removeEventListener('resize', calcularAltura)
			window.removeEventListener('scroll', calcularAltura)
		}
	}, [])

	function handleNewPage() {
		if (!proyecto.id) {
			console.error('No hay proyecto cargado')
			return
		}

		const newPage: Pagina = {
			id: uuid(),
			nombre: 'Nueva pagina',
			proyecto_id: proyecto.id,
			plantilla_id: '',
			secciones: [],
			orden: '0',
			created: Date.now(),
			updated: Date.now(),
		}

		console.log(paginas)
		if (!paginas) return

		setPaginas([...paginas, newPage])
	}

	return (
		<div className='canvas-wrapper'>
			<div className='canvas' ref={seccionesRef} style={{ height: `${altura}px` }}>
				<div className='pagina-contenedor'>
					{paginas &&
						paginas?.map(pagina => (
							<PaginaIndividual
								key={pagina.id}
								id={pagina.id}
								pagina={pagina}
								setPaginas={setPaginas}
								secciones={pagina.secciones}
								zoom={nivelZoom}
							></PaginaIndividual>
						))}

					<button onClick={() => handleNewPage()} className='pagina-adicional'>
						<img src='../../../images/plus-2.svg' alt='Adicionar pagina' />
						<p>Crear nueva pagina</p>
					</button>
				</div>
			</div>
			<div className='zoom-nav'>
				<button onClick={() => setNivelZoom(zoom => zoom + 0.25)} className='mas'>
					<img src='../../../images/zoom-mas.svg' alt='Aumentar' />
				</button>
				<button onClick={() => setNivelZoom(zoom => zoom - 0.25)} className='menos'>
					<img src='../../../images/zoom-menos.svg' alt='Reducir' />
				</button>
			</div>
		</div>
	)
}
