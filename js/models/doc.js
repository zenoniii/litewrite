define(function(require) {

  var Backbone = require('backbone');


  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      content: '',
      lastEdited: undefined
    },

    initialize: function() {
      this.on('change:content', this.updateLastEdited, this);
    },

    updateLastEdited: function() {
        this.set('lastEdited', new Date().getTime());
    }

  });


  return Doc;
});