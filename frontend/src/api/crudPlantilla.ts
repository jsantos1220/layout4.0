import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Plantilla } from '@/index'

//Obtener registro por ID
export async function getPlantillaById(id: string): Promise<Plantilla | undefined> {
	try {
		const record = await pb.collection('plantillas').getOne<Plantilla>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllPlantillas(): Promise<Plantilla[] | undefined> {
	try {
		const records = await pb.collection('plantillas').getFullList<Plantilla>({
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
export async function createPlantilla(
	plantilla: Partial<Plantilla>,
): Promise<Plantilla | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: plantilla.nombre,
			paginas: plantilla.paginas || '',
			imagen: plantilla.imagen || [],
		}

		const record = await pb.collection('plantillas').create<Plantilla>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updatePlantilla(
	id: string,
	plantilla: Partial<Plantilla>,
): Promise<Plantilla | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: plantilla.nombre,
			paginas: plantilla.paginas || '',
			imagen: plantilla.imagen || [],
		}

		const records = await pb.collection('plantillas').update<Plantilla>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deletePlantilla(id: string) {
	try {
		await pb.collection('plantillas').delete(id)

		return { success: true, message: 'Plantilla eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
