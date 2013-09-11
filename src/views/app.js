define(function(require) {

  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var DateView = require('views/date');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var PlaceholderView = require('views/placeholder');
  var ShareView = require('views/share');
  var utils = require('utils');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      this.app = options.app;

      this.editor = new EditorView({ app: this.app });
      this.date = new DateView({ model: this.app.doc });
      this.entries = new EntriesView({ app: this.app, collection: this.collection });
      this.search = new SearchView({ model: this.app.state, collection: this.collection });
      this.aside = new AsideView({ app: this.app, collection: this.collection });
      this.placeholder = new PlaceholderView({ model: this.app.doc });
      this.share = new ShareView({ model: this.app.doc , collection: this.collection });


      this.search
        .on('focus', this.aside.show)
        .on('blur', this.editor.desktopFocus)
        .on('blur', this.aside.desktopHide);

      this.editor.on('modKey', this.aside.hide);

      this.entries
        .on('open', this.aside.hide)
        .on('scroll', this.editor.desktopFocus);

    },

    events: {
      'click #add': 'newDoc',
      'touchend #add': 'newDoc',
      'click #menu-button': 'toggleAside',
      'touchend #menu-button': 'toggleAside',
      'keydown': 'handleKey'
    },

    newDoc: function() {
      if (utils.isMobile) this.aside.hide();
      if (! this.app.doc.isEmpty()) this.collection.addNew();
      this.editor.focus();
      this.search.clear();
      return false;
    },

    toggleAside: function() {
      this.aside.toggle();
      return false;
    },

    // global key handler for shortcuts
    handleKey: function(e) {
      if (e.which === 9) return e.preventDefault(); // prevent tabkey
      if (! e[utils.modKey.name] ) return;
      this.aside.show();
      var shortcut = this.shortcuts[e.which];
      if (shortcut) return shortcut.call(this, e);
    },

    shortcuts: {
      78: function n() {
        this.newDoc();
      },
      38: function up() {
        this.previous();
        return false;
      },
      40: function down() {
        this.next();
        return false;
      },
      74: function j() {
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
