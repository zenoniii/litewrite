define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');


  //toggle a boolean attribute of the model
  Backbone.Model.prototype.toggle = function(attr, options) {
    var data = {};
    data[attr] = !this.get(attr);
    this.save(data, options);
    return this;
  };

  var save = _.throttle(function(model) {
    model.save();
  }, 500);

  Backbone.Model.prototype.put = function(key, val) {
    this.set(key, val);
    save(this);
  };


});