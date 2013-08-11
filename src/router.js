define(function(require) {

  var Backbone = require('backbone');


  var Router = Backbone.Router.extend({

    initialize: function (options) {
      this.app = options.app;
    },

    routes: {
      // use ! for urls to not conflict with remotestorage's #access_token parameter
      '!:url': 'open',
      '*404': 'lastEdited'
    },

    lastEdited: function() {
      this.navigate(this.app.doc.getUrl(), { trigger: true, replace: true });
    },

    open: function(url) {
      var match = url.match(/\((.+?)\)$/);
      if (!match) return this.lastEdited();
      var id = match[1];
      if (!id) return this.lastEdited();
      var doc = this.app.docs.get(id);
      if (!doc) return this.lastEdited();
      this.app.open(doc);
    }

  });

  return Router;
});
