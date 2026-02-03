import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Pagina } from '@/index'

//Obtener registro por ID
export async function getPaginaById(id: string): Promise<Pagina | undefined> {
	try {
		const record = await pb.collection('paginas').getOne<Pagina>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllPaginas(): Promise<Pagina[] | undefined> {
	try {
		const records = await pb.collection('paginas').getFullList<Pagina>({
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
export async function createPagina(pagina: Partial<Pagina>): Promise<Pagina | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: pagina.nombre,
			proyecto: pagina.proyecto_id,
			plantilla: pagina.nombre,
			orden: pagina.orden || 0,
		}

		const record = await pb.collection('paginas').create<Pagina>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updatePagina(
	id: string,
	pagina: Partial<Pagina>,
): Promise<Pagina | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: pagina.nombre,
			proyecto: pagina.proyecto_id,
			plantilla: pagina.nombre,
			orden: pagina.orden || 0,
		}

		const records = await pb.collection('paginas').update<Pagina>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deletePagina(id: string) {
	try {
		await pb.collection('paginas').delete(id)

		return { success: true, message: 'Pagina eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
