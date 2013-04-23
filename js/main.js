require.config( {
  deps: [
    'libs/matchMedia'
  ],
  paths: {
    text: 'libs/require.text',
    jquery: 'libs/jquery.min',
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    localstorage: 'libs/backbone.localstorage',
    remotestorage: 'libs/remotestorage.min',
    'remotestorage-documents': 'libs/remotestorage-documents'
  },
  baseUrl: 'js'
});

require(['litewrite', 'libs/fastclick'], function(litewrite) {
  litewrite();
});
