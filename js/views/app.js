define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');


  var isMac = /Mac/.test(navigator.platform);


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.editor = new EditorView();
      this.entries = new EntriesView();

      this.$aside = this.$('aside');

      setTimeout(_.bind(function() {
	if (docs.length > 2) { this.$aside.removeClass('visible'); }
      }, this), 3000);

      docs.on('add', function() {
	if (docs.length === 3) { this.$aside.removeClass('visible'); }
      }, this);
    },

    events: {
      'click #add': 'newDoc',
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

    handleKey: function(e) {
      if (e.which === 9) { //tab
        e.preventDefault();
      } else if (isMac ? e.ctrlKey : e.altKey) {
        if (e.which === 78) { //n
          this.newDoc(e);
        } else if (e.which === 38) { //up
          this.openPreviousDoc();
          return false;
        } else if (e.which === 40) { //down
          this.openNextDoc();
          return false;
        }
      }
    },

    openPreviousDoc: function() {
      var previousDoc = docs.at(docs.indexOf(cache.openDoc) - 1);
      settings.set('openDocId', previousDoc ? previousDoc.id : docs.last().id);
    },

    openNextDoc: function() {
      var nextDoc = docs.at(docs.indexOf(cache.openDoc) + 1);
      settings.set('openDocId', nextDoc ? nextDoc.id : docs.first().id);
    }
  });


  return AppView;
});
