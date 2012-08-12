//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');


  var Docs = Backbone.Collection.extend({

    model: Doc,

    localStorage: new Store('docsCollection'),

    initialize: function(models) {

      this.fetch({
        success: _.bind(function() {
          if (this.isEmpty()) {
            this.addNew();
          }
        }, this)
      });

    },

    addNew: function() {
      this.create({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    //Open doc has the highest priority
    //Otherwise sort by 'lastEdited'
    comparator: function(first, second) {
      var openDocId = settings.get('openDocId');
      if (first.id == openDocId) {
        return -1;
      }
      if (second.id == openDocId) {
        return 1;
      }
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    }

  });


  return new Docs();

});