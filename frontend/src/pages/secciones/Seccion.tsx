import SidebarSeccionIndividual from '@components/SidebarSeccionIndividual'
import Fetch from '@utils/Fetch'
import type { Seccion } from '@/index'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import CodeEditor from '@uiw/react-textarea-code-editor'
import ImagenPrincipal from '@components/editar-seccion/ImagenPrincipal'
import ImagenesVariables from '@components/editar-seccion/ImagenesVariables'
import MetaDatos from '@components/editar-seccion/MetaDatos'
import SidebarCategorias from '@components/editar-seccion/SidebarCategorias'
import SidebarOpciones from '@components/editar-seccion/SidebarOpciones'
import TextoEditable from '@components/inputs/TextoEditable'
import { useControlSave } from '@components/hooks/useControlSave'

export default function Seccion() {
	const { seccion_id } = useParams()
	const navigate = useNavigate()
	const [seccion, setSeccion] = useState<Seccion | undefined>()
	const [nuevaImagenPrincipal, setNuevaImagenPrincipal] = useState<File | undefined>()
	const [nuevaImagenAmarilla, setNuevaImagenAmarilla] = useState<File | undefined>()
	const [nuevaImagenVerde, setNuevaImagenVerde] = useState<File | undefined>()
	const [nuevaImagenRoja, setNuevaImagenRoja] = useState<File | undefined>()
	const [loading, setLoading] = useState<boolean>(false)
	const [titulo, setTitulo] = useState<string>('')

	useEffect(() => {
		buscarSeccion()
	}, [])

	//Guardar con control + s
	useControlSave(handleUpdateSeccion)

	async function buscarSeccion() {
		try {
			const query = await Fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sections/${seccion_id}`)
			const response = await query.json()

			if (typeof response.section == 'object') {
				setSeccion(response.section)
				setTitulo(response.section.nombre)
			} else {
				console.log('No esta encontrando el proyecto')
				navigate('/secciones')
			}
		} catch (error) {
			navigate('/secciones')
			console.log(error)
		}
	}

	async function handleUpdateSeccion() {
		if (!seccion) return

		/* 
         Donde me quede? hay que ver klk con el type de las imagenes
         que es lo que estamos guardando si es un string o un File
         Luego hay que hacer una petición de prueba a ver si se crea 
         la sección, despues hay que poner todo esto a funcionar con 
         react query y poner a funcionar todo lo demás, gracias
      
      */

		const payload: Partial<Seccion> = {
			nombre: titulo,
			activo: true,
		}

		// Solo agrega imágenes si hay nuevas
		if (nuevaImagenPrincipal) payload.imagen_principal = nuevaImagenPrincipal
		if (nuevaImagenAmarilla) payload.imagen_amarilla = nuevaImagenAmarilla
		if (nuevaImagenVerde) payload.imagen_verde = nuevaImagenVerde
		if (nuevaImagenRoja) payload.imagen_roja = nuevaImagenRoja

		// Ejemplo de envío
		try {
			setLoading(true)

			const response = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/sections/update`,
				{
					method: 'POST', // o 'PUT' según tu API
					body: formData,
				},
				true,
			)
			//const data = await response.json()

			if (!response.ok) throw new Error()

			// Refresca la sección después de un update exitoso
			await buscarSeccion()

			//Limpiar las imagenes
			setNuevaImagenPrincipal(undefined)
			setNuevaImagenAmarilla(undefined)
			setNuevaImagenVerde(undefined)
			setNuevaImagenRoja(undefined)
		} catch (error) {
			console.log(error)
			// Maneja el error aquí
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className=''>
			<div className='header margin-bottom-s'>
				<h1 className='flex-row items-middle flex-wrap gap-2xs'>
					{seccion?.activo == '0' && <div className='estado-borrado'></div>}
					<TextoEditable texto={titulo} setTexto={setTitulo} size={34} />
				</h1>
			</div>

			<div className='seccion-int'>
				<div className='columna columna-1'>
					<div className='panel-blanco'>
						<div className='titulo'>Imagen principal</div>

						<ImagenPrincipal
							seccion={seccion}
							nuevaImagenPrincipal={nuevaImagenPrincipal}
							setNuevaImagenPrincipal={setNuevaImagenPrincipal}
						/>
					</div>

					<div className='panel-blanco'>
						<div className='titulo'>Variaciones de imagenes</div>

						<ImagenesVariables
							seccion={seccion}
							nuevaImagenAmarilla={nuevaImagenAmarilla}
							setNuevaImagenAmarilla={setNuevaImagenAmarilla}
							nuevaImagenRoja={nuevaImagenRoja}
							setNuevaImagenRoja={setNuevaImagenRoja}
							nuevaImagenVerde={nuevaImagenVerde}
							setNuevaImagenVerde={setNuevaImagenVerde}
						/>
					</div>

					<div className='panel-blanco'>
						<div className='titulo'>Código de Bricks</div>

						<div className='cotenido-panel'>
							<CodeEditor
								value={seccion?.codigo}
								language='js'
								onChange={e =>
									setSeccion(seccion => {
										if (!seccion) return
										return {
											...seccion,
											codigo: e.target.value,
										}
									})
								}
								padding={15}
							/>
						</div>
					</div>
				</div>

				<div className='columna columna-2'>
					<div className='panel-blanco'>
						<div className='titulo'>Meta datos</div>

						<MetaDatos seccion={seccion} setSeccion={setSeccion} />
					</div>

					<div className='panel-blanco'>
						<div className='titulo'>Categorías</div>

						<SidebarCategorias seccion_id={seccion?.id} />
					</div>

					<div className='panel-blanco'>
						<div className='titulo'>Opciones</div>

						<SidebarOpciones seccion_id={seccion?.id} />
					</div>
				</div>

				<div className='columna-3'>
					<SidebarSeccionIndividual
						loading={loading}
						handleUpdateSeccion={handleUpdateSeccion}
					/>
				</div>
			</div>
		</div>
	)
}
