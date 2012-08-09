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
      //When doc gets cloesd remove spaces and returns at the beginning
      //and remove spaces at the end of each line
      var previousContent = previousDoc.get('content').replace(/^<.*?>([^<].*?)(<\/div>|(?=<br>)|$)/, '$1');
      //Contenteditable never is really empty
      if ( !_.isNull(previousContent.match(/^(<\/{0,1}div>|<br>|\s|&nbsp;)*?$/)) || _.isEmpty(previousContent) ) {
        previousDoc.destroy();
      } else {
        previousDoc.save('content', previousContent);
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
