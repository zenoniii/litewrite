define(function(require) {

  var $ = require('jquery');


  var cache = {
    openDoc: undefined,
    loading: $.Deferred(),
    isMac: /Mac/.test(navigator.platform),
    isMobile: matchMedia('(max-width:720px)').matches
  };


  return cache;
});