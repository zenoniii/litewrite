define(function(require) {

  var Backbone = require('backbone');


  var SearchView = Backbone.View.extend({

    el: '#search',

    initialize: function () {
      this.render();
    },

    events: {
      'search': 'search',
      'keyup': 'handleKey',
      'focus': 'triggerFocus'
    },

    render: function () {
      this.$el.val( this.model.get('query') );
    },

    search: function() {
      var query = this.$el.val();
      this.model.save( 'query', query );
      this.trigger('search');
    },

    handleKey: function(e) {
      if (e.which === 13) { // ENTER
        e.preventDefault();
        return this.trigger('blur');
      }
      this.search();
    },

    focus: function() {
      if (!this.$el.hasClass('hide')) this.$el.focus();
    },

    triggerFocus: function() {
      this.trigger('focus');
    },

    show: function() {
      this.$el.removeClass('hide');
    },

    hide: function() {
      this.$el.addClass('hide');
    },

    clear: function() {
      this.model.save('query', '');
      this.render();
    }

  });


  return SearchView;

});
