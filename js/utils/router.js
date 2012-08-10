//Module is a Singelton
define(function(require) {

  var Backbone = require('backbone');
  var settings = require('models/settings');
  var docs = require('collections/docs');


  var Router = Backbone.Router.extend({
    routes: {
      ':slug': 'openDoc'
    },

    openDoc: function(slug) {
      var docId = slug.split('-')[0];
      if ( _.isUndefined(docs.get(docId)) ) {
        this.navigate('', { replace: true });
      } else {
        settings.set('openDocId', docId);
      }
    }
  });

  return new Router();
});