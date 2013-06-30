define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Doc = require('models/doc');
  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('utils/backbone.remoteStorage-documents');

  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models, options) {
      this.loading = $.Deferred();

      this
        .on('change:lastEdited', this.saveWhenIdle);

      this.initRemotestorage();

    },

    addNew: function() {
      this.add({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    // TODO: backbone 1.0 - use string as comparator
    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    saveTimeout: undefined,
    saveWhenIdle: function(doc) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(_.bind(doc.save, doc), 1000);
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

    before: function(id) {
      return this.at( this.indexOf( this.get(id) ) - 1);
    },

    after: function(id) {
      return this.at( this.indexOf( this.get(id) ) + 1);
    },

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


  return Docs;

});
