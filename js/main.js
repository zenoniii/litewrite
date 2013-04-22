require.config( {
  deps: [
    'libs/matchMedia'
  ],
  paths: {
    text: 'libs/require.text',
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min', 'libs/jquery.min'],
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
