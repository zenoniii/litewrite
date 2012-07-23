define(['underscore', 'backbone', 'localstorage'], function(_, Backbone, Store) {

  AppModel = Backbone.Model.extend({

    defaults: {
      id: 0,
      darkBackground: false
    },

    localStorage: new Store('appOptions'),

    initialize: function() {
      this.fetch();
    }

  });


  return AppModel;
});