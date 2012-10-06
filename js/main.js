require.config( {
  deps: [
    //only used for development
    'utils/log'
  ],
  paths: {
    // not included in production version
    text: 'lib/require.text',

    jquery: 'utils/jquery-loader',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    localstorage: 'lib/backbone.localstorage',
    remotestorage: 'http://remotestoragejs.com/build/0.7.0-head/remoteStorage-debug',
    'remotestorage-documents': 'lib/remoteStorage-documents'
  },
  baseUrl: 'js'
});

require(['litewrite', 'utils/customizations'], function(litewrite) {
  litewrite();
});