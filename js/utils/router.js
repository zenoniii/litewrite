//Module is a Singelton
define(function(require) {

  var Backbone = require('backbone');
  var settings = require('models/settings');
  var docs = require('collections/docs');


  var Router = Backbone.Router.extend({
    routes: {
      ':url': 'openDoc'
    },

    openDoc: function(url) {
      var doc = docs.find(function(doc) {
	      return doc.get('url') === url;
      }, this);
      if ( _.isUndefined(doc) ) {
        this.navigate('', { replace: true });
      } else {
	settings.put('openDocId', doc.id);
      }
    }
  });

  return new Router();
});