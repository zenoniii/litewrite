define(function(require) {


  var utils = {
    isMac: /Mac/.test(navigator.platform),
    isMobile: matchMedia('(max-width:720px)').matches
  };

  utils.modKey = utils.isMac ? { name: 'ctrlKey', code: 17 } : { name: 'altKey', code: 18 };


  return utils;
});
