import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Proyecto, ProyectoUpdatePayload } from '@/index'

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
export async function createProyecto(): Promise<Proyecto | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: 'Nuevo proyecto',
			activo: true,
		}

		const record = await pb.collection('proyectos').create<Proyecto>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateProyecto(
	id: string,
	proyecto: ProyectoUpdatePayload,
): Promise<Proyecto | undefined> {
	try {
		const formData = new FormData()

		// Campos normales
		formData.append('nombre', proyecto.nombre)
		formData.append('codigo', proyecto.codigo)
		formData.append('cliente', String(proyecto.cliente))
		formData.append('activo', String(proyecto.activo))
		formData.append('codigo', String(proyecto.codigo))
		formData.append('contenido', String(proyecto.contenido))
		formData.append('paginas', String(proyecto.paginas))

		if (proyecto.imagen) formData.append('imagen', proyecto.imagen)

		const records = await pb.collection('proyectos').update<Proyecto>(id, formData)

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteProyecto(id: string) {
	try {
		await pb.collection('proyectos').delete(id)

		return { success: true, message: 'Pagina eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
