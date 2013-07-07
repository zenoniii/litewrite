define(function(require) {

  var Backbone = require('backbone');


  var Router = Backbone.Router.extend({

    initialize: function (options) {
      this.app = options.app;
    },

    // use ! for urls to not conflict with remotestorage's #access_token parameter
    routes: {
      '': 'openLastEdited',
      '!': 'openLastEdited',
      '!:uri': 'open'
      // TODO: route for not found on / not only on /!
    },

    openLastEdited: function() {
      this.go( this.app.doc.get('uri') );
    },

    open: function(uri) {
      var doc = this.app.docs.where({ uri: uri })[0]; // TODO: backbone 1.0 - use findWhere
      if (!doc) return this.go('');
      this.app.open(doc);
    },

    go: function (url) {
      return this.navigate( url, { trigger: true, replace: true } );
    }

  });

  return Router;
});
