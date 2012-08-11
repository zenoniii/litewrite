//Module is a Singelton
define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Store = require('localstorage');
  var Doc = require('models/doc');
  var settings = require('models/settings');


  var Docs = Backbone.Collection.extend({

    model: Doc,

    localStorage: new Store('docsCollection'),

    initialize: function(models) {

      this.on('change:content', saveTitle);

      this.fetch({
        success: _.bind(function() {
          if (this.isEmpty()) {
            this.addNew();
          }
        }, this)
      });

    },

    addNew: function() {
      this.create({
        id: _.uniqueId(),
        lastEdited: new Date().getTime()
      });
    },

    //Open doc has the highest priority
    //Otherwise sort by 'lastEdited'
    comparator: function(first, second) {
      var openDocId = settings.get('openDocId');
      if (first.id == openDocId) {
        return -1;
      }
      if (second.id == openDocId) {
        return 1;
      }
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    }

  });


  function saveTitle(doc) {
    //Title is the first line of the content:
    //empty if content starts with '<br>'
    //skip '<div>' if content starts with '<div>'
    //matches everything until the first '<'
    //this way it works in Chrome and Firefox
    var matchTitle = doc.get('content').match(/(?=<br>)|<div>(.*?)<|.+?(?=<|$)/);
    var title = !_.isUndefined(matchTitle[1]) ? matchTitle[1] : matchTitle[0];

    doc.save('title', title);
  }


  return new Docs();

});