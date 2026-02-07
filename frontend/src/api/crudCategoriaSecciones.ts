import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Categorias_secciones } from '@/index'

//Obtener registro por ID
export async function getCategoriaSeccionById(
	id: string,
): Promise<Categorias_secciones | undefined> {
	try {
		const record = await pb.collection('categorias_secciones').getOne<Categorias_secciones>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllCategoriaSeccionesById(
	id: string,
): Promise<Categorias_secciones[] | undefined> {
	try {
		const records = await pb
			.collection('categorias_secciones')
			.getFullList<Categorias_secciones>({
				//sort: 'created',
				filter: `seccion = '${id}'`,
				expand: 'categoria',
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
export async function getAllCategoriaSecciones(): Promise<Categorias_secciones[] | undefined> {
	try {
		const records = await pb
			.collection('categorias_secciones')
			.getFullList<Categorias_secciones>({
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
export async function createCategoriaSeccion(
	categoria: string,
	seccion: string,
): Promise<Categorias_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			categoria,
			seccion,
		}

		const record = await pb.collection('categorias_secciones').create<Categorias_secciones>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateCategoriaSeccion(
	id: string,
	categoria: string,
	seccion: string,
): Promise<Categorias_secciones | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			categoria,
			seccion,
		}

		const records = await pb
			.collection('categorias_secciones')
			.update<Categorias_secciones>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteCategoriaSeccion(id: string) {
	try {
		await pb.collection('categorias_secciones').delete(id)

		return { success: true, message: 'Categoria seccion eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
