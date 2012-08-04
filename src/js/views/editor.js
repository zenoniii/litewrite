define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('settings');
  var cache = require('cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {

      this.setContent();

      settings.on('change:openDocId', function() {
        this.setContent();
        this.$el.focus();
      }, this);

    },

    setContent: function() {
      this.$el.val( cache.openDoc.get('content') );
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function() {
      cache.openDoc.save( 'content', this.$el.val() );
    }

  });


  return EditorView;
});