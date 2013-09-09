define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {

      _.bindAll(this, 'render', 'focus', 'blur', 'desktopFocus');

      this.app = options.app;

      this.app.on('ready', this.render);
      this.app.on('ready', this.focus);
      this.app.doc.on('change:id', this.render);
      this.app.doc.on('update', this.render);

    },

    // only re-render when content changed
    render: function() {
      var content = this.app.doc.get('content');
      if ( content === this.$el.html() ) return;
      if (content) return this.$el.html(content);
      this.$el.text(' ');
    },

    focus: function() {
      this.$el.focus();
    },

    desktopFocus: function() {
      if (utils.isDeskop) this.focus();
    },

    blur: function() {
      this.$el.blur();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      if ( e.which === (utils.modKey.code) ) return this.trigger('modKey');
      this.app.doc.set( 'content', this.$el.html() );
    }

  });


  return EditorView;
});
