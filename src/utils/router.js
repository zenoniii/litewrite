//Module is a Singelton
define(function(require) {

  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');
  var docs = require('collections/docs');


  var Router = Backbone.Router.extend({
    //use ! for urls to not conflict with remotestorage's #access_token parameter
    routes: {
      '': 'openLastEdited',
      '!': 'openLastEdited',
      '!:uri': 'openDoc'
      // TODO: route for not found on / not only on /!
    },

    openLastEdited: function() {
      this.navigate(cache.openDoc.get('uri'), { trigger: true, replace: true });
    },

    openDoc: function(uri) {
      var doc = docs.find(function(doc) {
        return doc.get('uri') === uri;
      }, this);
      if ( _.isUndefined(doc) ) {
        this.navigate('', { trigger: true, replace: true });
      } else {
        settings.save('openDocId', doc.id);
      }
    },

    setUrl: function() {
      this.navigate('!' + cache.openDoc.get('uri'));
    }


  });

  return new Router();
});
