/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3455578297")

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text674454580",
    "max": 500000,
    "min": 0,
    "name": "paginas",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3455578297")

  // update field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text674454580",
    "max": 0,
    "min": 0,
    "name": "paginas",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
