define(function(require) {

  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var cache = require('utils/cache');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {
      this.app = options.app;
      this.editor = new EditorView({ app: this.app });
      this.entries = new EntriesView({ app: this.app, collection: this.collection });
      this.search = new SearchView();
      this.aside = new AsideView({ app: this.app, collection: this.collection });


      this.collection.on('fetch', this.editor.render, this.editor);

      this.search
        .on('find', function(query) {
          this.entries.render({ query: query });
        }, this)
        .on('focus', this.aside.show, this.aside)
        .on('blur', function() {
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

      if (!this.app.doc.isEmpty()) {
        this.collection.addNew();
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
          this.previous();
          return false;
        } else if (e.which === 40) { //down
          this.next();
          return false;
        } else if (e.which === 70) // f
          this.search.focus();
      }
    },

    hideAsideOnKey: function(e) {
      if (e.which === (cache.modKey.code)) this.aside.hide();
    },

    previous: function() {
      this.openRelativeToIndex(-1);
    },

    next: function() {
      this.openRelativeToIndex(1);
    },

    openRelativeToIndex: function(add) {
      var old = this.collection.get(this.app.doc.id);
      var index = this.collection.indexOf(old) + add;
      var doc = this.collection.at(index);
      if (doc) this.app.open(doc);
    }

  });


  return AppView;
});
