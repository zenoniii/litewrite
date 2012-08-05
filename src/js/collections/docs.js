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
        //Title is the first line of the content:
        //empty if content starts with '<br>'
        //skip '<div>' if content starts with '<div>'
        //matches everything until the first '<'
        //this way it works for me in Chrome and Firefox
        var regex = doc.get('content').match(/(?=<br>)|<div>(.*?)<|.+?(?=<|$)/);
        var title = !_.isUndefined(regex[1]) ? regex[1] : regex[0];

        doc.save('title', title);
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