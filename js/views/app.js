define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');


  var noDocs = function() {
    return docs.length < 2 && cache.openDoc.isEmpty();
  };

  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      this.editor = new EditorView();
      this.entries = new EntriesView();

      this.$menuButton = $('#menu-button');


      if (cache.isMobile) {

        cache.loading.done(_.bind(function() {
          //only one doc and it is empty
          if ( noDocs() ) {
            this.$menuButton.fadeOut();
          } else {
            this.aside('visible');
          }
        }, this));

      } else {

        this.aside('visible');

        setTimeout(_.bind(function() {
          this.aside('hidden');
        }, this), 3000);

      }


      docs.on('change:title', function() {
          setTimeout(_.bind(function() {
            if (cache.isMobile) {
              this.$menuButton[noDocs() ? 'fadeOut' : 'fadeIn']();
            } else {
              this.aside('hidden');
            }
          }, this), 1000);
      }, this);


      var showAside = function() {
        if (!cache.isMobile) this.aside('visible');
      };
      docs.on('add', showAside, this);
      docs.on('fetch', showAside, this);


      this.editor.$el.scroll(_.bind(this.toggleMenuButton, this));
      this.entries.$el.scroll(_.bind(this.toggleMenuButton, this));

    },

    aside: (function() {
      var $aside = this.$('aside');
      return function(state) {
        if (!state) {
          $aside.toggleClass('visible');
        } else if (state === 'visible') {
          $aside.addClass('visible');
        } else if (state === 'hidden') {
          //hide sidebar when 3 or more docs and the open doc is not empty
          if (docs.length > 2 && !cache.openDoc.isEmpty()) {
            $aside.removeClass('visible');
          }
        }
      };
    })(),

    events: {
      'click #add': 'newDoc',
      'click #aside': 'toggleAside',
      'click #menu-button': 'toggleAside',
      'keydown': 'handleKey',
      'keyup': 'hideAside'
    },

    newDoc: function(e) {
      e.preventDefault();

      if (!cache.openDoc.isEmpty()) {
        docs.addNew();
      } else {
        this.editor.focus();
      }
    },

    toggleAside: function(e) {
      if (cache.isMobile) {
        e.stopImmediatePropagation();
        this.$menuButton.fadeIn();
        this.aside();
      }
    },

    toggleMenuButton: function(e) {
      if (cache.isMobile) {
        var top = $(e.currentTarget).scrollTop();
        this.$menuButton[top > 20 ? 'fadeOut' : 'fadeIn' ]();
      }
    },

    handleKey: function(e) {
      if (e.which === 9) { //tab
        e.preventDefault();
      } else if (e[cache.modKey.name]) {
        this.aside('visible');
        if (e.which === 78) { //n
          this.newDoc(e);
        } else if (e.which === 38) { //up
          this.openPreviousDoc();
          return false;
        } else if (e.which === 40) { //down
          this.openNextDoc();
          return false;
        } else if (e.which === 70) // f
          this.entries.focusSearch();
      }
    },

    hideAside: function(e) {
      if (e.which === (cache.modKey.code)) this.aside('hidden');
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
