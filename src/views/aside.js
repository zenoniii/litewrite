define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var utils = require('utils');


  var AsideView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      this.app = options.app;

      this.app.on('ready', function() {
        // if only one doc or open doc empty return
        if ( this.collection.length < 2 || this.app.doc.isEmpty() ) return;
        this.show();
        if (utils.isDesktop) _.delay(_.bind(this.hide, this), 3000);
      }, this);

      this.collection
        .on( 'add', this.desktopShow, this )
        .on( 'change', this.desktopHide, this )
        .on( 'fetch', this.desktopShow, this );

    },

    events: {
      'touchend #aside': 'toggle'
    },

    show: function() {
      this.$el.addClass('show-aside');
    },

    hide: function() {
      // hide sidebar when 3 or more docs and the open doc is not empty
      if ( this.collection.length > 2 && !this.app.doc.isEmpty() ) {
        this.$el.removeClass('show-aside');
      }
    },

    toggle: function() {
      this.$el.toggleClass('show-aside');
    },

    desktopShow: function() {
      if (utils.isDesktop) this.show();
    },

    desktopHide: function() {
      if (utils.isDesktop) _.delay( _.bind(this.hide, this), 1000 );
    }

  });


  return AsideView;

});
