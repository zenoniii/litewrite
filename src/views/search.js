define(function(require) {

  var Backbone = require('backbone');
  var mediator = require('mediator');


  var SearchView = Backbone.View.extend({

    el: '#search',

    events: {
      'search': 'search',
      'keyup': 'search',
      'focus': 'show',
      'blur': 'hide'
    },

    search: function() {
      var query = this.$el.val();
      mediator.trigger('find', query);
    },

    focus: function() {
      this.$el.focus();
    },

    show: function() {
      mediator.trigger('search:focus');
    },

    hide: function() {
      mediator.trigger('search:blur');
    }

  });


  return SearchView;

});