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


      if (settings.get('darkBackground')) {
        this.$el.toggleClass('dark');
      }

      settings.on('change:darkBackground', function() {
        this.$el.toggleClass('dark');
      }, this);

    },

    events: {
      'click #color-toggle': 'toggleColor',
      'click #add': 'newDoc'
    },

    toggleColor: function() {
      settings.toggle('darkBackground');
    },

    newDoc: function(e) {
      e.preventDefault();

      docs.addNew();
    }
  });


  return AppView;
});