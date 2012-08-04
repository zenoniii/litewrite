define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('entriesView');
  var EditorView = require('editorView');
  var settings = require('settings');
  var docs = require('docs');


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