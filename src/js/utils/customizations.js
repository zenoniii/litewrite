define(function(require) {

  var Backbone = require('backbone');


  Backbone.Model.prototype.toggle = function(attr, options) {
    var data = {};
    data[attr] = !this.get(attr);
    this.save(data, options);
    return this;
  };


});