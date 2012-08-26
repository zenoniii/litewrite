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
      var doc = docs.find(function(doc) {
        return this.getDocUrl(doc) === slug;
      }, this);
      if ( _.isUndefined(doc) ) {
        this.navigate('', { replace: true });
      } else {
        settings.save('openDocId', doc.id);
      }
    },

    getDocUrl: function(doc) {
      return encodeURI( doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-') );
    },


    setUrl: function(doc) {
      var formattedTitle = this.getDocUrl(doc);
      var url = formattedTitle.length > 0 ? formattedTitle : '';
      this.navigate(url);
    }

  });

  return new Router();
});