define(function(require) {

  var remoteStorageDocuments = require('remotestorage-documents');

  remoteStorage.claimAccess('documents', 'rw');

  var documents = remoteStorageDocuments.getPrivateList('notes');

  function find(model) {
    return documents.getContent(model.id);
  }

  function findAll() {
    var ids = documents.getIds();
    var resp = [];
    for (var i = ids.length - 1; i >= 0; i--) {
      resp.push(documents.getContent(ids[i]));
    }
    return resp;
  }

  function create(model) {
    model.set(model.idAttribute, documents.add(model.toJSON()));
    return model;
  }

  function update(model) {
    documents.setContent(model.id, model.toJSON());
    return model;
  }

  function destroy(model) {
    documents.setContent(model.id, '');
    return model;
  }

  function sync(method, model, options) {
    var resp;

    switch (method) {
      case "read":    resp = model.id !== undefined ? find(model) : findAll(); break;
      case "create":  resp = create(model);                            break;
      case "update":  resp = update(model);                            break;
      case "delete":  resp = destroy(model);                           break;
    }

    if (resp) {
      options.success(resp);
    } else {
      options.error("Record not found");
    }
  }


  return sync;
});
