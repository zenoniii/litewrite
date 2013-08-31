define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var utils = require('utils');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {

      _.bindAll(this, 'filter', 'render', 'update', 'toTop', 'removeItem', 'selectDoc', 'openFirst');

      this.app = options.app;
      this.template = _.template(entriesTemplate);

      this.collection
        .on('add', this.render)
        .on('change:title', this.update)
        .on('change:lastEdited', this.toTop)
        .on('remove', this.removeItem);

      this.app.doc.on('change:id', this.selectDoc);

      this.app.state.on('change:query', this.render);

    },

    events: {
      'click .item': 'openDoc'
    },

    // generate opacity for docs and filter them
    serialize: function() {
      var docs = this.collection
        .filter(this.filter).map(function(doc) {
          var res = doc.toJSON();
          res.opacity = doc.getOpacity();
          res.url = doc.getUrl();
          return res;
        });

      return { docs: docs };
    },

    // check if it matches state.query
    // TODO: filter should only be run if ther is a query. would be faster.
    filter: function(doc) {
      var query = this.app.state.get('query');
      if (query) {
        var reg = new RegExp(utils.escapeRegExp(query), 'i');
        var match = reg.test( doc.get('title') );
        if (!match) return;
      }
      return true;
    },

    render: function() {
      this.$el.html( this.template( this.serialize() ) );
      this.selectDoc();
    },

    find: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    // update text and href for a doc
    update: function(doc) {
      var $item = this.find(doc.id).find('a');
      if (!$item.length || doc.isEmpty()) return this.render();
      $item.html( doc.get('title') );
      $item.attr( 'href', '#!' + doc.getUrl() );
    },

    // moves a doc from its current position to the top of the list
    toTop: function(doc) {
      var $item = this.removeItem(doc);
      $item.children('a').css('opacity', 1);
      this.$el.prepend($item);
    },

    removeItem: function(doc) {
      return this.find(doc.id).remove();
    },

    // add a 'selected' class to the open doc
    selectDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.find( this.app.doc.id )
        .addClass('selected');

      this.scrollToSelected();
    },

    // scrolls to the selected element
    scrollToSelected: function() {
      // let the browser handle this for us
      this.$selected.children('a').focus();
      this.trigger('scroll');
    },

    // event handler to open a document
    openDoc: function(e) {
      e.preventDefault();
      var id = this.$(e.currentTarget).attr('data-id');
      this.app.open(id);
      this.trigger('open');
    },

    openFirst: function() {
      var id = this.$('.item').attr('data-id');
      this.app.open(id);
    }

  });



  return EntriesView;
});
