define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');
  require('autosize');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {

      _.bindAll(this, 'render', 'focus', 'blur', 'desktopFocus');

      this.app = options.app;

      this.app.on('ready', this.render);
      this.app.on('ready', this.desktopFocus);
      this.app.doc.on('change:id', this.render);
      this.app.doc.on('update', this.render);

      this.$el.autosize();
    },

    // only re-render when content changed
    render: function() {
      var content = this.app.doc.get('content');
      if ( content === this.$el.val() ) return;
      // strip html tags from documents.
      // this is just for migration from contenteditable to textarea.
      // we can remove this later on.
      content = content.replace(/<br>/ig,'\n').replace(/<[^>]+>/ig,'');
      this.handleCyrillic(content);
      this.$el.val(content || '').trigger('autosize.resize');
    },

    focus: function() {
      if (utils.isDesktop) return this.$el.focus();
      setTimeout(_.bind(this.$el.focus, this.$el), 500);
    },

    desktopFocus: function() {
      if (utils.isDesktop) this.focus();
    },

    blur: function() {
      this.$el.blur();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      if ( e.which === (utils.modKey.code) ) return this.trigger('modKey');
      this.app.doc.set( 'content', this.$el.val() );
    },

    handleCyrillic: function(content) {
      // see http://kourge.net/projects/regexp-unicode-block
      var isCyrillic = content.match('[\u0400-\u04FF\u0500-\u052F]');
      isCyrillic ? this.$el.addClass('cyrillic') : this.$el.removeClass('cyrillic');
    }

  });


  return EditorView;
});
