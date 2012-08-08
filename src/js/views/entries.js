define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var entriesTemplate = require('text!templates/entries.html');
  var docs = require('collections/docs');
  var settings = require('models/settings');

  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function() {
      this.template = _.template(entriesTemplate);
      this.render();

      docs.on('change:title', function(doc) {
        this.$itemById(doc.id).find('a').html( doc.get('title') );
      }, this);

      docs.on('destroy', function(doc) {
        this.$itemById(doc.id).remove();
      }, this);

      docs.on('add', this.render, this);
    },

    $itemById: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    render: function() {
      this.$el.html(
        this.template({ docs: docs.toJSON() })
      );

      this.$selected = this.$itemById( settings.get('openDocId') )
        .addClass('selected');
    },

    events: {
      'click .item': 'openDoc'
    },

    openDoc: function(e) {
      e.preventDefault();

      this.$selected.removeClass('selected');

      this.$selected = $(e.currentTarget).addClass('selected');
      settings.save('openDocId', this.$selected.attr('data-id'));
    }

  });


  return EntriesView;
});