define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');


  var SearchView = Backbone.View.extend({

    el: '#search',

    initialize: function () {

      _.bindAll(this, 'toggle');

      this.render();

      this.collection
        .on('add', this.toggle)
        .on('remove', this.toggle);

    },

    events: {
      'search': 'search',
      'keyup': 'handleKey',
      'focus': 'triggerFocus'
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
      this.trigger('search');
    },

    handleKey: function(e) {
      if (e.which === 13) { // ENTER
        e.preventDefault();
        return this.triggerBlur();
      }
      this.search();
    },

    focus: function() {
      this.$el.focus();
    },

    triggerFocus: function() {
      this.trigger('focus');
    },

    triggerBlur: function() {
      this.trigger('blur');
    },

    toggle: function() {
      this.collection.length > 7 ? this.show() : this.hide();
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
