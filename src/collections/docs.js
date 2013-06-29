//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');
  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('utils/backbone.remoteStorage-documents');

  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models) {
      this.loading = $.Deferred();

      this
        .on('change:content', this.ensureOrder)
        .on('change:lastEdited', this.saveWhenIdle)
        .on('change:title', this.updateUri);

      this.initRemotestorage();
      this.fetch();

    },

    addNew: function() {
      this.add({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    saveTimeout: undefined,
    saveWhenIdle: function(doc) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(_.bind(doc.save, doc), 1000);
    },

    updateUri: function(doc) {
      var uri = encodeURI(doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-'));
      if (uri.length < 1) {
        doc.set('uri', '');
        return;
      }
      var len = this.filter(function(doc) {
        return new RegExp('^' + escapeRegExp(uri) + '(-[0-9]|$)').test(doc.get('uri'));
      }).length;
      uri = len < 1 ? uri : uri + '-' + len;
      doc.set('uri', uri);
    },

    ensureOrder: function() {
      if (settings.get('openDocId') !== this.first().id) this.sort();
    },

    prepare: function(query) {
      return this
        .filter(function(doc) {
          var match = query ? new RegExp(escapeRegExp(query), 'i').test( doc.get('title') ) : true;
          return !doc.isEmpty() && match;
        }).map(function(doc) {
          var res = doc.toJSON();
          res.opacity = doc.getOpacity();
          return res;
        });
    },

    fetch: _.debounce(function() {
      Backbone.Collection.prototype.fetch.call(this, {
        success: _.bind(function() {
          if (this.isEmpty()) this.addNew();
          this.loading.resolve();
          this.trigger('fetch');
        }, this)
      });
    }, 300),

    initRemotestorage: function() {
      var docs = this;
      var origHash = document.location.hash;

      remoteStorage.on('ready', _.bind(docs.fetch, docs));

      remoteStorage.on('disconnect', function() {
        docs.reset().addNew();
      });

      remoteStorage.claimAccess('documents', 'rw').then(function() {
        remoteStorage.documents.init();
        remoteStorage.displayWidget('remotestorage-connect');

        remoteStorageDocuments.onChange('notes', function(event) {
          if(event.origin !== 'window') {
            docs.fetch();
          }
        });

        setTimeout(function() {
          var md = origHash.match(/access_token=([^&]+)/);
          if(md && (! remoteStorage.getBearerToken())) {
            // backbone stole our access token
            remoteStorage.setBearerToken(md[1]);
          }
        }, 0);

      });
    }

  });


  // see link for more info:
  // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  }


  var docs = new Docs();


  return docs;

});
