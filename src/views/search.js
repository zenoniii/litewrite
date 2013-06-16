define(function(require) {

  var Backbone = require('backbone');

  var SearchView = Backbone.View.extend({

    initialize: function(options) {
      this.mediator = options.mediator;
    },

    el: '#search',

    events: {
      'search': 'search',
      'keyup': 'search',
      'focus': 'show',
      'blur': 'hide'
    },

    search: function() {
      var query = this.$el.val();
      this.mediator.trigger('find', query);
    },

    focus: function() {
      this.$el.focus();
    },

    show: function() {
      this.mediator.trigger('search:focus');
    },

    hide: function() {
      this.mediator.trigger('search:blur');
    }

  });


  return SearchView;

});
