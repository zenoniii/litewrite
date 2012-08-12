define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      content: '',
      lastEdited: undefined,
      opacity: 1
    },

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited, this)
        .on('change:content', this.updateTitle, this)
        .on('change:lastEdited', this.resetOpacity, this);
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

    resetOpacity: function() {
      this.save('opacity', 1);
    },

    calculateOpacity: function() {
      //Time passed since last this document was edited the last time in milliseconds
      var diff = (new Date().getTime() - this.get('lastEdited'));
      //The older the document the smaller the opacity
      //but the opacity is allway between 0.1 and 1
      //For documents older than 2 Weeks the opacity won't change anymore
      var limit = 14 * 86400000;
      var opacity = diff > limit ? 0.1 : Math.round( (0.1 + ((limit - diff) / limit) * 0.9) * 100 ) / 100;
      this.save('opacity', opacity);
    }


  });


  return Doc;
});