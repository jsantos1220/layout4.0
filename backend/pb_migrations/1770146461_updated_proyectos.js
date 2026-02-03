/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3455578297")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = usuario.id",
    "deleteRule": "@request.auth.id = usuario.id",
    "listRule": "@request.auth.id = usuario.id",
    "updateRule": "@request.auth.id = usuario.id",
    "viewRule": "@request.auth.id = usuario.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3455578297")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
