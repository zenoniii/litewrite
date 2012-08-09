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
    localstorage: 'lib/backbone.localstorage'
  },
  baseUrl: 'js'
});

require(['litewrite', 'utils/customizations'], function(litewrite) {
  litewrite();
});