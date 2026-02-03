import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Proyecto } from '@/index'

//Obtener registro por ID
export async function getProyectoById(id: string): Promise<Proyecto | undefined> {
	try {
		const record = await pb.collection('proyectos').getOne<Proyecto>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllProyectos(): Promise<Proyecto[] | undefined> {
	try {
		const records = await pb.collection('proyectos').getFullList<Proyecto>({
			//sort: 'created',
			//filter: 'en_papelera != true',
			//TODO: esto hay que limitarlo si lo va a usar mas gente
			//fields:
			//	'id, comprobante, cliente, fecha, total, termino_pago, estatus, en_papelera, created',
		})

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Crear nueva registro
export async function createProyecto(proyecto: Partial<Proyecto>): Promise<Proyecto | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: proyecto.nombre || '',
			codigo: proyecto.codigo || '',
			paginas: proyecto.paginas || '',
			imagen: proyecto.imagen || '',
			contenido: proyecto.contenido || '',
			activo: proyecto.activo || true,
		}

		const record = await pb.collection('proyectos').create<Proyecto>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updatePagina(
	id: string,
	proyecto: Partial<Proyecto>,
): Promise<Proyecto | undefined> {
	try {
		const data = {
			nombre: proyecto.nombre || '',
			codigo: proyecto.codigo || '',
			paginas: proyecto.paginas || '',
			imagen: proyecto.imagen || '',
			contenido: proyecto.contenido || '',
			activo: proyecto.activo || true,
		}

		const records = await pb.collection('proyectos').update<Proyecto>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deletePagina(id: string) {
	try {
		await pb.collection('proyectos').delete(id)

		return { success: true, message: 'Pagina eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
