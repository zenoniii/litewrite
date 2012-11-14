//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var Store = require('localstorage');

  var deferred = $.Deferred();

  var Settings = Backbone.Model.extend({

    defaults: {
      id: 0,
      openDocId: undefined
    },

    localStorage: new Store('appSettings'),

    initialize: function() {
      this.deferred = deferred.promise();
      this.fetch({
        success: resolve,
        error: resolve
      });
    }

  });

  function resolve() {
    deferred.resolve();
  }
  return new Settings();
});
