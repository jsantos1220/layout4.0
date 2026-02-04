/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2207327058")

  // remove field
  collection.fields.removeById("editor2468783808")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2207327058")

  // add field
  collection.fields.addAt(16, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor2468783808",
    "maxSize": 0,
    "name": "codigo2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
})
