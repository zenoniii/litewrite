define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var Doc = require('models/doc');
  var docs = require('collections/docs');
  var settings = require('models/settings');
  var FastClick = require('../lib/fastclick');


  function Litewrite() {

    this.doc = new Doc()
      .on('change:id', updateSettingsDocId)
      .on('change:id', handlePrevious)
      .on('change:id', setUrl)
      .on('change:title', setWindowTitle)
      .on('change', updateDocs);

    docs
      .on('add', this.open, this)
      .on('change:uri', setUrl);

    $.when(settings.loading, docs.loading)
      .done( _.bind(this.loadCache, this) );

    new AppView({ app: this });
    new FastClick(document.body);

  }

  _.extend(Litewrite.prototype, Backbone.Events, {

    loadCache: function() {
      this.open( settings.get('openDocId') );
      this.trigger('ready');
    },

    open: function(doc) {
      if (!doc.toJSON) doc = docs.get(doc) || docs.first();
      this.doc.set( doc.toJSON() );
    }

  });


  function handlePrevious(doc) {
    var previous = docs.get( doc.previous('id') );
    if (previous) previous.isEmpty() ? previous.destroy() : previous.save();
  }

  function setWindowTitle(doc) {
    document.title = doc.get('title') || 'Litewrite';
  }

  function updateSettingsDocId(doc) {
    settings.save('openDocId', doc.id);
  }

  function setUrl(doc) {
    Backbone.history.navigate('!' + doc.get('uri'));
  }

  function updateDocs(doc) {
    docs.get(doc.id).set( doc.toJSON() ); // TODO: backbone 1.0 - docs.set( doc.toJSON() )
  }



  return Litewrite;

});
