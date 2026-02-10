import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Opcion } from '@/index'

//Obtener registro por ID
export async function getOpcionById(id: string): Promise<Opcion | undefined> {
	try {
		const record = await pb.collection('opciones').getOne<Opcion>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllOpciones(): Promise<Opcion[] | undefined> {
	try {
		const records = await pb.collection('opciones').getFullList<Opcion>({
			sort: '-created',
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
export async function createOpcion(nombre: string): Promise<Opcion | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre,
		}

		const record = await pb.collection('opciones').create<Opcion>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateOpcion(id: string, nombre: string): Promise<Opcion | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre,
		}

		const records = await pb.collection('opciones').update<Opcion>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteOpcion(id: string) {
	try {
		await pb.collection('opciones').delete(id)

		return { success: true, message: 'Opcion eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
