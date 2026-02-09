import type { Proyecto, Pagina, Seccion } from '@/index'
import { create } from 'zustand'

interface ProjectState {
	proyecto: Partial<Proyecto>
	paginas: Pagina[]
	secciones: Seccion[]
	nuevaImagen?: File
	setProyecto: (proyecto: Proyecto) => void
	setPaginas: (paginas: Pagina[]) => void
	setSecciones: (secciones: Seccion[]) => void
	setNuevaImagen: (imagen: File | undefined) => void
}

const nuevoProyecto: Partial<Proyecto> = {
	nombre: 'Nuevo proyecto',
	paginas: [],
}

const useProjectContext = create<ProjectState>(set => ({
	proyecto: nuevoProyecto,
	nuevaImagen: undefined,
	paginas: [],
	secciones: [],
	setProyecto: proyecto =>
		set({
			proyecto,
			//paginas: proyecto.paginas,
		}),
	setPaginas: paginasNuevas => {
		const nuevasPaginas = paginasNuevas ?? []
		set({
			paginas: nuevasPaginas,
		})
	},
	setSecciones: seccionesNuevas => {
		const nuevasPaginas = seccionesNuevas ?? []
		set({
			secciones: nuevasPaginas,
		})
	},
	setNuevaImagen: imagen =>
		set({
			nuevaImagen: imagen,
		}),
}))

export default useProjectContext
