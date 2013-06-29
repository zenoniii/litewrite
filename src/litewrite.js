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
      .on('change:openDocId', changeDoc)
      .on('change:openDocId', setWindowTitle)
      .on('change:openDocId', router.setUrl, router)
      .on('change:openDocId', docs.deleteEmpty, docs);

    docs
      .on('change:title', setWindowTitle)
      .on('change:uri', router.setUrl, router)
      .on('add', updateOpenDocId);

    $.when(settings.loading, docs.loading).done(loadCache);
    cache.loading.done(setWindowTitle, startHistory);

    new AppView();
    new FastClick(document.body);

  }


  function loadCache() {
    changeDoc();
    cache.loading.resolve();
  }

  function changeDoc() {
    var previous = cache.openDoc;
    if (previous) previous.isEmpty() ? previous.destroy() : previous.save();
    cache.openDoc = docs.get( settings.get('openDocId') ) || docs.first();
  }

  function setWindowTitle() {
    document.title = cache.openDoc.get('title') || 'Litewrite';
  }

  function updateOpenDocId(doc) {
    settings.save('openDocId', doc.id);
  }

  function startHistory() {
    Backbone.history.start();
  }


  return litewrite;
});
