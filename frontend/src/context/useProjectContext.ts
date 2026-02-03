import type { Proyecto, Pagina } from '@/index'
import { create } from 'zustand'

interface ProjectState {
	proyecto: Partial<Proyecto>
	paginas: Pagina[]
	nuevaImagen?: File
	setProyecto: (proyecto: Proyecto) => void
	setPaginas: (paginas: Pagina[]) => void
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
	setProyecto: proyecto =>
		set({
			proyecto,
			//paginas: proyecto.paginas,
		}),
	setPaginas: paginasN => {
		const nuevasPaginas = paginasN ?? []
		set({
			paginas: nuevasPaginas,
		})
	},
	setNuevaImagen: imagen =>
		set({
			nuevaImagen: imagen,
		}),
}))

export default useProjectContext
