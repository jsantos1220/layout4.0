export type User = {
	user_id: string
	username: string
	email: string
	google_id?: string
	status?: 'active' | 'inactive'
	role?: 'super_admin' | 'system_admin' | 'organization_owner' | 'organization_worker' | 'user'
}

export type Proyecto = {
	id: string
	usuario: string
	cliente?: string
	nombre: string
	imagen?: string
	codigo?: string
	contenido?: string
	activo?: boolean
	created?: string | number
	updated?: string | number
	paginas: Pagina[] | string
}

type ProyectoUpdatePayload = Partial<Omit<Proyecto, 'imagen'>> & {
	imagen?: File | string
}

export interface Pagina {
	id: string
	nombre: string
	proyecto_id?: string
	plantilla_id?: string
	secciones?: Seccion[]
	orden?: number | string
	created: string | number
	updated: string | number
}

export type Seccion = {
	id: string
	nombre: string
	imagen_principal?: string
	imagen_amarilla?: string
	imagen_roja?: string
	imagen_verde?: string
	imagen_background?: boolean
	codigo?: string
	titulo?: boolean
	subtitulo?: boolean
	descripcion?: boolean
	cta?: boolean
	items?: number
	liked?: boolean
	categorias?: Categoria[]
	opciones?: Opcion[]
	draggable_id?: string
	activo?: boolean
	created?: string | number
	updated?: string | number
}

type SeccionUpdatePayload = Partial<
	Omit<Seccion, 'imagen_principal' | 'imagen_amarilla' | 'imagen_verde' | 'imagen_roja'>
> & {
	imagen_principal?: File | string
	imagen_amarilla?: File | string
	imagen_verde?: File | string
	imagen_roja?: File | string
}

export type Categoria = {
	id: string
	nombre: string
	created?: number | string
	updated?: string
}

export type Opcion = {
	id: string
	nombre: string
	created?: number | string
	updated?: string
}

export type Cliente = {
	id: string
	nombre: string
	logo_color?: string
	logo_blanco?: string
	logo_footer?: string
	nombre_marca?: string
	eslogan?: string
	colores?: string
	telefonos?: string
	correos?: string
	direccion?: string
	mapa?: string
	redes_sociales?: string
	created?: string
	updated?: string
}

export type Plantilla = {
	id: string
	user_id: string
	nombre: string
	paginas?: string
	imagen?: string
	created?: string
	updated?: string
}

export type Categorias_secciones = {
	id: string
	categoria: string
	seccion: string
	usuario: string
	expand?: {
		categoria?: Categoria
		seccion?: Seccion
	}
	created: string
	updated: string
}

export type Opciones_secciones = {
	id: string
	opcion: string
	seccion: string
	usuario: string
	expand?: {
		opcion?: Opcion
		seccion?: Seccion
	}
	created: string
	updated: string
}

export type Paginas_secciones = {
	id: string
	pagina: string
	seccion: string
	usuario: string
	expand?: {
		pagina?: Pagina
		seccion?: Seccion
	}
	created: string
	updated: string
}

export type Bricks = {
	nombre?: string
	content: BricksContent[]
	source: string
	sourceUrl: string
	globalClasses: GlobalClasses[]
}

export type BricksContent = {
	id: string
	name: string
	parent: number
}

export type GlobalClasses = {
	id: string
	name: string
	settings: []
	modified: number
	user_id: number
	_exists: number
}
