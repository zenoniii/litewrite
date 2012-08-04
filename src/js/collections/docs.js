//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('docModel');


  var Docs = Backbone.Collection.extend({

    model: Doc,

    localStorage: new Store('docsCollection'),

    initialize: function(models) {

      this.on('change:content', function(doc) {
        //Title is the first line of the content
        doc.save( 'title', doc.get('content').match(/.*/)[0] );
      });

      this.fetch({
        success: _.bind(function() {
          if (this.isEmpty()) {
            this.addNew();
          }
        }, this)
      });

    },

    addNew: function() {
      this.create({id: _.uniqueId('doc_')});
    }
  });


  return new Docs();

});