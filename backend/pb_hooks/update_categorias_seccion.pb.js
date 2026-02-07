routerAdd('POST', '/api/update-categorias-seccion', c => {
	if (!c.auth) return c.json(401, { error: 'No autorizado' })
	const userId = c.auth.id

	const raw = toString(c.request.body)
	const body = JSON.parse(raw)

	const seccionId = body.id
	const categoriasEnviadas = body.categorias

	if (!seccionId || !Array.isArray(categoriasEnviadas)) {
		return c.json(400, { error: 'Datos inválidos' })
	}

	$app.runInTransaction(txDao => {
		// 1. Obtener las categorias_secciones actuales
		const records = txDao.findRecordsByFilter(
			'categorias_secciones',
			'seccion = {:seccion}',
			'-created',
			0,
			0,
			{ seccion: seccionId },
		)

		//console.log(toString(records))

		//Lista de los ids de las categorias que ya están
		const idsCategoriasActuales = records.map(r => r.get('categoria'))

		//Listado de las categorias enviadas
		const idsCategoriasEnviadas = categoriasEnviadas.map(c => c.id)

		const aInsertar = idsCategoriasEnviadas.filter(id => !idsCategoriasActuales.includes(id))
		const aEliminar = idsCategoriasActuales.filter(id => !idsCategoriasEnviadas.includes(id))

		// 3. Insertar
		for (const categoriaId of aInsertar) {
			const record = new Record(txDao.findCollectionByNameOrId('categorias_secciones'))
			record.set('categoria', categoriaId)
			record.set('seccion', seccionId)
			record.set('usuario', userId)
			txDao.save(record)
		}

		// 4. Eliminar
		for (const record of records) {
			if (aEliminar.includes(record.get('categoria'))) {
				txDao.delete(record)
			}
		}

		return c.json(200, {
			inserted: aInsertar.length,
			deleted: aEliminar.length,
		})
	})
})
