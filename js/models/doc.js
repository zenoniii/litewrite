define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      content: '',
      lastEdited: undefined,
      color: 'rgb(0, 0, 0)'
    },

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited, this)
        .on('change:content', this.updateTitle, this)
        .on('change:lastEdited', this.resetColor, this);
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
    },

    resetColor: function() {
      this.save('color', 'rgb(0, 0, 0)');
    },

    calculateColor: function() {
      //Time passed since last this document was edited the last time in milliseconds
      var diff = (new Date().getTime() - this.get('lastEdited'));
      //For documents older than 2 Weeks the color won't change anymore
      var limit = 14 * 86400000;
      //The older the document the lighter the color
      var c = diff > limit ? 200 : Math.round(diff / limit * 200);

      this.save('color', 'rgb('+c+', '+c+', '+c+')');
    }


  });


  return Doc;
});
