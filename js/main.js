require.config( {
  deps: [
    'utils/log'
  ],
  paths: {
    text: 'lib/require.text',
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min', 'lib/jquery.min'],
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    localstorage: 'lib/backbone.localstorage'
  },
  baseUrl: 'js'
});

require(['litewrite', 'utils/customizations'], function(litewrite) {
  litewrite();
});