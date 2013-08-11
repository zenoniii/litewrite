define(function(require) {

  var remoteStorage = require('remotestorage');


  //
  // Documents
  //
  // This is a simple implementation of the document module
  // that just stores a list of documents
  // where a document only has title, content and lastEdited fields
  //

  RemoteStorage.defineModule('documents', function(privateClient, publicClient) {


    privateClient.declareType('text', {
      "description": "A simple text document",
      "type":        "object",
      "$schema":     "http://json-schema.org/draft-03/schema#",
      "properties": {
          "title":      { "type": "string",  "required": true },
          "content":    { "type": "string",  "required": true },
          "lastEdited": { "type": "integer", "required": true }
      }
    });


    var listMethods = {

      add: function(doc) {
        var id = privateClient.uuid();
        return listMethods.set(id, doc)
          .then(function() { return id; });
      },

      set: function(id, doc) {
        return this.storeObject('text', id, doc);
      },

      get: function(id) {
        return this.getObject(id).then(function(obj) {
          return obj || {};
        });
      }

    };



    var documentsModule = {

      init: function() {
        privateClient.cache('', false);
      },

      privateList: function(name) {
        return privateClient.scope(name + '/').extend(listMethods).cache();
      },

      publicList: function(name) {
        return publicClient.scope(name + '/').extend(listMethods).cache();
      }

    };


    return { exports: documentsModule };

  });



  return remoteStorage['documents'];

});
