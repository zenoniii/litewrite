define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var utils = require('utils');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {
      this.app = options.app;
      this.template = _.template(entriesTemplate);

      // TODO: update height on resize
      this.height = this.$el.height() - 50;

      this.collection
        .on('fetch', function ready() { this.render(); this.collection.off('fetch', ready); }, this) // TODO: backbone 1.0 - redundant
        .on('reset', this.render, this) // TODO: backbone 1.0 - use sort event
        .on('add', this.render, this)
        .on('change:title', this.updateTitle, this)
        .on('change:lastEdited', this.moveItem, this)
        .on('destroy', this.removeItem, this);

      this.app.doc.on('change:id', this.selectDoc, this);

      this.app.state.on('change:query', this.render, this);
    },

    serialize: function() {
      var query = this.app.state.get('query');
      var docs = this.collection
        .filter(function(doc) {
          var match = query ? new RegExp(utils.escapeRegExp(query), 'i').test( doc.get('title') ) : true;
          return !doc.isEmpty() && match;
        }).map(function(doc) {
          var res = doc.toJSON();
          res.opacity = doc.getOpacity();
          return res;
        });

      return { docs: docs };
    },

    render: function() {
      this.$el.html( this.template( this.serialize() ) );
      this.selectDoc();
    },

    find: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    updateTitle: function(doc) {
      var $item = this.find(doc.id).find('a');
      if ($item.length && !doc.isEmpty()) {
        $item.text(doc.get('title'));
      } else {
        this.render();
      }
    },

    moveItem: function(doc) {
      this.$el.prepend( this.removeItem(doc) );
    },

    removeItem: function(doc) {
      return this.find(doc.id).remove();
    },

    selectDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.find( this.app.doc.id )
        .addClass('selected');

      this.scrollToSelected();
    },

    scrollToSelected: function() {
      var position = this.$selected.position();
      if (!position) return;
      var top = position.top;
      if (top < 0 || top > this.height) {
        this.$el.scrollTop( top - 15 );
      }
    },

    events: {
      'click': 'tabOnMobile',
      'click .item': 'openDoc'
    },

    tabOnMobile: function(e) {
      if (utils.isDesktop) return;
      e.stopImmediatePropagation();
      this.trigger('tab');
    },

    openDoc: function(e) {
      e.preventDefault();
      var id = this.$(e.currentTarget).attr('data-id');
      this.app.open(id);
    }

  });


  // see link for more info:
  // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  }



  return EntriesView;
});
