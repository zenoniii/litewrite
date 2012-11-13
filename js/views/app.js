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


      if (!cache.isMobile) {

        setTimeout(_.bind(function() {
          this.aside('hidden');
        }, this), 3000);

        docs.on('add', function() {
          this.aside('visible');
        }, this);

        //hide sidebar when 3 or more docs and the open doc is not empty
        docs.on('change:title', function() {
            setTimeout(_.bind(function() {
              this.aside('hidden');
            }, this), 1000);
        }, this);

        docs.on('fetch', function() {
          this.aside('visible');
        }, this);

      }

      // TODO Should be integrated with the 'events' object but doesn't work.
      var appView = this;
      $('#editor').scroll(function(e) { appView.toggleMenuButton(e); });
      $('#entries').scroll(function(e) { appView.toggleMenuButton(e); });
    },

    aside: (function() {
      var $aside = this.$('aside');
      return function(state) {
        if (!state) {
          $aside.toggleClass('visible');
        } else if (state === 'visible') {
          $aside.addClass('visible');
        } else if (state === 'hidden') {
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
      'scroll': 'toggleMenuButton',
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
      e.stopImmediatePropagation();
      $('#menu-button').removeClass('hide'); // TODO probably better to call the function directly
      this.aside();
    },

    toggleMenuButton: function(e) {
      if($(e.currentTarget).scrollTop() > 20) {
        $('#menu-button').addClass('hide');
      } else {
        $('#menu-button').removeClass('hide');
      }
    },

    handleKey: function(e) {
      if (e.which === 9) { //tab
        e.preventDefault();
      } else if (cache.isMac ? e.ctrlKey : e.altKey) {
        this.aside('visible');
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

    hideAside: function(e) {
      if (e.which === (cache.isMac ? 17 : 18)) this.aside('hidden');
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
