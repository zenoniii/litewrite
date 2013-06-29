define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');
  var router = require('utils/router');


  function litewrite() {

    settings
      .on('change:openDocId', saveDocAndChange)
      .on('change:openDocId', setWindowTitle)
      .on('change:openDocId', router.setUrl, router)
      .on('change:openDocId', docs.deleteEmpty, docs);

    docs
      .on('change:title', router.setUrl, router)
      .on('change:title', setWindowTitle)
      .on('add', updateOpenDocId);

    $.when(settings.loading, docs.loading)
      .done(loadCache);

    cache.loading.done(setWindowTitle, startHistory);

    new AppView();
    new FastClick(document.body);

  }



  function loadCache() {
    ensureOpenDocId();
    setOpenDoc();
    cache.loading.resolve();
  }

  function ensureOpenDocId() {
    if ( _.isUndefined(settings.get('openDocId')) ) {
      settings.save('openDocId', docs.first().id);
    }
  }

  function saveDocAndChange() {
    if (cache.openDoc) cache.openDoc.save();
    setOpenDoc();
  }

  function setOpenDoc() {
    console.log('set open doc');
    cache.openDoc = docs.get( settings.get('openDocId') );
  }

  function setWindowTitle() {
    document.title = (
      cache.openDoc ? cache.openDoc.get('title') : null
    ) || 'Litewrite';
  }

  function updateOpenDocId(doc) {
    settings.save('openDocId', doc.id);
  }

  function startHistory() {
    Backbone.history.start();
  }


  return litewrite;
});
