define(function(require) {

  var Backbone = require('backbone');


  var SearchView = Backbone.View.extend({

    el: '#search',

    events: {
      'search': 'search',
      'keyup': 'search',
      'focus': 'triggerFocus',
      'blur': 'triggerBlur'
    },

    search: function() {
      var query = this.$el.val();
      this.trigger('find', query);
    },

    focus: function() {
      this.$el.focus();
    },

    triggerFocus: function() {
      this.trigger('focus');
    },

    triggerBlur: function() {
      this.trigger('blur');
    }

  });


  return SearchView;

});
