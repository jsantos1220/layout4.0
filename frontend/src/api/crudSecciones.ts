import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Seccion, SeccionUpdatePayload } from '@/index'

//Obtener registro por ID
export async function getSeccionById(id: string): Promise<Seccion | undefined> {
	try {
		const record = await pb.collection('secciones').getOne<Seccion>(id)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Obtener todos los registros
export async function getAllSecciones(): Promise<Seccion[] | undefined> {
	try {
		const records = await pb.collection('secciones').getFullList<Seccion>({
			//sort: 'created',
			//filter: 'en_papelera != true',
			//TODO: esto hay que limitarlo si lo va a usar mas gente
			fields:
				'id, imagen_principal, nombre, updated, usuario, activo, collectionName, collectionId, created',
		})

		return records
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Crear nueva registro
export async function createSeccion(): Promise<Seccion | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: 'Nueva sección',
			imagen_principal: '',
			imagen_amarilla: '',
			imagen_roja: '',
			imagen_verde: '',
			imagen_background: false,
			codigo: '',
			liked: false,
			titulo: false,
			subtitulo: false,
			descripcion: false,
			cta: false,
			items: 0,
			activo: true,
		}

		const record = await pb.collection('secciones').create<Seccion>(data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID
export async function updateSeccion(
	id: string,
	seccion: SeccionUpdatePayload,
): Promise<Seccion | undefined> {
	try {
		const formData = new FormData()

		// Campos normales
		formData.append('nombre', seccion.nombre)
		formData.append('codigo', seccion.codigo)
		formData.append('liked', String(seccion.liked))
		formData.append('imagen_background', String(seccion.imagen_background))
		formData.append('titulo', String(seccion.titulo))
		formData.append('subtitulo', String(seccion.subtitulo))
		formData.append('descripcion', String(seccion.descripcion))
		formData.append('cta', String(seccion.cta))
		formData.append('items', String(seccion.items))
		formData.append('liked', String(seccion.liked))
		formData.append('activo', String(seccion.activo))

		// Imágenes (SOLO si existen)
		if (seccion.imagen_principal) formData.append('imagen_principal', seccion.imagen_principal)
		if (seccion.imagen_amarilla) formData.append('imagen_amarilla', seccion.imagen_amarilla)
		if (seccion.imagen_roja) formData.append('imagen_roja', seccion.imagen_roja)
		if (seccion.imagen_verde) formData.append('imagen_verde', seccion.imagen_verde)

		const record = await pb.collection('secciones').update<Seccion>(id, formData)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID (poner el "activo" en false)
export async function deactivateSeccion(id: string): Promise<Seccion | undefined> {
	try {
		const data = {
			activo: false,
		}

		const record = await pb.collection('secciones').update<Seccion>(id, data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Actualizar registro por ID (poner el "activo" en true)
export async function activateSeccion(id: string): Promise<Seccion | undefined> {
	try {
		const data = {
			activo: true,
		}

		const record = await pb.collection('secciones').update<Seccion>(id, data)

		return record
	} catch (error) {
		//console.log(error)
		throw error
	}
}

//Eliminar registro por ID
export async function deleteSeccion(id: string) {
	try {
		await pb.collection('secciones').delete(id)

		return { success: true, message: 'Sección eliminada correctamente' }
	} catch (error) {
		//console.log(error)
		throw error
	}
}
