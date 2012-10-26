define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {
      cache.loaded.done(_.bind(this.render, this));
      settings.on('change:openDocId', this.render, this);
    },

    render: function() {
      this.focus();
      this.$el.html(cache.openDoc.get('content'));
    },

    focus: function() {
      this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function() {
      cache.openDoc.set( 'content', this.$el.html() );
    }

  });


  return EditorView;
});
