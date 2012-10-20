define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      url: '',
      content: '',
      lastEdited: undefined,
      color: 'rgb(0, 0, 0)'
    },

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited)
        .on('change:content', this.updateTitle)
        .on('change:lastEdited', this.resetColor);
    },

    isEmpty: function() {
      //Contenteditable never is really empty
      return this.get('content').match(/^(<\/{0,1}div>|<br>|\s|&nbsp;)*?$/) !== null;
    },

    updateLastEdited: function() {
        this.set('lastEdited', new Date().getTime());
    },

    updateTitle: function() {
      //Title is the first not empty line of the content
      var title = this.get('content')
        .match(/^(<div>|<\/div>|<br>|\s|&nbsp;)*(.*?)(<div>|<\/div>|<br>|$)/)[2]
        .replace(/&nbsp;/gi,'');
      this.set('title', title);
    },

    resetColor: function() {
      this.set('color', '1');
    },

    calculateColor: function() {
//Time passed since last this document was edited the last time in milliseconds
      var diff = (new Date().getTime() - this.get('lastEdited'));
      //The older the document the smaller the opacity
      //but the opacity is allway between 0.1 and 1
      //For documents older than 2 Weeks the opacity won't change anymore
      var limit = 14 * 86400000;
      var opacity = diff > limit ? 0.1 : Math.round( (0.1 + ((limit - diff) / limit) * 0.9) * 100 ) / 100;
      this.save('color', opacity);
    }

  });


  return Doc;
});
