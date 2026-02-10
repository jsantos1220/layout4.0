import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Opciones_secciones } from '@/index'

//Obtener registro por ID
export async function getOpcionSeccionById(id: string): Promise<Opciones_secciones | undefined> {
	try {
		const record = await pb.collection('opciones_secciones').getOne<Opciones_secciones>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllOpcionesSeccionesById(
	id: string,
): Promise<Opciones_secciones[] | undefined> {
	try {
		const records = await pb.collection('opciones_secciones').getFullList<Opciones_secciones>({
			//sort: 'created',
			filter: `seccion = '${id}'`,
			expand: 'opcion',
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

//Obtener todos los registros
export async function getAllOpcionesSecciones(): Promise<Opciones_secciones[] | undefined> {
	try {
		const records = await pb.collection('opciones_secciones').getFullList<Opciones_secciones>({
			//sort: 'created',
			//filter: 'en_papelera != true',
			//TODO: esto hay que limitarlo si lo va a usar mas gente
			//fields:
			//	'id, comprobante, cliente, fecha, total, termino_pago, estatus, en_papelera, created',
			expand: 'opcion',
		})

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Crear nueva registro
export async function createOpcionSeccion(
	opcion: string,
	seccion: string,
): Promise<Opciones_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			opcion,
			seccion,
		}

		const record = await pb.collection('opciones_secciones').create<Opciones_secciones>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateOpcionSeccion(
	id: string,
	opcion: string,
	seccion: string,
): Promise<Opciones_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			opcion,
			seccion,
		}

		const records = await pb.collection('opciones_secciones').update<Opciones_secciones>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteOpcionSeccion(id: string) {
	try {
		await pb.collection('opciones_secciones').delete(id)

		return { success: true, message: 'Categoria seccion eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
