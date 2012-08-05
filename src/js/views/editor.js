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

      settings.on('change:openDocId', this.setContent, this);

    },

    setContent: function() {
      this.$el.html( cache.openDoc.get('content') );
      this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function() {
      log(this.$el.html())
      cache.openDoc.save( 'content', this.$el.html() );
    }

  });


  return EditorView;
});