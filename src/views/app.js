define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.editor = new EditorView();
      this.entries = new EntriesView();
      this.search = new SearchView();
      this.aside = new AsideView();


      docs.on('fetch', this.editor.render, this.editor);

      this.search
        .on('find', function(query) {
          this.entries.render({ query: query });
        }, this)
        .on('search:focus', this.aside.show, this.aside)
        .on('search:blur', function() {
          if (!cache.isMobile) this.aside.hide();
        }, this);

      this.entries.on('tab', this.aside.toggle, this.aside);

    },

    events: {
      'click #add': 'newDoc',
      'click #menu-button': 'toggleAsideOnMobile',
      'keydown': 'handleKey',
      'keyup #editor': 'hideAsideOnKey'
    },

    newDoc: function(e) {
      e.preventDefault();

      if (!cache.openDoc.isEmpty()) {
        docs.addNew();
      } else {
        this.editor.focus();
      }

    },

    toggleAsideOnMobile: function(e) {
      if (cache.isMobile) {
        e.stopImmediatePropagation();
        this.aside.toggle();
      }
    },

    handleKey: function(e) {
      if (e.which === 9) { //tab
        e.preventDefault();
      } else if (e[cache.modKey.name]) {
        this.aside.show();
        if (e.which === 78) { //n
          this.newDoc(e);
        } else if (e.which === 38) { //up
          this.openPreviousDoc();
          return false;
        } else if (e.which === 40) { //down
          this.openNextDoc();
          return false;
        } else if (e.which === 70) // f
          this.search.focus();
      }
    },

    hideAsideOnKey: function(e) {
      if (e.which === (cache.modKey.code)) this.aside.hide();
    },

    openPreviousDoc: function() {
      var previousDoc = docs.at(docs.indexOf(cache.openDoc) - 1);
      if (previousDoc) {
        settings.save('openDocId', previousDoc.id);
      }
    },

    openNextDoc: function() {
      var nextDoc = docs.at(docs.indexOf(cache.openDoc) + 1);
      if (nextDoc) {
        settings.save('openDocId', nextDoc.id);
      }
    }

  });


  return AppView;
});
