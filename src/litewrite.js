define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var Doc = require('models/doc');
  var Docs = require('collections/docs');
  var State = require('models/state');
  var FastClick = require('../lib/fastclick');


  function Litewrite() {

    this.state = new State();

    this.doc = new Doc()
      .on('change:id', this.updateState, this)
      .on('change:id', this.handlePrevious, this)
      .on('change:id', setUrl)
      .on('change:title', setWindowTitle)
      .on('change', this.updateDocs, this);

    this.docs = new Docs()
      .on('add', this.open, this)
      .on('change:uri', setUrl);

    this.state.fetch();
    this.docs.fetch();

    this.state.loading.done(_.bind(function () {
      this.state.on('change:openDocId', this.docs.ensureOrder, this.docs);
    }, this));

    $.when( this.state.loading, this.docs.loading )
      .done( _.bind(this.loadCache, this) );

    new AppView({ app: this, collection: this.docs });
    new FastClick(document.body);

  }

  _.extend(Litewrite.prototype, Backbone.Events, {

    loadCache: function() {
      this.open( this.state.get('openDocId') );
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
    },

    updateState: function(doc) {
      this.state.save('openDocId', doc.id);
    }

  });



  function setWindowTitle(doc) {
    document.title = doc.get('title') || 'Litewrite';
  }

  function setUrl(doc) {
    Backbone.history.navigate('!' + doc.get('uri'));
  }



  return Litewrite;

});
