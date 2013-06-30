define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {
      this.app = options.app;
      this.app.on('ready', this.render, this);
      this.app.doc.on('change:id', this.render, this);
    },

    render: function() {
      var content = this.app.doc.get('content');
      if (!content) return this.$el.text(' ');
      if (content === this.$el.html()) return;
      this.$el.html(content);
      if (!utils.isMobile) this.focus();
    },

    focus: function() {
      this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      if (e.which === (utils.modKey.code)) this.trigger('modKey');
      this.app.doc.set( 'content', this.$el.html() );
    }

  });


  return EditorView;
});
