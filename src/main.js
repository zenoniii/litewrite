(function() {

// this way we can prevent remotestorage from stealing the url hash
var originalHash = window.location.hash;


require(['litewrite', 'router'], function(Litewrite, Router) {

  var litewrite = new Litewrite()
    .on('ready', startHistory);


  new Router({ litewrite: litewrite });


  function startHistory() {
    window.location.hash = originalHash;
    Backbone.history.start();
  }


});


})();
