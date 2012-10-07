define(function(require) {

  var Backbone = require('backbone');


  //toggle a boolean attribute of the model
  Backbone.Model.prototype.toggle = function(attr, options) {
    var data = {};
    data[attr] = !this.get(attr);
    this.set(data, options);
    return this;
  };


});