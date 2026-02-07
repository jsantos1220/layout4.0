routerAdd('POST', '/api/update-opciones-seccion', c => {
	if (!c.auth) return c.json(401, { error: 'No autorizado' })
	const userId = c.auth.id

	const raw = toString(c.request.body)
	const body = JSON.parse(raw)

	const seccionId = body.id
	const opcionesEnviadas = body.opciones

	if (!seccionId || !Array.isArray(opcionesEnviadas)) {
		return c.json(400, { error: 'Datos inválidos' })
	}

	$app.runInTransaction(txDao => {
		// 1. Obtener las categorias_secciones actuales
		const records = txDao.findRecordsByFilter(
			'opciones_secciones',
			'seccion = {:seccion}',
			'-created',
			0,
			0,
			{ seccion: seccionId },
		)

		//console.log(toString(records))

		//Lista de los ids de las categorias que ya están
		const idsOpcionesActuales = records.map(r => r.get('opcion'))

		//Listado de las categorias enviadas
		const idsOpcionesEnviadas = opcionesEnviadas.map(c => c.id)

		const aInsertar = idsOpcionesEnviadas.filter(id => !idsOpcionesActuales.includes(id))
		const aEliminar = idsOpcionesActuales.filter(id => !idsOpcionesEnviadas.includes(id))

		// 3. Insertar
		for (const opcionId of aInsertar) {
			const record = new Record(txDao.findCollectionByNameOrId('opciones_secciones'))
			record.set('opcion', opcionId)
			record.set('seccion', seccionId)
			record.set('usuario', userId)
			txDao.save(record)
		}

		// 4. Eliminar
		for (const record of records) {
			if (aEliminar.includes(record.get('opcion'))) {
				txDao.delete(record)
			}
		}

		return c.json(200, {
			inserted: aInsertar.length,
			deleted: aEliminar.length,
		})
	})
})
