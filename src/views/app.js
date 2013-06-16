define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var SearchView = require('views/search');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');
  var mediator = require('mediator');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.editor = new EditorView();
      this.entries = new EntriesView();
      this.search = new SearchView();


      if (cache.isMobile) {

        cache.loading.done(_.bind(function() {
          //more than one doc and open doc not empty
          if ( docs.length > 1 && !cache.openDoc.isEmpty() ) {
            this.showAside();
          }
        }, this));

      } else {

        this.showAside();

        setTimeout(_.bind(function() {
          this.hideAside();
        }, this), 3000);

      }


      docs.on('fetch', this.editor.render, this.editor);


      docs.on('change:title', function() {
          setTimeout(_.bind(function() {
            if (!cache.isMobile) this.hideAside();
          }, this), 1000);
      }, this);


      var showAsideOnDesktop = function() {
        if (!cache.isMobile) this.showAside();
      };
      docs.on('add', showAsideOnDesktop, this);
      docs.on('fetch', showAsideOnDesktop, this);


      mediator
        .on('find', function(query) {
          this.entries.render({ query: query });
        }, this)
        .on('search:focus', this.showAside, this)
        .on('search:blur', function() {
          if (!cache.isMobile) this.hideAside();
        }, this);

    },

    showAside: function() {
      this.$el.addClass('show-aside');
    },

    hideAside: function() {
      //hide sidebar when 3 or more docs and the open doc is not empty
      if (docs.length > 2 && !cache.openDoc.isEmpty()) {
        this.$el.removeClass('show-aside');
      }
    },

    toggleAside: function() {
      this.$el.toggleClass('show-aside');
    },

    events: {
      'click #add': 'newDoc',
      'click #entries': 'toggleAsideOnMobile',
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
        this.toggleAside();
      }
    },

    handleKey: function(e) {
      if (e.which === 9) { //tab
        e.preventDefault();
      } else if (e[cache.modKey.name]) {
        this.showAside();
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
      if (e.which === (cache.modKey.code)) this.hideAside();
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
