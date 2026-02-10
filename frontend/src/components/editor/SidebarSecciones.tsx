import { Autocomplete, TextField } from '@mui/material'
import type { Seccion } from '@/index'
import { useEffect, useRef, useState } from 'react'
import { DraggableSidebar } from './DraggableSidebar'
import Masonry from '@mui/lab/Masonry'
import { LayoutGrid, Rows3 } from 'lucide-react'
import styled from 'styled-components'

export default function SidebarSecciones({ secciones }: { secciones: Seccion[] | undefined }) {
	const [seccionesFiltradas, setSeccionesFiltradas] = useState<Seccion[] | null>()
	const [categorias, setCategorias] = useState<string[]>([])
	const [categoriasFiltradas, setCategoriasFiltradas] = useState<string | null>('')
	const [opciones, setOpciones] = useState<string[]>([])
	const [opcionesFiltradas, setOpcionesFiltradas] = useState<string | null>('')
	const [columnas, setColumnas] = useState(true)

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
				return seccion.opciones?.some(opcion => opcionesFiltradas.includes(opcion.nombre))
			}

			// Filtro por opciones (si hay alguna seleccionada)
			if (categoriasFiltradas && categoriasFiltradas.length > 0) {
				return seccion.categorias?.some(categoria =>
					categoriasFiltradas.includes(categoria.nombre),
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
			<Selectores className='margin-bottom-s'>
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

				<div className='color-selector' onClick={() => setColumnas(!columnas)}>
					<div className='color-box'>{columnas == true ? <Rows3 /> : <LayoutGrid />}</div>
				</div>
			</Selectores>

			<div className='contenedor-secciones' ref={seccionesRef} style={{ height: `${altura}px` }}>
				<Masonry columns={columnas == true ? 2 : 1} spacing={1.5}>
					{(seccionesFiltradas ?? []).map(seccion => (
						<DraggableSidebar key={seccion.id} seccion={seccion} />
					))}
				</Masonry>
			</div>
		</div>
	)
}

const Selectores = styled.div`
	display: flex;
	gap: 20px;

	.color-selector {
		position: relative;
		border: 1px solid ${({ theme }) => theme.grey};
		padding: 7px 6px 6px 7px;
		border-radius: 4px;

		.color-box {
			cursor: pointer;
			width: 25px;
			height: 25px;
		}

		&:hover {
			cursor: pointer;
			background-color: ${({ theme }) => theme.primary};
			color: white;
		}
	}

	.colors-list {
		position: absolute;
		top: 100%;
		left: 0;
		width: 200px;
		margin-top: 8px;
		padding: 8px;
		background: white;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		list-style: none;
		z-index: 1000;

		li {
			display: flex;
			align-items: center;
			padding: 8px;
			cursor: pointer;
			transition: background-color 0.2s ease;

			&:hover {
				background-color: #f5f5f5;
			}
		}

		.color-preview {
			width: 24px;
			height: 24px;
			border-radius: 4px;
			margin-right: 8px;
			border: 1px solid #ddd;
		}

		.color-name {
			font-size: 14px;
		}
	}
`
