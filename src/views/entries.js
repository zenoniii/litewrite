define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var docs = require('collections/docs');
  var cache = require('utils/cache');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {
      this.app = options.app;
      this.template = _.template(entriesTemplate);

      // TODO: update height on resize
      this.height = this.$el.height() - 50;

      docs
        .on('fetch', function ready() { this.render(); docs.off('fetch', ready); }, this) // TODO: backbone 1.0 - use once()
        .on('reset', this.render, this)
        .on('add', this.render, this)
        .on('change:title', this.updateTitle, this)
        .on('destroy', this.removeItem, this);

      this.app.doc.on('change:id', this.selectDoc, this);
    },

    render: function(options) {
      this.$el.html(
        this.template({
          docs: docs.prepare(options && options.query)
        })
      );

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

    removeItem: function(doc) {
      this.find(doc.id).remove();
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
      if (cache.isMobile) {
        e.stopImmediatePropagation();
        this.trigger('tab');
      }
    },

    openDoc: function(e) {
      e.preventDefault();
      var id = this.$(e.currentTarget).attr('data-id');
      this.app.open(id);
    }

  });


  return EntriesView;
});
