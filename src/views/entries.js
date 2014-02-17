define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var utils = require('utils');


  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function(options) {

      _.bindAll(this, 'filter', 'render', 'update', 'toTop', 'removeItem', 'selectDoc', 'openFirst');

      this.litewrite = options.litewrite;
      this.template = _.template(entriesTemplate);

      this.collection
        .on('add', this.render)
        .on('change:title', this.update)
        .on('change:lastEdited', this.toTop)
        .on('remove', this.removeItem);

      this.litewrite.doc
        .on('change:id', this.selectDoc);

      this.litewrite.state
        .on('change:query', this.render)
        .on('change:query', this.openFirst);

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
      var query = this.litewrite.state.get('query');
      if (!query) return true;
      var reg = new RegExp(utils.escapeRegExp(query), 'i');
      var match = reg.test( doc.get('title') );
      return match;
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
      $item.text( doc.get('title') );
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
      this.$selected = this.find( this.litewrite.doc.id )
        .addClass('selected');
    },

    selectedFirst: function () {
      return this.$selected.attr('data-id') == this.collection.first().id;
    },

    // event handler to open a document
    openDoc: function(e) {
      e.preventDefault();

      var id = this.$(e.currentTarget).attr('data-id');
      this.litewrite.open(id);
      this.trigger('open');
    },

    openFirst: function() {
      var id = this.$('.item').attr('data-id');
      this.litewrite.open(id);
    }

  });



  return EntriesView;
});
