import Dialogs from '@components/editor/Diablogs'
import {
	CodeXml,
	Image,
	LoaderPinwheel,
	Save,
	SaveAll,
	Trash2,
	Type,
	UserRound,
} from 'lucide-react'
import { JSX, useState } from 'react'
import PopupTextos from './PopupTextos'
import PopupImagen from './PopupImagen'
import PopupCliente from './PopupCliente'
import useProjectContext from '@context/useProjectContext'
import jsonToObject from '@utils/jsonToObject'
import { Bricks, BricksContent, GlobalClasses } from '@/index'
import { useNavigate, useParams } from 'react-router'
import Fetch from '@utils/Fetch'

type SidebarControllersType = {
	loading: boolean
	handleUpdateProyecto: () => void
}

export default function SidebarControllers({
	loading,
	handleUpdateProyecto,
}: SidebarControllersType) {
	const { proyecto, paginas, secciones } = useProjectContext()
	const [content, setContent] = useState<JSX.Element | null>(null)
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { proyecto_id } = useParams()

	function handleClickOpen(contenido: JSX.Element | null) {
		setContent(contenido)
		setOpen(true)
	}

	function handleClose() {
		setOpen(false)
	}

	function handleCodeDownload() {
		//Hacer un arregle de los codigos por pagina
		const paginasDeBricks = paginas.map(pagina => {
			let content: BricksContent[] = []
			let globalClasses: GlobalClasses[] = []
			let idsSecciones = []

			//Saca los ids de las secciones por pagina
			pagina.secciones?.forEach(seccion => {
				idsSecciones.push(seccion.id)
			})

			//Saca los codigos de cada sección como objetos
			const codigos = idsSecciones.map(id => {
				const seccionEspecifica = secciones.filter(seccion => seccion.id == id)
				const codigo = seccionEspecifica[0]?.codigo
				return jsonToObject(codigo)
			})

			codigos?.forEach(codigo => {
				//Verificar si la pagina no esta si secciones
				if (!codigo) return

				codigo?.content?.forEach(cont => {
					content.push(cont)
				})
				codigo?.globalClasses.forEach(cont => {
					globalClasses.push(cont)
				})
			})

			const nuevaPagina: Bricks = {
				nombre: pagina.nombre,
				content,
				source: 'bricksCopiedElements',
				sourceUrl: 'http://localhost:10267',
				globalClasses,
			}

			return nuevaPagina
		})

		//Esto es para hacer la descarga
		paginasDeBricks.forEach(pagina => {
			const contenido = JSON.stringify(pagina, null, 2)
			const blob = new Blob([contenido], { type: 'application/json' })
			const url = URL.createObjectURL(blob)

			const a = document.createElement('a')
			a.href = url
			a.download = `${pagina.nombre}.json` // nombre del archivo
			a.click()

			// Limpieza del objeto URL
			URL.revokeObjectURL(url)
		})
	}

	function handleFigmaFile() {
		const figmaFile = {
			frames: paginas.map(pagina => {
				return {
					name: pagina.nombre,
					sections: pagina.secciones?.map(seccion => {
						return {
							name: 'Seccion: ' + seccion.nombre,
						}
					}),
				}
			}),
		}

		const contenido = JSON.stringify(figmaFile, null, 2)
		const blob = new Blob([contenido], { type: 'application/json' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = `${proyecto.nombre}.json`
		a.click()

		// Limpieza del objeto URL
		URL.revokeObjectURL(url)
	}

	async function handleSemiDelete() {
		if (!proyecto || !proyecto_id) return

		const formData = new FormData()
		formData.set('proyecto_id', proyecto_id)
		formData.set('activo', '0')

		try {
			const query = await Fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/projects/update`,
				{
					method: 'POST', // o 'PUT' según tu API
					body: formData,
				},
				true,
			)
			const response = await query.json()
			console.log(response)

			if (!query.ok) throw new Error('No se pudo borrar')

			navigate('/proyectos/')
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<div className='controllers'>
				<div className='container-controllers '>
					<button disabled={loading ? true : false} onClick={() => handleUpdateProyecto()}>
						{loading ? <LoaderPinwheel className='spinner' /> : <Save />}
						{loading ? 'Enviando' : 'Guardar'}
					</button>
				</div>

				<div className='container-controllers'>
					<button onClick={handleCodeDownload}>
						<CodeXml />
						Código
					</button>
				</div>

				<div className='container-controllers'>
					<button onClick={() => handleClickOpen(<PopupTextos />)}>
						<Type />
						Textos
					</button>

					<button onClick={() => handleClickOpen(<PopupImagen />)}>
						<Image />
						Imagen
					</button>

					<button onClick={handleFigmaFile}>
						<img src='../../../images/sidebar-figma.svg' alt='' />
						Figma
					</button>
				</div>

				<div className='container-controllers'>
					<button onClick={() => handleClickOpen(<PopupCliente />)}>
						<UserRound />
						Cliente
					</button>
				</div>

				<div className='container-controllers'>
					<button>
						<SaveAll />
						Guardar como plantilla
					</button>
				</div>

				<div className='container-controllers'>
					<button onClick={handleSemiDelete}>
						<Trash2 />
						Borrar
					</button>
				</div>
			</div>

			<Dialogs open={open} handleClose={handleClose} content={content} />
		</>
	)
}
