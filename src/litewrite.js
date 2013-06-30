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
    this.initialize.apply(this, arguments);
  }

  _.extend(Litewrite.prototype, Backbone.Events, {

    initialize: function() {

      this.state = new State();

      this.doc = new Doc();
      this.doc
        .on('change:content', this.doc.updateLastEdited)
        .on('change:content', this.doc.updateTitle)
        .on('change:id', this.updateState, this)
        .on('change:id', this.handlePrevious, this)
        .on('change:title', this.setWindowTitle)
        .on('change:title', this.updateUri, this)
        .on('change:uri', this.setUrl)
        .on('change', this.updateDocs, this);

      this.docs = new Docs()
        .on('add', this.open, this);

      this.state.fetch();
      this.docs.fetch();

      $.when( this.state.loading, this.docs.loading )
        .done( _.bind(this.loadDoc, this) );

      new AppView({ app: this, collection: this.docs });
      new FastClick(document.body);

    },

    loadDoc: function() {
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
    },

    updateUri: function(doc) {
      var uri = encodeURI(doc.get('title').toLowerCase().replace(/\s|&nbsp;/g, '-'));
      if (uri.length < 1) return doc.set('uri', '');
      var len = this.docs.filter(function(doc) {
        return new RegExp('^' + escapeRegExp(uri) + '(-[0-9]|$)').test(doc.get('uri'));
      }).length;
      uri = len < 1 ? uri : uri + '-' + len;
      doc.set('uri', uri);
    },

    setWindowTitle: function(doc) {
      document.title = doc.get('title') || 'Litewrite';
    },

    setUrl: function(doc) {
      Backbone.history.navigate('!' + doc.get('uri'));
    }

  });




  // see link for more info:
  // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  }



  return Litewrite;

});
