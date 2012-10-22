
define(['backbone'], function(Backbone) {

  Backbone.sync = function(method, model, options) {

    var resp;
    var store = model.storeBackend || (
      model.collection ? model.collection.storeBackend : null
    );

    if(! store) {
      options.error("No store defined for this model!");
      return;
    }

    switch (method) {
      case "read":    resp = model.id !== undefined ? store.find(model) : store.findAll(); break;
      case "create":  resp = store.create(model);                            break;
      case "update":  resp = store.update(model);                            break;
      case "delete":  resp = store.destroy(model);                           break;
    }

    if (resp) {
      options.success(resp);
    } else {
      options.error("Record not found");
    }
  };

});