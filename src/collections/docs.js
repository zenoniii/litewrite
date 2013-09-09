define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Doc = require('models/doc');
  var remoteStorage = require('remotestorage');

  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('rs-adapter');
  var welcome = require('text!templates/welcome.html');



  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models, options) {

      _.bindAll(this, 'sort', 'save', 'welcome', 'rsChange');

      this
        .on('change:lastEdited', this.sort)
        .on('change:lastEdited', this.save);

      this.once('sync', this.welcome);

      this.initRemotestorage();

    },

    addNew: _.throttle(function(options) {
      return this.add( _.defaults(options || {}, {
        // since we display the ID in the URL it should be as short as possible.
        // as long as you don't abuse litewrite it should be save to use a unix timestamp here.
        id: Date.now(),
        lastEdited: Date.now()
      }) );
    }, 1000, { leading: true }),

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    save: function(doc) {
      doc.throttledSave();
    },

    before: function(id) {
      return this.at( this.indexOf( this.get(id) ) - 1 );
    },

    after: function(id) {
      return this.at( this.indexOf( this.get(id) ) + 1 );
    },

    welcome: function () {
      var data = { content: welcome };
      if ( this.findWhere(data) ) return this;
      return this.addNew(data);
    },

    remote: null,

    initRemotestorage: function() {
      var docs = this;

      var origHash = document.location.hash;

      remoteStorage.on('disconnect', function() {
        docs.reset().welcome();
      });

      remoteStorage.access.claim('documents', 'rw');
      remoteStorage.documents.init();

      docs.remote = remoteStorageDocuments.privateList('notes');
      docs.remote.on('change', docs.rsChange);

      setTimeout(function() {
        var md = origHash.match(/access_token=([^&]+)/);
        if ( md && (! remoteStorage.getBearerToken()) ) {
          // backbone stole our access token
          remoteStorage.setBearerToken(md[1]);
        }
      }, 0);
    },

    events: [],

    rsChange: function (event) {
      this.events.push(event);
      this.handleEvents();
    },

    handleEvents: _.debounce(function() {
      _.each(this.events, function(event) {
        if (event.origin !== 'window') {
          // TODO: normally this should work
          // but I completely disabled deletion of doc on remote events
          // because right now sometimes randomly docs disappear
          // after syncing different devices.
          // this is really annoying -.-
          //
          // if (event.oldValue && !event.newValue) return this.remove(event.oldValue);
          var existingDoc = this.get(event.newValue.id);
          if (!existingDoc) return this.add(event.newValue);
          var isNew = event.newValue.lastEdited > existingDoc.get('lastEdited');
          if (isNew) this.set(event.newValue, { remove: false });
        }
      }, this);
      this.events = [];
    }, 400)

  });


  return Docs;

});
