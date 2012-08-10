//Module is a Singelton
define(function(require) {

  var Backbone = require('backbone');
  var Store = require('localstorage');

  var Settings = Backbone.Model.extend({

    defaults: {
      id: 0,
      openDocId: undefined
    },

    localStorage: new Store('appSettings'),

    initialize: function() {
      this.fetch();
    }

  });

  return new Settings();
});
