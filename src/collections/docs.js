define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Doc = require('models/doc');
  var remoteStorage = require('remotestorage');

  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('rs-adapter');
  var welcome = require('text!templates/welcome.txt');



  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models, options) {

      _.bindAll(this, 'sort', 'save', 'welcome', 'rsChange', 'uniqueWelcomeDoc');

      this
        .on('change:lastEdited', this.sort)
        .on('change:lastEdited', this.save)
        .on('add', this.uniqueWelcomeDoc);

      this.once('sync', this.welcome);

      this.initRemotestorage();

    },

    addNew: _.throttle(function(options) {
      return this.add( _.defaults(options || {}, {
        id: this.remote.uuid(),
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
      var data = { id: 'welcome', content: welcome };
      if (this.isEmpty()) this.addNew(data);
    },

    remote: null,

    initRemotestorage: function() {
      var docs = this;

      var origHash = document.location.hash;

      remoteStorage.on('disconnect', function() {
        docs.reset().welcome();
      });

      remoteStorage.access.claim('documents', 'rw');

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
    }, 400),

    uniqueWelcomeDoc: function() {
      var welcomes = this.where({ id: 'welcome' });
      if (welcomes.length > 1) this.remove(welcomes[0]);
    }

  });


  return Docs;

});
