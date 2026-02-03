/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_897896323")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3110085598",
    "hidden": false,
    "id": "relation1049549421",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "pagina",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2207327058",
    "hidden": false,
    "id": "relation3770488265",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "seccion",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_897896323")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3110085598",
    "hidden": false,
    "id": "relation1049549421",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "pagina",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2207327058",
    "hidden": false,
    "id": "relation3770488265",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "seccion",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
