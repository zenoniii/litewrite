define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');


  _.mixin({
    around: function(obj, method, wrapper, context) {
      obj[method] = _.wrap(
        _.bind(obj[method], obj),
        _.bind(wrapper, context ? context : this)
      );
    }
  });


  //toggle a boolean attribute of the model
  Backbone.Model.prototype.toggle = function(attr, options) {
    var data = {};
    data[attr] = !this.get(attr);
    this.set(data, options);
    return this;
  };


});