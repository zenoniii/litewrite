define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      content: '',
      lastEdited: undefined
    },

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited, this)
        .on('change:content', this.updateTitle, this);
    },

    updateLastEdited: function() {
        this.save('lastEdited', new Date().getTime());
    },

    updateTitle: function() {
      //Title is the first line of the content:
      //empty if content starts with '<br>'
      //skip '<div>' if content starts with '<div>'
      //matches everything until the first '<'
      //this way it works in Chrome and Firefox
      var matchTitle = this.get('content').match(/(?=<br>)|<div>(.*?)<|.+?(?=<|$)/);
      var title = !_.isUndefined(matchTitle[1]) ? matchTitle[1] : matchTitle[0];

      this.save('title', title);
    }


  });


  return Doc;
});