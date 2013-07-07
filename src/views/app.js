define(function(require) {

  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var utils = require('utils');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      this.app = options.app;

      this.editor = new EditorView({ app: this.app });
      this.entries = new EntriesView({ app: this.app, collection: this.collection });
      this.search = new SearchView({ model: this.app.state });
      this.aside = new AsideView({ app: this.app, collection: this.collection });


      this.collection.on( 'fetch', this.editor.render, this.editor );

      this.search
        .on('focus', this.aside.show, this.aside)
        .on('blur', this.aside.desktopHide, this.aside);

      this.editor.on( 'modKey', this.aside.hide, this.aside );

      this.entries.on( 'open', this.aside.toggle, this.aside );

    },

    events: {
      'click #add': 'newDoc',
      'touchend #add': 'newDoc',
      'touchend #menu-button': 'toggleAside',
      'keydown': 'handleKey'
    },

    newDoc: function(e) {
      e.preventDefault();
      if (utils.isMobile) this.aside.toggle();
      if (this.app.doc.isEmpty()) return this.editor.focus();
      this.collection.addNew();
    },

    toggleAside: function() {
      this.aside.toggle();
    },

    handleKey: function(e) {
      if (e.which === 9) { // tab
        e.preventDefault();
      } else if (e[utils.modKey.name]) {
        this.aside.show();
        if (e.which === 78) { // n
          this.newDoc(e);
        } else if (e.which === 38) { // up
          this.previous();
          return false;
        } else if (e.which === 40) { // down
          this.next();
          return false;
        } else if (e.which === 70) // f
          this.search.focus();
      }
    },

    previous: function() {
      var doc = this.collection.before(this.app.doc.id);
      if (doc) this.app.open(doc);
    },

    next: function() {
      var doc = this.collection.after(this.app.doc.id);
      if (doc) this.app.open(doc);
    }

  });


  return AppView;
});
