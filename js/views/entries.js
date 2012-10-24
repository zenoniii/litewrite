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

      docs
        .on('reset', this.render, this)
        .on('change:title', this.updateTitle, this)
        .on('change:content', this.updateColor, this)
        .on('destroy', this.removeItem, this);

      settings.on('change:openDocId', this.selectOpenDoc, this);
    },

    render: function() {
      this.$el.html(
        this.template({
          docs: docs
            .filter(function(doc) {
              return !doc.isEmpty();
            }).map(function(doc) {
	      var res = doc.toJSON();
	      res.opacity = doc.getOpacity();
	      return res;
            })
        })
      );

      this.selectOpenDoc();
    },

    $itemById: function(id) {
      return this.$('.item[data-id=' + id + ']');
    },

    updateTitle: function(doc) {
      this.$itemById(doc.id).find('a').html( doc.get('title') );
    },

    updateColor: _.throttle(function(doc) {
      this.$itemById(doc.id).find('a').css('color', doc.get('color'));
    }, 5000),

    removeItem: function(doc) {
      this.$itemById(doc.id).remove();
    },

    selectOpenDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.$itemById( settings.get('openDocId') )
        .addClass('selected');
    },

    events: {
      'click .item': 'openDoc'
    },

    openDoc: function(e) {
      e.preventDefault();
      $('#menu-button').removeClass('hide');
      console.log('show menubutton');

      settings.set('openDocId', this.$(e.currentTarget).attr('data-id'));
    }

  });


  return EntriesView;
});
