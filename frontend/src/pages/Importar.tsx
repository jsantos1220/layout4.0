import { useState } from 'react'
import styled from 'styled-components'
import Papa from 'papaparse'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import { createfullSeccion, getSeccionByName, updateSeccion } from '../api/crudSecciones'
import { SeccionUpdatePayload } from '@/index'
import { createCategoria, getCategoriaByName } from '../api/crudCategorias'
import { createOpcion, getOpcionByName } from '../api/crudOpciones'
import { createCategoriaSeccion, getCategoriaSeccionByNames } from '../api/crudCategoriaSecciones'
import { createOpcionSeccion, getOpcionesSeccionByNames } from '../api/crudOpcionesSecciones'
const notyf = new Notyf()

export default function Importar() {
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState(0)

	const toBoolean = value => value === 'TRUE'

	const handleFile = e => {
		const file = e.target.files[0]
		if (!file) return

		setLoading(true)

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async results => {
				const rows = results.data

				console.log(rows)

				try {
					for (let i = 0; i < rows.length; i++) {
						const row = rows[i]

						const imagen = row.Imagen
						const nombre = row.Nombre
						const categorias = row.Categorías
						const opciones = row.Opciones
						const codigo = row.Código
						const descripcion = toBoolean(row.Descripción)
						const titulo = toBoolean(row.Título)
						const subtitulo = toBoolean(row.Subtítulo)
						const cta = toBoolean(row.CTA)
						const background = toBoolean(row.Background)
						const items = row.Items

						const imgUrl = new URL(`../../../imagenes/${imagen}`, import.meta.url).href
						const imagenFile = await fetch(imgUrl)
						const imageBlob = await imagenFile.blob()
						const imageFile = new File([imageBlob], row.Imagen)

						let seccion = await getSeccionByName(nombre)

						let categoriasLimpias = categorias.split(',').map(c => c.trim())
						let opcionesLimpias = opciones.split(',').map(c => c.trim())

						//return

						//Esto pasa si la seccion existe
						if (seccion) {
							const payload: SeccionUpdatePayload = {
								nombre: nombre || '',
								imagen_background: background || false,
								codigo: codigo || '',
								titulo: titulo || false,
								subtitulo: subtitulo || false,
								descripcion: descripcion || false,
								cta: cta || false,
								items: items || 0,
								liked: false,
								activo: true,
							}

							// Solo agrega imágenes si hay nuevas
							if (imageFile) payload.imagen_principal = imageFile

							await updateSeccion(seccion.id, payload)
							console.log('Se actualizo la sección: ' + nombre)
						}

						//Si es una seccion nueva
						if (!seccion) {
							const payload: SeccionUpdatePayload = {
								nombre: nombre || '',
								imagen_background: background || false,
								codigo: codigo || '',
								titulo: titulo || false,
								subtitulo: subtitulo || false,
								descripcion: descripcion || false,
								cta: cta || false,
								items: items || 0,
								liked: false,
								activo: true,
							}

							// Solo agrega imágenes si hay nuevas
							if (imageFile) payload.imagen_principal = imageFile

							seccion = await createfullSeccion(payload)
							console.log('Se creó la sección: ' + nombre)
						}

						//Verificar una por una si existen
						categoriasLimpias.forEach(async (cat: string) => {
							const categoria = await getCategoriaByName(cat)

							if (categoria) {
								//buscar si existe la unión seccion_categoria
								const seccionCategoria = await getCategoriaSeccionByNames(
									categoria.id,
									seccion.id,
								)

								if (!seccionCategoria) {
									await createCategoriaSeccion(categoria.id, seccion.id)
									console.log('Se creo la unión entre categoria y sección')
								}
							} else {
								//Crear la categoria
								await createCategoria(cat)
								console.log('Se creo la categoría ' + cat)
								//Crear la unión entre categoria y seccion
								await createCategoriaSeccion(categoria.id, seccion.id)
								console.log('Se creo la unión ' + cat + ' ' + seccion.nombre)
							}
						})

						//Verificar una por una si existen
						opcionesLimpias.forEach(async (opc: string) => {
							const opcion = await getOpcionByName(opc)

							if (opcion) {
								const seccionOpcion = await getOpcionesSeccionByNames(opcion.id, seccion.id)

								if (!seccionOpcion) {
									await createOpcionSeccion(opcion.id, seccion.id)
									console.log('Se creo la unión entre categoria y sección')
								}
							} else {
								//Crear la opción si no existe
								await createOpcion(opc)
								console.log('Se creo la opción ' + opc)
								//Crear la unión entre categoria y seccion
								await createOpcionSeccion(opcion.id, seccion.id)
								console.log('Se creo la unión ' + opc + ' ' + seccion.nombre)
							}
						})

						//return

						setProgress(Math.round(((i + 1) / rows.length) * 100))
					}

					notyf.success('Importación completada')
				} catch (error) {
					console.error(error)
					notyf.error('Error durante la importación')
				}

				setLoading(false)
			},
			error: err => {
				console.error(err)
				notyf.error('Error leyendo el CSV')
				setLoading(false)
			},
		})
	}

	return (
		<Container>
			<h2>Importar CSV</h2>

			<input type='file' accept='.csv' onChange={handleFile} disabled={loading} />

			{loading && (
				<div style={{ marginTop: 10 }}>
					<p>Importando... {progress}%</p>
					<progress value={progress} max='100' />
				</div>
			)}
		</Container>
	)
}

const Container = styled.div`
	padding: 20px;
`
