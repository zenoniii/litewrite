define(function(require) {

  var Backbone = require('backbone');


  var Router = Backbone.Router.extend({

    initialize: function (options) {
      this.app = options.app;
    },

    routes: {
      // use ! for urls to not conflict with remotestorage's #access_token parameter
      '!:url': 'open',
      '*404': 'openFirst'
    },

    openFirst: function() {
      this.app.open();
    },

    open: function(url) {
      var match = url.match(/\((.+?)\)$/);
      if (!match) return this.openFirst();
      var id = match[1];
      if (!id) return this.openFirst();
      var doc = this.app.docs.get(id);
      if (!doc) return this.openFirst();
      this.app.open(doc);
    }

  });

  return Router;
});
