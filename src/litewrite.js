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

      _.bindAll(this, 'loadDoc', 'setDoc', 'open', 'handlePrevious', 'updateDocs', 'updateState', 'updateUri');

      this.state = new State();
      this.doc = new Doc();
      this.docs = new Docs();

      this.doc
        .on('change:content', this.doc.updateLastEdited)
        .on('change:content', this.doc.updateTitle)
        .on('change:id', this.handlePrevious)
        .on('change:title', this.setWindowTitle)
        .on('change:title', this.updateUri)
        .on('change:uri', this.setUrl)
        .on('change', this.updateDocs);


      $.when( this.state.fetch(), this.docs.fetch() ).then( this.loadDoc );

      new AppView({ app: this, collection: this.docs });

    },

    loadDoc: function() {

      this.setDoc();

      this.doc.on('change:id', this.updateState);
      this.docs
        .on('add', this.open)
        .on('fetch', this.setDoc);

      this.trigger('ready');

    },

    // loads document from state
    setDoc: function () {
      this.open( this.state.get('openDocId') );
    },

    // open a document. either pass a Doc or an id
    open: _.throttle(function(doc) {
      if ( !_.isObject(doc) ) doc = this.docs.get(doc) || this.docs.first();
      this.doc.set( doc.toJSON() );
    }, 400, { leading: true, trailing: true }),

    // remove empty documents
    handlePrevious: function(doc) {
      var previous = this.docs.get( doc.previous('id') );
      if (previous) previous.isEmpty() ? previous.destroy() : previous.save();
    },

    updateDocs: function(doc) {
      this.docs.set( doc.toJSON(), { add: false, remove: false } );
    },

    updateState: function(doc) {
      this.state.save( 'openDocId', doc.id );
    },

    // TODO: add id to uri instead of version number. also removes the neccesity to save uri at all
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
