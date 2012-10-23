//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');

  var remoteStorageDocuments = require('remotestorage-documents');

  remoteStorage.claimAccess('documents', 'rw');


  var escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };


  var Docs = Backbone.Collection.extend({

    model: Doc,

    localStorage: remoteStorageDocuments.getBackboneStore('notes'),

    initialize: function(models) {

      this.fetch({
        success: _.bind(function() {
          if (this.isEmpty()) {
            this.addNew();
          }
        }, this)
      });

      this
        .on('change:content', this.sort)
        .on('change:lastEdited', this.saveWhenIdle)
        .on('change:title', this.updateUrl);
    },

    addNew: function() {
      this.add(new Doc({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      }));
    },

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    saveTimeout: undefined,
    saveWhenIdle: function(doc) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(_.bind(doc.save, doc), 300);
    },

    updateUrl: function(doc) {
      var url = encodeURI(doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-'));
      if (url.length < 1) {
        doc.set('url', '');
        return;
      }
      var len = this.filter(function(doc) {
        return new RegExp('^' + escapeRegExp(url) + '(-[0-9]|$)').test(doc.get('url'));
      }).length;
      url = len < 1 ? url : url + '-' + len;
      doc.set('url', url);
    },

    deleteEmpty: function() {
      var previousDoc = this.get(settings.previous('openDocId'));
      if (previousDoc && previousDoc.isEmpty()) {
        log('here');
        previousDoc.destroy();
      }
    }

  });

  var docs = new Docs();



  var hasConnected = false;

  // TODO: remove this once event handler below is implemented.
  remoteStorage.onWidget('ready', function() {
    var all = docs.localStorage.findAll();
    if(all.length > 0) {
      docs.reset(all);
    } else if(docs.length == 0) {
      docs.addNew();
    }
  });

  remoteStorage.onWidget('state', function(state) {
    if(state == 'disconnected') {
      docs.reset().addNew();
    }
  });

  remoteStorage.documents.onChange('notes', function(event) {
    // TODO: apply update to docs collection
  });

  return docs;

});
