require('match-media');
require('window.requestanimationframe');
var remoteStorage = require('remotestorage');
window.remoteStorage = remoteStorage;
require('remotestorage-documents');
window.$ = require('jquery');
window.Backbone = require('backbone');
var Litewrite = require('./litewrite');
var Router = require('./router');

// this way we can prevent remotestorage from stealing the url hash
var originalHash = window.location.hash;


var litewrite = new Litewrite()
  .on('ready', startHistory);


new Router({ litewrite: litewrite });


function startHistory() {
  window.location.hash = originalHash;
  Backbone.history.start();
}
