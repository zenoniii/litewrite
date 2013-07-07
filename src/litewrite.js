define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var Doc = require('models/doc');
  var Docs = require('collections/docs');
  var State = require('models/state');
  var utils = require('utils');


  function Litewrite() { this.initialize(); }


  _.extend(Litewrite.prototype, Backbone.Events, {

    initialize: function() {

      _.bindAll(this);

      var state = this.state = new State();
      var doc = this.doc = new Doc();
      var docs = this.docs = new Docs();

      doc
        .on('change:content', doc.updateLastEdited)
        .on('change:content', doc.updateTitle)
        .on('change:id', this.updateState)
        .on('change:id', this.handlePrevious)
        .on('change:title', this.setWindowTitle)
        .on('change:title', this.updateUri)
        .on('change:uri', this.setUrl)
        .on('change', this.updateDocs);

      docs
        .on('add', this.open)
        .on('fetch', this.setDoc);

      $.when( state.fetch(), docs.fetch() ).then( this.loadDoc );

      new AppView({ app: this, collection: docs });

    },

    loadDoc: function() {
      this.setDoc();
      this.trigger('ready');
    },

    setDoc: function () {
      this.open( this.state.get('openDocId') );
    },

    open: function(doc) {
      if ( !doc.toJSON ) doc = this.docs.get(doc) || this.docs.first();
      this.doc.set( doc.toJSON() );
    },

    handlePrevious: function(doc) {
      var previous = this.docs.get( doc.previous('id') );
      if (previous) previous.isEmpty() ? previous.destroy() : previous.save();
    },

    updateDocs: function(doc) {
      // TODO: backbone 1.0 - this.docs.set( doc.toJSON(), { remove: false } );
      this.docs.get(doc.id).set( doc.toJSON() );
    },

    updateState: function(doc) {
      this.state.save( 'openDocId', doc.id );
    },

    // TODO: URIs aren't unique right now:
    // * create 'doc', 'doc-2', 'doc-3'
    // * delete 'doc-2'
    // * create a new document with title 'doc'
    // * litewrite counts 3 docs ('doc', 'doc-3' and the new one)
    // * new name is 'doc-3' again
    updateUri: function(doc) {
      var uri = encodeURI(doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-'));
      if (uri.length < 1) return doc.set('uri', '');
      var match = new RegExp( '^' + utils.escapeRegExp(uri) + '(-[0-9]|$)' );
      var len = this.docs.filter(function(doc) {
        return match.test( doc.get('uri') );
      }).length;
      if (len) uri += '-' + len;
      doc.set( 'uri', uri );
    },

    setWindowTitle: function(doc) {
      document.title = doc.get('title') || 'Litewrite';
    },

    setUrl: function(doc) {
      Backbone.history.navigate('!' + doc.get('uri'));
    }

  });



  return Litewrite;

});
