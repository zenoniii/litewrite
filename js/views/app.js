define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.editor = new EditorView();
      this.entries = new EntriesView();

      this.$aside = this.$el.find('aside');

      //fade out document list after 3s
      setTimeout(_.bind(function() {
        this.$('aside').removeClass('visible');
      }, this), 3000);
    },

    events: {
      'click #aside': 'toggleAside',
      'click #add': 'newDoc',
      'click #menu-button': 'toggleAside',
      'keydown': 'handleKey'
    },

    newDoc: function(e) {
      e.preventDefault();

      if (!cache.openDoc.isEmpty()) {
        docs.addNew();
      } else {
        this.editor.focus();
      }
    },

    toggleAside:  function(e) {
      e.stopImmediatePropagation();
      this.$aside.toggleClass('visible');
    },

    handleKey: function(e) {
      //disable tab key
      if (e.which === 9) {
        e.preventDefault();
      } else if (e.ctrlKey) {
        if (e.which === 78) { // n
          this.newDoc(e);
          return false;
        } else if (e.which === 38) { //up
          var previousDoc = docs.at(docs.indexOf(cache.openDoc) - 1);
          settings.set('openDocId', previousDoc ? previousDoc.id : docs.last().id);
          return false;
        } else if (e.which === 40) { //down
          var nextDoc = docs.at(docs.indexOf(cache.openDoc) + 1);
          settings.set('openDocId', nextDoc ? nextDoc.id : docs.first().id);
          return false;
        }
      }
    }
  });


  return AppView;
});
