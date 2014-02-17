define(function(require) {

  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var DateView = require('views/date');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var ShareView = require('views/share');
  var utils = require('utils');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      _.bindAll(this, 'toggleSearch');

      this.app = options.app;

      this.editor = new EditorView({ model: this.model });
      this.search = new SearchView({ model: this.app.state });
      this.aside = new AsideView({ model: this.model, collection: this.collection });
      var entries = new EntriesView({ app: this.app, collection: this.collection });
      var share = new ShareView({ model: this.model, collection: this.collection });
      new DateView({ model: this.model });


      this.app
        .on('ready', this.editor.render)
        .on('ready', this.editor.desktopFocus)
        .on('ready', this.aside.showOrHide)
        .on('connected', share.show)
        .on('disconnected', share.hide);

      this.collection
        .on('add', this.toggleSearch)
        .on('remove', this.toggleSearch);

      this.search
        .on('focus', this.aside.show)
        .on('blur', this.editor.desktopFocus)
        .on('blur', this.aside.desktopHide);

      // this way we don't hide the sidebar while search is focusesd
      this.editor
        .on('typing', this.aside.desktopHide)

      entries
        .on('open', this.aside.hide)

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
      if (! this.model.isEmpty()) this.collection.addNew();
      this.editor.focus();
      this.search.clear();
      return false;
    },

    toggleAside: function() {
      this.aside.toggle();
      return false;
    },

    toggleSearch: function() {
      this.aside.hasScrollbar() ? this.search.show() : this.search.hide();
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
      var doc = this.collection.before(this.model.id);
      if (doc) this.app.open(doc);
    },

    next: function() {
      var doc = this.collection.after(this.model.id);
      if (doc) this.app.open(doc);
    }

  });


  return AppView;
});
