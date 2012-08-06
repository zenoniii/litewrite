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

    //specify all models in the config for easy dependency injection
    appView: 'views/app',
    editorView: 'views/editor',
    entriesView: 'views/entries',
    settings: 'models/settings',
    docModel: 'models/doc',
    docs: 'collections/docs',
    cache: 'utils/cache',
    customizations: 'utils/customizations'
  },
  baseUrl: 'js'
});

require(['litewrite', 'customizations'], function(litewrite) {
  litewrite();
});