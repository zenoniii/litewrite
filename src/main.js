require.config( {
  deps: [
    '../lib/matchMedia'
  ],
  paths: {
    text: '../lib/require.text',
    jquery: '../lib/jquery.min',
    underscore: '../lib/underscore',
    backbone: '../lib/backbone',
    localstorage: '../lib/backbone.localstorage',
    remotestorage: '../lib/remotestorage.min',
    'remotestorage-documents': '../lib/remotestorage-documents'
  },
  baseUrl: 'src'
});

require(['litewrite', '../lib/fastclick'], function(litewrite) {
  litewrite();
});
