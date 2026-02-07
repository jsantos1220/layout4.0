import SidebarSeccionIndividual from '@components/SidebarSeccionIndividual'
import type { Seccion, SeccionUpdatePayload } from '@/index'
import { useState } from 'react'
import { useParams } from 'react-router'
import CodeEditor from '@uiw/react-textarea-code-editor'
import ImagenPrincipal from '@components/editar-seccion/ImagenPrincipal'
//import ImagenesVariables from '@components/editar-seccion/ImagenesVariables'
import MetaDatos from '@components/editar-seccion/MetaDatos'
import SidebarCategorias from '@components/editar-seccion/SidebarCategorias'
import SidebarOpciones from '@components/editar-seccion/SidebarOpciones'
import TextoEditable from '@components/inputs/TextoEditable'
import { useControlSave } from '@components/hooks/useControlSave'
import { getSeccionById, updateSeccion } from '@/src/api/crudSecciones'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export default function Seccion() {
	const { id } = useParams()
	const [seccion, setSeccion] = useState<Seccion | undefined>()
	const [nuevaImagenPrincipal, setNuevaImagenPrincipal] = useState<File | undefined>()
	const [nuevaImagenAmarilla, setNuevaImagenAmarilla] = useState<File | undefined>()
	const [nuevaImagenVerde, setNuevaImagenVerde] = useState<File | undefined>()
	const [nuevaImagenRoja, setNuevaImagenRoja] = useState<File | undefined>()
	const [nombre, setNombre] = useState<string>('')
	const queryClient = useQueryClient()

	useQuery({
		queryKey: ['secciones', id],
		queryFn: async () => {
			const data = await getSeccionById(id)
			setSeccion(data)
			setNombre(data.nombre)

			return data
		},
	})

	const { mutate: guardarSeccion, isPending } = useMutation({
		mutationFn: async () => {
			if (!seccion) return

			const payload: SeccionUpdatePayload = {
				nombre: nombre || '',
				imagen_background: seccion.imagen_background || false,
				codigo: seccion.codigo || '',
				titulo: seccion.titulo || false,
				subtitulo: seccion.subtitulo || false,
				descripcion: seccion.descripcion || false,
				cta: seccion.cta || false,
				items: seccion.items || 0,
				liked: seccion.liked || false,
				activo: seccion.activo || true,
			}

			// Solo agrega imágenes si hay nuevas
			if (nuevaImagenPrincipal) payload.imagen_principal = nuevaImagenPrincipal
			if (nuevaImagenAmarilla) payload.imagen_amarilla = nuevaImagenAmarilla
			if (nuevaImagenVerde) payload.imagen_verde = nuevaImagenVerde
			if (nuevaImagenRoja) payload.imagen_roja = nuevaImagenRoja

			await updateSeccion(seccion.id, payload)

			//Limpiar las imagenes
			setNuevaImagenPrincipal(undefined)
			setNuevaImagenAmarilla(undefined)
			setNuevaImagenVerde(undefined)
			setNuevaImagenRoja(undefined)
		},
		onSuccess: () => {
			Swal.fire({
				title: 'Sección actualizada',
				icon: 'success',
				showConfirmButton: false,
				timer: 1500,
				timerProgressBar: true,
			}).then(() => {
				//navigate(`/facturas/${data.id}`);
			})
			queryClient.invalidateQueries({ queryKey: ['secciones', id] })
		},
		onError: error => {
			Swal.fire({
				title: 'Error al actualizar la sección',
				text: error.message,
				icon: 'error',
			})
		},
	})

	//Guardar con control + s
	useControlSave(guardarSeccion)

	return (
		<div className=''>
			<div className='header margin-bottom-s'>
				<h1 className='flex-row items-middle flex-wrap gap-2xs'>
					{seccion?.activo == false && <div className='estado-borrado'></div>}
					<TextoEditable texto={nombre} setTexto={setNombre} size={34} />
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

					{/*<div className='panel-blanco'>
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
					</div>*/}

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

						<SidebarCategorias id={seccion?.id} />
					</div>

					<div className='panel-blanco'>
						<div className='titulo'>Opciones</div>

						<SidebarOpciones id={seccion?.id} />
					</div>
				</div>

				<div className='columna-3'>
					<SidebarSeccionIndividual loading={isPending} handleUpdateSeccion={guardarSeccion} />
				</div>
			</div>
		</div>
	)
}
