import { Autocomplete, TextField } from '@mui/material'
import type { Seccion } from 'index'
import { useEffect, useRef, useState } from 'react'
import { DraggableSidebar } from './DraggableSidebar'
import Masonry from '@mui/lab/Masonry'

const colors = [
	{ name: 'Azul', value: '#2196f3' },
	{ name: 'Amarillo', value: '#ffc107' },
	{ name: 'Rojo', value: '#f44336' },
	{ name: 'Verde', value: '#4caf50' },
]

export default function SidebarSecciones({
	secciones,
}: {
	secciones: Seccion[] | undefined
}) {
	const [selectedColor, setSelectedColor] = useState(colors[0])
	const [isOpen, setIsOpen] = useState(false)

	const [seccionesFiltradas, setSeccionesFiltradas] = useState<Seccion[] | null>()
	const [categorias, setCategorias] = useState<string[]>([])
	const [categoriasFiltradas, setCategoriasFiltradas] = useState<string | null>('')
	const [opciones, setOpciones] = useState<string[]>([])
	const [opcionesFiltradas, setOpcionesFiltradas] = useState<string | null>('')

	const [altura, setAltura] = useState<number>(0)
	const seccionesRef = useRef<HTMLDivElement>(null)

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
		//setCategoriasFiltradas([...nuevasCategorias])
		setOpciones([...nuevasOpciones])
	}, [secciones])

	//Filtrar las secciones
	useEffect(() => {
		if (!secciones) return

		const nuevasSeccionesFiltradas = secciones.filter(seccion => {
			// Filtro por opciones (si hay alguna seleccionada)
			if (opcionesFiltradas && opcionesFiltradas.length > 0) {
				return seccion.opciones?.some(opcion =>
					opcionesFiltradas.includes(opcion.nombre)
				)
			}

			// Filtro por opciones (si hay alguna seleccionada)
			if (categoriasFiltradas && categoriasFiltradas.length > 0) {
				return seccion.categorias?.some(categoria =>
					categoriasFiltradas.includes(categoria.nombre)
				)
			}

			// Si todas las categorías están seleccionadas y no hay opciones seleccionadas, mostrar todo
			return true
		})

		setSeccionesFiltradas(nuevasSeccionesFiltradas)
	}, [secciones, categoriasFiltradas, opcionesFiltradas, categorias.length])

	//Darle la altura necesaria
	useEffect(() => {
		const calcularAltura = () => {
			if (seccionesRef.current) {
				const rect = seccionesRef.current.getBoundingClientRect()
				const distanciaDelTop = rect.top // Qué tan lejos está del top de la ventana
				const alturaDisponible = window.innerHeight - distanciaDelTop - 20 // Restar 20px de margen
				setAltura(Math.max(alturaDisponible, 200))
			}
		}

		calcularAltura()
		window.addEventListener('resize', calcularAltura) // Recalcular al redimensionar

		return () => {
			window.removeEventListener('resize', calcularAltura)
			window.removeEventListener('scroll', calcularAltura)
		}
	}, [])

	return (
		<div className='secciones'>
			<div className='selectores margin-bottom-s'>
				<Autocomplete
					disablePortal
					options={categorias}
					sx={{ width: 202, flexShrink: 0 }}
					size='small'
					className='autocomplete'
					renderInput={params => <TextField {...params} label='Categorias' />}
					onChange={(_e, value) => {
						setCategoriasFiltradas(value)
					}}
				/>

				<Autocomplete
					disablePortal
					options={opciones}
					sx={{ width: 138, flexShrink: 0 }}
					size='small'
					className='autocomplete'
					renderInput={params => <TextField {...params} label='Opciones' />}
					onChange={(_e, value) => {
						setOpcionesFiltradas(value)
					}}
				/>

				<div className='color-selector'>
					<div
						className='color-box'
						style={{ backgroundColor: selectedColor.value }}
						onClick={() => setIsOpen(!isOpen)}
					></div>

					{isOpen && (
						<ul className='colors-list'>
							{colors.map(color => (
								<li
									key={color.name}
									onClick={() => {
										setSelectedColor(color)
										setIsOpen(false)
									}}
								>
									<span
										className='color-preview'
										style={{ backgroundColor: color.value }}
									></span>
									<span className='color-name'>{color.name}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div
				className='contenedor-secciones'
				ref={seccionesRef}
				style={{ height: `${altura}px` }}
			>
				<Masonry columns={2} spacing={1.5}>
					{(seccionesFiltradas ?? []).map(seccion => (
						<DraggableSidebar key={seccion.seccion_id} seccion={seccion} />
					))}
				</Masonry>
			</div>
		</div>
	)
}
