define(function(require) {

  var Backbone = require('backbone');

  var SearchView = Backbone.View.extend({

    initialize: function() {
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
      this.trigger('find', query);
    },

    focus: function() {
      this.$el.focus();
    },

    show: function() {
      this.trigger('search:focus');
    },

    hide: function() {
      this.trigger('search:blur');
    }

  });


  return SearchView;

});
