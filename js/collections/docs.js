//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');

  var remoteStorageDocuments = require('remotestorage-documents');

  remoteStorage.claimAccess(['documents']);

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
        .on('reset', this.updateColor)
        .on('change:content', this.sort);


    },

    addNew: function() {
      this.create({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    updateColor: _.throttle(function() {
      this.each(function(doc) {
        doc.calculateColor();
      });
    }, 3000),

    deleteEmpty: function() {
      var previousDoc = this.get(settings.previous('openDocId'));
      if (previousDoc && previousDoc.isEmpty()) {
        this.remove(previousDoc);
      }
    }

  });


  return new Docs();

});
