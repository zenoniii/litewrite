define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var settings = require('models/settings');
  var docs = require('collections/docs');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      new EditorView();
      new EntriesView();

      //fade out document list after 3s
      setTimeout(_.bind(function() {
        this.$('aside').removeClass('visible');
      }, this), 3000);
    },

    events: {
      'click #add': 'newDoc'
    },

    newDoc: function(e) {
      e.preventDefault();

      docs.addNew();
    }
  });


  return AppView;
});
