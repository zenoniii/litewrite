

define(function(require) {

  // this actually defines remoteStorage globally.
  require('remotestorage');

  var moduleName = 'documents';

  remoteStorage.defineModule(moduleName, function(myBaseClient) {
    var errorHandlers=[];
    function fire(eventType, eventObj) {
      if(eventType == 'error') {
        for(var i=0; i<errorHandlers.length; i++) {
          errorHandlers[i](eventObj);
        }
      }
    }
    function getUuid() {
      var uuid = '',
      i,
      random;

      for ( i = 0; i < 32; i++ ) {
        random = Math.random() * 16 | 0;
        if ( i === 8 || i === 12 || i === 16 || i === 20 ) {
          uuid += '-';
        }
        uuid += ( i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random) ).toString( 16 );
      }
      return uuid;
    }
    function getPrivateList(listName) {
      myBaseClient.sync(listName+'/');
      function getIds() {
        return myBaseClient.getListing(listName+'/');
      }
      function getContent(id) {
        var obj = myBaseClient.getObject(listName+'/'+id);
        if(obj) {
          return obj.content;
        } else {
          return '';
        }
      }
      function getTitle(id) {
        return getContent(id).slice(0, 50);
      }
      function setContent(id, content) {
        if(content == '') {
          myBaseClient.remove(listName+'/'+id);
        } else {
          myBaseClient.storeObject('text', listName+'/'+id, {
            content: content
          });
        }
      }
      function add(content) {
        var id = getUuid();
        myBaseClient.storeObject('text', listName+'/'+id, {
          content: content
        });
        return id;
      }
      function on(eventType, cb) {
        myBaseClient.on(eventType, cb);
        if(eventType == 'error') {
          errorHandlers.push(cb);
        }
      }
      return {
        getIds        : getIds,
        getContent    : getContent,
        getTitle      : getTitle,
        setContent   : setContent,
        add           : add,
        on            : on
      };
    }

    function getBackboneStore(listName) {

      myBaseClient.sync(listName+'/');

      function absPath(path) {
        return listName + '/' + path;
      }

      function storeObject(model) {
        if(! model.id) {
          model.set(model.idAttribute, getUuid());
        }

        myBaseClient.storeObject('text', absPath(model.id), model);

        return model;
      }

      return {

        create: function() {
          console.log('CREATE', arguments);
          return storeObject.apply(this, arguments);
        },

        update: function() {
          console.log('UPDATE', arguments);
          return storeObject.apply(this, arguments);
        },

        find: function(model) {
          console.log('FIND', arguments);
          return myBaseClient.getObject(absPath(model.id));
        },

        findAll: function() {
          console.log('FIND ALL', arguments);
          var ids = myBaseClient.getListing(absPath(''));
          models = [];
          for(var i=0;i<ids;i++) {
            models.push(myBaseClient.getObject(absPath(ids[i])));
          }
          return models;
        },

        destroy: function(model) {
          console.log('DESTROY', arguments);
          return remoteStorage.remove(absPath(model));
        }

      }
    }

    return {
      name: moduleName,
      dataHints: {
        "module": "documents can be text documents, or etherpad-lite documents or pdfs or whatever people consider a (text) document. But spreadsheets and diagrams probably not",
        "objectType text": "a human-readable plain-text document in utf-8. No html or markdown etc, they should have their own object types",
        "string text#content": "the content of the text document",

        "directory documents/notes/": "used by litewrite for quick notes",
        "item documents/notes/calendar": "used by docrastinate for the 'calendar' pane",
        "item documents/notes/projects": "used by docrastinate for the 'projects' pane",
        "item documents/notes/personal": "used by docrastinate for the 'personal' pane"
      },
      exports: {
        getPrivateList: getPrivateList,
        getBackboneStore: getBackboneStore
      }
    };
  });

  return remoteStorage[moduleName];

});
