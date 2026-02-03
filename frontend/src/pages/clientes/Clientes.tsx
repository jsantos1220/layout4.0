import Fetch from '@utils/Fetch'
import { Cliente } from 'index'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function Clientes() {
	const navigate = useNavigate()
	const [clientes, setClientes] = useState<Cliente[] | null>([])
	const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[] | null>([])
	const [creandoCliente, setCreandoCliente] = useState(false)

	//Busca las secciones
	useEffect(() => {
		buscarClientes()
	}, [])

	async function buscarClientes() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clientes/`)
			const response = await query.json()

			setClientes(response.clientes)
			setClientesFiltrados(response.clientes)
			//console.log(response.clientes)
		} catch (error) {
			console.log(error)
		}
	}

	//Crear nuevo cliente
	async function crearNuevoCliente() {
		const formData = new FormData()
		formData.append('nombre', 'Nuevo cliente')

		try {
			setCreandoCliente(true)

			//TODO esto esta funcionando sin "Auth"
			const query = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/clientes/create`,
				{
					method: 'post',
					body: formData,
				}
			)
			//if (!query.ok) throw new Error('No se creo la nueva sección')
			const response = await query.json()

			if (query.ok) {
				//buscarClientes()
				navigate(`/clientes/${response.cliente.cliente_id}`)
			}

			console.log(response)
		} catch (error) {
			console.log(error)
		} finally {
			setCreandoCliente(false)
		}
	}

	//Filtrar por nombre
	function handleInputSearch(e: React.ChangeEvent<HTMLInputElement>) {
		if (!clientes) return

		const nuevosClientes = clientes.filter(cliente => {
			if (cliente.nombre.toLocaleLowerCase().includes(e.target.value.toLowerCase())) {
				return true
			}

			return false
		})

		setClientesFiltrados(nuevosClientes)
	}

	return (
		<>
			<div className='header margin-bottom-s'>
				<div className='left'>
					<h1>Clientes</h1>

					<button
						onClick={() => crearNuevoCliente()}
						className='btn-secondary'
						disabled={creandoCliente}
					>
						<Plus />
						Nuevo cliente
					</button>
				</div>

				<div className='right'>
					<input
						onChange={e => handleInputSearch(e)}
						className='input-buscar'
						type='text'
						placeholder='Bucscar'
					/>
				</div>
			</div>

			<div className='contenido-clientes'>
				{clientesFiltrados &&
					clientesFiltrados.map(cliente => (
						<Link key={cliente.cliente_id} to={`/clientes/${cliente.cliente_id}`}>
							<div className='cliente-individual'>
								<div className='imagen'>
									{cliente.logo_color == '' ? (
										<img
											src={`${backendUrl}/uploads/placeholder-cliente.svg`}
										/>
									) : (
										<img src={`${backendUrl}/uploads/${cliente.logo_color}`} />
									)}
								</div>

								<div className='nombre'>{cliente.nombre}</div>
							</div>
						</Link>
					))}
			</div>
		</>
	)
}
