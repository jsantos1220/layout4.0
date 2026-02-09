import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { Proyecto } from '@/index'
import { ArrowLeftToLine, Plus, Trash2 } from 'lucide-react'
import { getAllProyectos } from '@/src/api/crudProyectos'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function Proyectos() {
	const [proyectosFiltrados, setProyectosFiltrados] = useState<Proyecto[] | undefined>([])
	const [borrados, setBorrados] = useState<boolean>(false)

	const {
		data: proyectos,
		error: errorProyectos,
		isLoading,
	} = useQuery({
		queryKey: ['proyectos'],
		queryFn: async () => await getAllProyectos(),
	})

	useEffect(() => {
		const proyectosActivos = proyectos?.filter(proyecto => proyecto.activo == '1')
		const proyectosBorrados = proyectos?.filter(proyecto => proyecto.activo == '0')

		if (borrados == true) {
			setProyectosFiltrados(proyectosBorrados)
		}

		if (borrados == false) {
			setProyectosFiltrados(proyectosActivos)
		}
	}, [proyectos, borrados])

	//Filtrar por nombre
	function handleInputSearch(e: React.ChangeEvent<HTMLInputElement>) {
		if (!proyectos) return

		const nuevosClientes = proyectos.filter(cliente => {
			if (cliente.nombre.toLocaleLowerCase().includes(e.target.value.toLowerCase())) {
				return true
			}

			return false
		})

		setProyectosFiltrados(nuevosClientes)
	}

	if (isLoading) {
		return <h1>Cargando proyectos...</h1>
	}

	if (errorProyectos) {
		return <h1>Error al buscar los proyectos...</h1>
	}

	return (
		<div className='proyectos'>
			<div className='header columns-2 column--on-m'>
				<div className='left'>
					<h1>Proyectos</h1>

					<Link to='/proyectos/nuevo' className='btn-secondary'>
						<Plus />
						Nuevo proyecto
					</Link>
				</div>

				<div className='right'>
					<input
						onChange={e => handleInputSearch(e)}
						className='input-buscar'
						type='text'
						placeholder='Bucscar'
					/>

					<button className='borrados btn-lined' onClick={() => setBorrados(!borrados)}>
						{borrados ? (
							<>
								<ArrowLeftToLine />
								Proyectos activos
							</>
						) : (
							<>
								<Trash2 />
								Proyectos borrados
							</>
						)}
					</button>
				</div>
			</div>

			<div className='columns-4 column--on-m gap-m margin-top-m'>
				{proyectosFiltrados &&
					proyectosFiltrados.map((proyecto, index) => (
						<Link to={`/proyectos/${proyecto.id}`} key={index} className='proyecto-card'>
							<div className='imagen margin-bottom-xs'>
								{proyecto.imagen == '' ? (
									<img src={`${backendUrl}/uploads/placeholder.jpg`} />
								) : (
									<img src={`${backendUrl}/uploads/${proyecto.imagen}`} />
								)}
							</div>

							<div className='info'>
								<h4>{proyecto.nombre}</h4>

								<p className='text-s'>
									{proyecto.created} - {proyecto.updated}
								</p>
							</div>
						</Link>
					))}
			</div>
		</div>
	)
}
