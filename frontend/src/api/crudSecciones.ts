import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Seccion } from '@/index'

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
export async function createSeccion(seccion: Partial<Seccion>): Promise<Seccion | undefined> {
	const user = useAuthStore.getState().user

	try {
		const data = {
			usuario: user.id,
			nombre: seccion.nombre || '',
			imagen_principal: seccion.imagen_principal || '',
			imagen_amarilla: seccion.imagen_amarilla || '',
			imagen_roja: seccion.imagen_roja || '',
			imagen_verde: seccion.imagen_verde || '',
			imagen_background: seccion.imagen_background || false,
			codigo: seccion.codigo || '',
			liked: seccion.liked || false,
			titulo: seccion.titulo || false,
			subtitulo: seccion.subtitulo || false,
			descripcion: seccion.descripcion || false,
			cta: seccion.cta || false,
			items: seccion.items || 0,
			activo: seccion.activo || true,
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
	seccion: Partial<Seccion>,
): Promise<Seccion | undefined> {
	try {
		const formData = new FormData()

		// Campos normales
		if (seccion.nombre !== undefined) formData.append('nombre', seccion.nombre)
		if (seccion.codigo !== undefined) formData.append('codigo', seccion.codigo)
		if (seccion.liked !== undefined) formData.append('liked', String(seccion.liked))
		if (seccion.activo !== undefined) formData.append('activo', String(seccion.activo))
		if (seccion.imagen_background)
			formData.append('imagen_background', String(seccion.imagen_background))

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
