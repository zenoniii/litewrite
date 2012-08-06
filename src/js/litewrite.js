define(function(require) {

  var AppView = require('views/app');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');

  function setOpenDoc() {
    cache.openDoc = docs.get( settings.get('openDocId') );
  }

  function setWindowTitle() {
    document.title = 'Litewrite: ' + cache.openDoc.get('title');
  }

  function litewrite() {

    setOpenDoc();

    settings.on('change:openDocId', function() {
      setOpenDoc();
      setWindowTitle();

      var previousDoc = docs.get(settings.previous('openDocId'));
      previousDoc.save( 'content', $.trim(previousDoc.get('content')) );
      if ( _.isEmpty(previousDoc.get('content')) ) {
        previousDoc.destroy();
      }
    });

    docs.on('change:title', setWindowTitle);
    setWindowTitle();

    docs.on('add', function(doc) {
      settings.save('openDocId', doc.id);
    });


    //Load on DOM-ready
    $(function() {
      new AppView();
    });

  }


  return litewrite;
});
