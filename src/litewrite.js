define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var Doc = require('models/doc');
  var Docs = require('collections/docs');
  var settings = require('models/settings');
  var FastClick = require('../lib/fastclick');


  function Litewrite() {

    this.doc = new Doc()
      .on('change:id', updateSettingsDocId)
      .on('change:id', this.handlePrevious, this)
      .on('change:id', setUrl)
      .on('change:title', setWindowTitle)
      .on('change', this.updateDocs, this);

    this.docs = new Docs()
      .on('add', this.open, this)
      .on('change:uri', setUrl);

    $.when( settings.loading, this.docs.loading )
      .done( _.bind(this.loadCache, this) );

    new AppView({ app: this, collection: this.docs });
    new FastClick(document.body);

  }

  _.extend(Litewrite.prototype, Backbone.Events, {

    loadCache: function() {
      this.open( settings.get('openDocId') );
      this.trigger('ready');
    },

    open: function(doc) {
      if (!doc.toJSON) doc = this.docs.get(doc) || this.docs.first();
      this.doc.set( doc.toJSON() );
    },

    handlePrevious: function(doc) {
      var previous = this.docs.get( doc.previous('id') );
      if (previous) previous.isEmpty() ? previous.destroy() : previous.save();
    },

    updateDocs: function(doc) {
      this.docs.get(doc.id).set( doc.toJSON() ); // TODO: backbone 1.0 - docs.set( doc.toJSON() )
    }

  });



  function setWindowTitle(doc) {
    document.title = doc.get('title') || 'Litewrite';
  }

  function updateSettingsDocId(doc) {
    settings.save('openDocId', doc.id);
  }

  function setUrl(doc) {
    Backbone.history.navigate('!' + doc.get('uri'));
  }



  return Litewrite;

});
