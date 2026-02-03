import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Paginas_secciones } from '@/index'

//Obtener registro por ID
export async function getPaginaSeccionById(id: string): Promise<Paginas_secciones | undefined> {
	try {
		const record = await pb.collection('paginas_secciones').getOne<Paginas_secciones>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllPaginasSecciones(): Promise<Paginas_secciones[] | undefined> {
	try {
		const records = await pb.collection('paginas_secciones').getFullList<Paginas_secciones>({
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
export async function createPaginaSeccion(
	pagina: string,
	seccion: string,
): Promise<Paginas_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			pagina,
			seccion,
		}

		const record = await pb.collection('paginas_secciones').create<Paginas_secciones>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updatePaginaSeccion(
	id: string,
	pagina: string,
	seccion: string,
): Promise<Paginas_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			pagina,
			seccion,
		}

		const records = await pb.collection('paginas_secciones').update<Paginas_secciones>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deletePaginaSeccion(id: string) {
	try {
		await pb.collection('paginas_secciones').delete(id)

		return { success: true, message: 'Pagina_seccion eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
