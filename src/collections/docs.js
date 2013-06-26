//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');
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

    ensureOrder: function() {
      if (settings.get('openDocId') !== this.first().id) this.sort();
    },

    deleteEmpty: function() {
      var previousDoc = this.get(settings.previous('openDocId'));
      if (previousDoc && previousDoc.isEmpty()) {
        previousDoc.destroy();
      }
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
