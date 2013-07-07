define(function(require) {

  var Backbone = require('backbone');


  var SearchView = Backbone.View.extend({

    initialize: function () {
      this.render();
    },

    el: '#search',

    events: {
      'search': 'search',
      'keyup': 'search',
      'focus': 'triggerFocus',
      'blur': 'triggerBlur'
    },

    serialize: function () {
      return this.model.get('query');
    },

    render: function () {
      this.$el.val( this.serialize() );
    },

    search: function() {
      var query = this.$el.val();
      this.model.save( 'query', query );
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
