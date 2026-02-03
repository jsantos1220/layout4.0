import Fetch from '@utils/Fetch'
import type { Cliente } from 'index'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import TextoEditable from '@components/inputs/TextoEditable'
import ImageFileInput from '@components/inputs/FileInput'
import { LoaderPinwheel, Save, Trash2 } from 'lucide-react'

type Colores = {
	principal?: string
	secundario?: string
	terciario?: string
	texto_principal?: string
	texto_secundario?: string
	texto_terciario?: string
}

type Telefonos = {
	principal?: string
	secundario?: string
}

type Correos = {
	principal?: string
	secundario?: string
}

type Redes = {
	instagram?: string
	facebook?: string
	linkedin?: string
	youtube?: string
}

const backendUrl = import.meta.env.VITE_BACKEND_URL

export default function Cliente() {
	const { cliente_id } = useParams()
	const navigate = useNavigate()
	const [cliente, setCliente] = useState<Cliente | undefined>()
	const [logoColor, setLogoColor] = useState<File | undefined>()
	const [logoBlanco, setLogoBlanco] = useState<File | undefined>()
	const [logoFooter, setLogoFooter] = useState<File | undefined>()

	const [colores, setColores] = useState<Colores | undefined>(undefined)
	const [telefonos, setTelefonos] = useState<Telefonos | undefined>(undefined)
	const [correos, setCorreos] = useState<Correos | undefined>(undefined)
	const [redesSociales, setRedesSociales] = useState<Redes | undefined>(undefined)

	const [loading, setLoading] = useState<boolean>(false)
	const [titulo, setTitulo] = useState<string>('')

	useEffect(() => {
		buscarCliente()
	}, [])

	async function buscarCliente() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clientes/${cliente_id}`)
			const response = await query.json()

			if (typeof response.cliente == 'object') {
				setCliente(response.cliente)
				setTitulo(response.cliente.nombre)

				if (response.cliente.colores !== '') {
					const nuevo = JSON.parse(response.cliente.colores)
					setColores(nuevo)
				}

				if (response.cliente.telefonos !== '') {
					const nuevo = JSON.parse(response.cliente.telefonos)
					setTelefonos(nuevo)
				}

				if (response.cliente.correos !== '') {
					const nuevo = JSON.parse(response.cliente.correos)
					setCorreos(nuevo)
				}

				if (response.cliente.redes_sociales !== '') {
					const nuevo = JSON.parse(response.cliente.redes_sociales)
					setRedesSociales(nuevo)
				}
			} else {
				console.log('No esta encontrando el cliente')
				navigate('/clientes')
			}
		} catch (error) {
			//navigate('/clientes')
			console.log(error)
		}
	}

	async function handleUpdateCliente() {
		if (!cliente) return

		const formData = new FormData()

		// Agrega todos los campos de cliente (excepto imágenes)
		Object.entries(cliente).forEach(([key, value]) => {
			// Si el valor es null o undefined, no lo agregues
			if (value !== undefined && value !== null) {
				formData.append(key, String(value))
			}
		})

		// Solo agrega las imágenes si hay nuevas seleccionadas
		if (logoColor) {
			formData.append('logo_color', logoColor)
		}
		if (logoBlanco) {
			formData.append('logo_footer', logoBlanco)
		}
		if (logoFooter) {
			formData.append('logo_blanco', logoFooter)
		}

		//Agregar el titulo al FormData
		formData.set('nombre', titulo)

		formData.set('colores', colores ? JSON.stringify(colores) : '')
		formData.set('telefonos', telefonos ? JSON.stringify(telefonos) : '')
		formData.set('correos', correos ? JSON.stringify(correos) : '')
		formData.set('redes_sociales', redesSociales ? JSON.stringify(redesSociales) : '')

		// Ejemplo de envío
		try {
			setLoading(true)

			//TODO esto esta funcionando si "Auth"
			const query = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clientes/update`, {
				method: 'POST', // o 'PUT' según tu API
				body: formData,
			})
			const data = await query.json()

			if (!query.ok) throw new Error('No se pudo actualizar')

			console.log(data)

			// Refresca la sección después de un update exitoso
			await buscarCliente()

			//Limpiar las imagenes
			setLogoColor(undefined)
			setLogoBlanco(undefined)
			setLogoFooter(undefined)
		} catch (error) {
			console.log(error)
			// Maneja el error aquí
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<div className='header margin-bottom-s'>
				<h1>
					<TextoEditable texto={titulo} setTexto={setTitulo} size={34} />
				</h1>
			</div>

			<div className='seccion-int cliente-int'>
				<div className='columna columna-1'>
					{/* Imagenes */}
					<div className='panel-blanco'>
						<div className='titulo'>Branding</div>

						<div className='cotenido-panel tres-columnas'>
							{/* tres columnas */}
							<div className='columna'>
								<div className='titulo'>Logo a color</div>

								<div className='contenedor-imagen'>
									{cliente?.logo_color == '' ? (
										<img
											src={backendUrl + '/uploads/placeholder.jpg'}
											alt='Imagen principal'
										/>
									) : (
										<img
											src={backendUrl + '/uploads/' + cliente?.logo_color}
											alt='Imagen principal'
										/>
									)}
								</div>

								<div className='separador'></div>

								<div className='nueva-imagen'>
									<ImageFileInput
										nombre='imagen-amarilla'
										file={logoColor}
										setFile={setLogoColor}
									/>
								</div>
							</div>

							{/* tres columnas */}
							<div className='columna'>
								<div className='titulo'>Logo blanco</div>

								<div className='contenedor-imagen'>
									{cliente?.logo_blanco == '' ? (
										<img
											src={backendUrl + '/uploads/placeholder.jpg'}
											alt='Imagen principal'
										/>
									) : (
										<img
											src={backendUrl + '/uploads/' + cliente?.logo_blanco}
											alt='Imagen principal'
										/>
									)}
								</div>

								<div className='separador'></div>

								<div className='nueva-imagen'>
									<ImageFileInput
										nombre='imagen-principal'
										file={logoFooter}
										setFile={setLogoFooter}
									/>
								</div>
							</div>

							{/* tres columnas */}
							<div className='columna'>
								<div className='titulo'>Logo footer</div>

								<div className='contenedor-imagen'>
									{cliente?.logo_footer == '' ? (
										<img
											src={backendUrl + '/uploads/placeholder.jpg'}
											alt='Imagen principal'
										/>
									) : (
										<img
											src={backendUrl + '/uploads/' + cliente?.logo_footer}
											alt='Imagen principal'
										/>
									)}
								</div>

								<div className='separador'></div>

								<div className='nueva-imagen'>
									<ImageFileInput
										nombre='imagen-principal'
										file={logoBlanco}
										setFile={setLogoBlanco}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Nombre y colores */}
					<div className='panel-blanco'>
						<div className='titulo'>Informaciones</div>

						{/* NOMBRE Y ESLOGAN */}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Nombre</label>

								<input
									name='nombre'
									placeholder='Nombre de la marca'
									type='text'
									value={cliente?.nombre_marca ?? ''}
									onChange={e =>
										setCliente(cliente => {
											if (!cliente) return
											const nuevo = e.target.value
											return { ...cliente, nombre_marca: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-2'>
								<label htmlFor='nombre'>Eslogan</label>

								<input
									name='Eslogan'
									placeholder='Eslogan de la marca'
									type='text'
									value={cliente?.eslogan ?? ''}
									onChange={e =>
										setCliente(cliente => {
											if (!cliente) return
											const eslogan = e.target.value
											return { ...cliente, eslogan }
										})
									}
								/>
							</div>
						</div>

						{/* COLORES PRIMARIOS */}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color principal</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.principal ?? ''}
									onChange={e =>
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), principal: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color secundario</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.secundario ?? ''}
									onChange={e => {
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), secundario: nuevo }
										})
										console.log(colores)
									}}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color terciario</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.terciario ?? ''}
									onChange={e => {
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), terciario: nuevo }
										})
										console.log(e.target.value)
									}}
								/>
							</div>
						</div>

						{/* COLORES DE TEXTO */}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color de texto principal</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.texto_principal ?? ''}
									onChange={e =>
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), texto_principal: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color de texto secundario</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.texto_secundario ?? ''}
									onChange={e => {
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), texto_secundario: nuevo }
										})
									}}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Color de texto terciario</label>

								<input
									name='nombre'
									placeholder='Color'
									type='text'
									value={colores?.texto_terciario ?? ''}
									onChange={e =>
										setColores(color => {
											const nuevo = e.target.value
											return { ...(color || {}), texto_terciario: nuevo }
										})
									}
								/>
							</div>
						</div>
					</div>

					{/* DATOS DE CONTACTO */}
					<div className='panel-blanco'>
						<div className='titulo'>Datos de contacto</div>

						{/* TELEFONOS */}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Teléfono principal</label>

								<input
									placeholder='Teléfono principal'
									type='text'
									value={telefonos?.principal ?? ''}
									onChange={e =>
										setTelefonos(telefono => {
											const nuevo = e.target.value
											return { ...(telefono || {}), principal: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Teléfono secundario</label>

								<input
									placeholder='Teléfono secundario'
									type='text'
									value={telefonos?.secundario ?? ''}
									onChange={e => {
										setTelefonos(telefono => {
											const nuevo = e.target.value
											return { ...(telefono || {}), secundario: nuevo }
										})
										console.log(telefonos)
									}}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Correo principal</label>

								<input
									placeholder='Correo principal'
									type='text'
									value={correos?.principal ?? ''}
									onChange={e =>
										setCorreos(correo => {
											const nuevo = e.target.value
											return { ...(correo || {}), principal: nuevo }
										})
									}
								/>
							</div>
						</div>

						{/* CORREOS*/}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Correo secundario</label>

								<input
									placeholder='Correo secundario'
									type='text'
									value={correos?.secundario ?? ''}
									onChange={e =>
										setCorreos(color => {
											const nuevo = e.target.value
											return { ...(color || {}), secundario: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Dirección</label>

								<input
									placeholder='Dirección'
									type='text'
									value={cliente?.direccion ?? ''}
									onChange={e => {
										setCliente(cliente => {
											if (!cliente) return
											const nuevo = e.target.value
											return { ...cliente, direccion: nuevo }
										})
									}}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Iframe</label>

								<input
									placeholder='Iframe'
									type='text'
									value={cliente?.mapa ?? ''}
									onChange={e =>
										setCliente(cliente => {
											if (!cliente) return
											const nuevo = e.target.value
											return { ...cliente, mapa: nuevo }
										})
									}
								/>
							</div>
						</div>
					</div>

					{/* REDES SOCIALES */}
					<div className='panel-blanco'>
						<div className='titulo'>Redes Sociales</div>

						{/* REDES */}
						<div className='cotenido-panel flex-row'>
							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Instagram</label>

								<input
									placeholder='Instagram'
									type='text'
									value={redesSociales?.instagram ?? ''}
									onChange={e =>
										setRedesSociales(redes => {
											const nuevo = e.target.value
											return { ...(redes || {}), instagram: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Facebook</label>

								<input
									placeholder='Facebook'
									type='text'
									value={redesSociales?.facebook ?? ''}
									onChange={e =>
										setRedesSociales(redes => {
											const nuevo = e.target.value
											return { ...(redes || {}), facebook: nuevo }
										})
									}
								/>
							</div>

							<div className='flex-column gap-2xs flex-1'>
								<label htmlFor='nombre'>Linkedin</label>

								<input
									placeholder='Linkedin'
									type='text'
									value={redesSociales?.linkedin ?? ''}
									onChange={e =>
										setRedesSociales(redes => {
											const nuevo = e.target.value
											return { ...(redes || {}), linkedin: nuevo }
										})
									}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='columna-3'>
					<div className='controllers'>
						<div className='container-controllers'>
							<button
								className='guardar'
								disabled={loading ? true : false}
								onClick={() => handleUpdateCliente()}
							>
								{loading ? <LoaderPinwheel className='spinner' /> : <Save />}
								{loading ? 'Enviando' : 'Guardar'}
							</button>
						</div>

						<div className='container-controllers'>
							<button>
								<Trash2 />
								Borrar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
