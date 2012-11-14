define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var meld = require('meld');
  var entriesTemplate = require('text!templates/entries.html');
  var docs = require('collections/docs');
  var settings = require('models/settings');

  var EntriesView = Backbone.View.extend({

    el: '#entries',

    initialize: function() {
      this.template = _.template(entriesTemplate);

      docs.deferred.done(_.bind(this.render, this));

      docs
        .on('reset', this.render, this)
        .on('change:title', this.updateTitle, this)
        .on('destroy', this.removeItem, this);

      settings.on('change:openDocId', this.selectOpenDoc, this);

      // meld.after(this, 'selectOpenDoc', function(result) {
      //   console.log('myObject.doSomething returned: ' + result);
      // })
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
      var $item = this.$itemById(doc.id).find('a');
      if ($item.length && !doc.isEmpty()) {
        $item.html(doc.get('title'));
      } else {
        this.render();
      }
    },

    removeItem: function(doc) {
      this.$itemById(doc.id).remove();
    },

    selectOpenDoc: function() {
      if (this.$selected) {
        this.$selected.removeClass('selected');
      }
      this.$selected = this.$itemById( settings.get('openDocId') )
        .addClass('selected');

      // this.scrollTo(this.$selected);
    },

    // scrollTo: function($item) {
    //     if (!$item.length) return;
    //     this.$el.animate({
    //      scrollTop: $item.offset().top
    //     }, 2000);
    // },

    events: {
      'click .item': 'openDoc'
    },

    openDoc: function(e) {
      e.preventDefault();

      $('#menu-button').removeClass('hide'); // TODO probably better to call the function directly
      settings.save('openDocId', this.$(e.currentTarget).attr('data-id'));
    }

  });


  return EntriesView;
});
