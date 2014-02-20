define(function(require) {

  // set language for momentjs
  var moment = require('moment');
  moment.lang((navigator.language || navigator.browserLanguage).slice(0, 2));


  return {

    root: {
        emptyDoc: 'Write …',
        search: 'Search …',
        footer: 'write lite, open source',
        share: 'share',
        modified: 'modified',
        welcome: require('text!templates/welcome.txt')
    },

    fr: {
        emptyDoc: 'Écrire …',
        search: 'Search …',
        footer: 'write lite, open source',
        share: 'Partagez',
        modified: 'modified',
        welcome: require('text!templates/welcome-fr.txt')
    },

    ru: {
        emptyDoc: 'Пишите …',
        search: 'Искать …',
        footer: 'пишите с легкостью. код открыт',
        share: 'Поделиться',
        modified: 'изменен',
        welcome: require('text!templates/welcome-ru.txt')
    },

    de: {
        emptyDoc: 'Schreibe etwas …',
        search: 'Suchen …',
        footer: 'write lite, open source',
        share: 'teilen',
        modified: 'zuletzt bearbeitet',
        welcome: require('text!templates/welcome-de.txt')
    }

  };

});
