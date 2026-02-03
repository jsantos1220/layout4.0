export type User = {
	user_id: string
	username: string
	email: string
	google_id?: string
	status?: 'active' | 'inactive'
	role?:
		| 'super_admin'
		| 'system_admin'
		| 'organization_owner'
		| 'organization_worker'
		| 'user'
}

export type Proyecto = {
	proyecto_id: string
	user_id: string
	cliente_id?: string
	nombre: string
	imagen?: string
	codigo?: string
	contenido?: string
	activo?: string
	created_at?: string | number
	updated_at?: string | number
	paginas: Pagina[]
}

export interface Pagina {
	pagina_id: string
	nombre: string
	proyecto_id?: string
	plantilla_id?: string
	secciones?: Seccion[]
	orden?: number | string
	created_at: string | number
	updated_at: string | number
}

export type Seccion = {
	seccion_id: string
	nombre: string
	imagen_principal?: string
	imagen_amarilla?: string
	imagen_roja?: string
	imagen_verde?: string
	imagen_background?: number
	codigo?: string
	titulo?: number
	subtitulo?: number
	descripcion?: number
	cta?: number
	items?: number
	categorias?: Categoria[]
	opciones?: Opcion[]
	draggable_id?: string
	activo?: string
	created_at?: string | number
	updated_at?: string | number
}

export type Categoria = {
	categoria_id: string
	nombre: string
	created_at?: number | string
	updated_at?: string
}

export type Opcion = {
	opcion_id: string
	nombre: string
	created_at?: number | string
	updated_at?: string
}

export type Cliente = {
	cliente_id: string
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
	created_at?: string
	updated_at?: string
}

export type Plantilla = {
	plantilla_id: string
	user_id: string
	nombre: string
	imagen?: string
	created_at?: string
	updated_at?: string
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
