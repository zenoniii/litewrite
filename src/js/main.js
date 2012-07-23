require.config( {
  paths: {
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    localstorage: 'lib/backbone-localstorage'
  },
  baseUrl: 'js'
});

require(['jquery', 'views/app', 'models/app'], function($, AppView, AppModel) {
  $(function() {
    new AppView(new AppModel());
  });
});