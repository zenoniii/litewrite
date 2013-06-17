define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var docs = require('collections/docs');
  var cache = require('utils/cache');


  var AsideView = Backbone.View.extend({

    el: 'body',

    initialize: function() {
      // this.entries = new EntriesView();

      if (cache.isMobile) {

        cache.loading.done(_.bind(function() {
          // more than one doc and open doc not empty
          if ( docs.length > 1 && !cache.openDoc.isEmpty() ) {
            this.show();
          }
        }, this));

      } else {

        this.show();

        setTimeout(_.bind(function() {
          this.hide();
        }, this), 3000);

      }


      docs.on('change:title', function() {
          setTimeout(_.bind(function() {
            if (!cache.isMobile) this.hide();
          }, this), 1000);
      }, this);


      function showOnDesktop() {
        if (!cache.isMobile) this.show();
      }
      docs.on('add', showOnDesktop, this);
      docs.on('fetch', showOnDesktop, this);

    },

    show: function() {
      this.$el.addClass('show-aside');
    },

    hide: function() {
      //hide sidebar when 3 or more docs and the open doc is not empty
      if (docs.length > 2 && !cache.openDoc.isEmpty()) {
        this.$el.removeClass('show-aside');
      }
    },

    toggle: function() {
      this.$el.toggleClass('show-aside');
    }

  });


  return AsideView;

});
