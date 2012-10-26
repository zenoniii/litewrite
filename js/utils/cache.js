define(function(require) {

  var $ = require('jquery');


  var cache = {
    loaded: $.Deferred()
  };


  return cache;
});