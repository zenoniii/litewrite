define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var utils = require('utils');


  var AsideView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {
      this.app = options.app;
      // TODO: add this: this.entries = new EntriesView();

      if (utils.isMobile) {

        thi.app.on('ready', function() {
          // more than one doc and open doc not empty
          if ( this.collection.length > 1 && !this.app.doc.isEmpty() ) {
            this.show();
          }
        }, this);

      } else {

        this.show();

        setTimeout(_.bind(function() {
          this.hide();
        }, this), 3000);

      }


      this.app.doc.on('change:title', function() {
          setTimeout(_.bind(function() {
            if (!utils.isMobile) this.hide();
          }, this), 1000);
      }, this);


      function showOnDesktop() {
        if (!utils.isMobile) this.show();
      }
      this.collection.on('add', showOnDesktop, this);
      this.collection.on('fetch', showOnDesktop, this);

    },

    show: function() {
      this.$el.addClass('show-aside');
    },

    hide: function() {
      //hide sidebar when 3 or more docs and the open doc is not empty
      if (this.collection.length > 2 && !this.app.doc.isEmpty()) {
        this.$el.removeClass('show-aside');
      }
    },

    toggle: function() {
      this.$el.toggleClass('show-aside');
    }

  });


  return AsideView;

});
