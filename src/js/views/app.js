define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

  AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(model) {
      this.model = model;

      if (model.get('darkBackground')) {
        this.$el.toggleClass('dark');
      }
      model.on('change:darkBackground', function() {
        this.$el.toggleClass('dark');
      }, this);
    },

    events: {
      'click #color-toggle': 'toggleColor'
    },

    toggleColor: function() {
      this.model.save('darkBackground', !this.model.get('darkBackground'));
    }
  });


  return AppView;
});