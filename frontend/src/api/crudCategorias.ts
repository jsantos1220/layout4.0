import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Categoria } from '@/index'

//Obtener registro por ID
export async function getCategoriaById(id: string): Promise<Categoria | undefined> {
	try {
		const record = await pb.collection('categorias').getOne<Categoria>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllCategorias(): Promise<Categoria[] | undefined> {
	try {
		const records = await pb.collection('categorias').getFullList<Categoria>({
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

//Crear nuevo registro
export async function createCategoria(nombre: string): Promise<Categoria | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre,
		}

		const record = await pb.collection('categorias').create<Categoria>(data)

		return record
	} catch (error) {
		console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateCategoria(id: string, nombre: string): Promise<Categoria | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre,
		}

		const records = await pb.collection('categorias').update<Categoria>(id, data)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteCategoria(id: string) {
	try {
		await pb.collection('categorias').delete(id)

		return { success: true, message: 'Categoría eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
