//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var Store = require('localstorage');

  var loading = $.Deferred();

  var Settings = Backbone.Model.extend({

    defaults: {
      id: 0,
      openDocId: undefined
    },

    localStorage: new Store('appSettings'),

    initialize: function() {
      this.loading = loading.promise();
      this.fetch({
        success: resolve,
        error: resolve
      });
    }

  });

  function resolve() {
    loading.resolve();
  }
  return new Settings();
});
