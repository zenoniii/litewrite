define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Doc = require('models/doc');
  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('rs-adapter');


  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models, options) {

      _.bindAll(this);

      this
        .on('change:lastEdited', this.sort)
        .on('change:lastEdited', this.saveWhenIdle);

      this.initRemotestorage();

    },

    addNew: function() {
      this.add({
        // TODO: remotestorage should create id
        id: Math.round( Math.random() * 10000000000000 ),
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
      this.saveTimeout = setTimeout(doc.save, 1000);
    },

    fetch: _.debounce(function() {
      return Backbone.Collection.prototype.fetch.call(this, {
        success: this.handleFetch
      });
    }, 300, true),

    handleFetch: function () {
      if (this.isEmpty()) this.addNew();
      this.trigger('fetch'); // TODO: backbone 1.0 - this can be removed
    },

    before: function(id) {
      return this.at( this.indexOf( this.get(id) ) - 1 );
    },

    after: function(id) {
      return this.at( this.indexOf( this.get(id) ) + 1 );
    },

    initRemotestorage: function() {
      var docs = this;

      var origHash = document.location.hash;

      remoteStorage.on('ready', docs.fetch);

      remoteStorage.on('disconnect', function() {
        docs.reset().addNew();
      });

      remoteStorage.claimAccess('documents', 'rw').then(function() {
        remoteStorage.documents.init();
        remoteStorage.displayWidget('remotestorage-connect');

        remoteStorageDocuments.onChange('notes', docs.rsChange);

        setTimeout(function() {
          var md = origHash.match(/access_token=([^&]+)/);
          if ( md && (! remoteStorage.getBearerToken()) ) {
            // backbone stole our access token
            remoteStorage.setBearerToken(md[1]);
          }
        }, 0);

      });
    },

    rsChange: function (event) {
      if (event.origin !== 'window') this.fetch();
    }

  });


  return Docs;

});
