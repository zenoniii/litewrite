// set language for momentjs
var moment = require('moment');
var lang = (navigator.language || navigator.browserLanguage).slice(0, 2);
moment.locale(lang);


var translations = {

  en: {
      emptyDoc: 'Write …',
      search: 'Search …',
      footer: 'write lite, open source',
      share: 'share',
      open: 'open',
      modified: 'modified',
      welcome: require('./welcome.txt')
  },

  fr: {
      emptyDoc: 'Écrire …',
      search: 'Rechercher …',
      footer: 'Ecrivez léger, écrivez libre !',
      share: 'Partagez',
      open: 'ouvrir',
      modified: 'modifier',
      welcome: require('./welcome-fr.txt')
  },

  ru: {
      emptyDoc: 'Пишите …',
      search: 'Искать …',
      footer: 'пишите с легкостью. код открыт',
      share: 'Поделиться',
      open: 'открыть',
      modified: 'изменен',
      welcome: require('./welcome-ru.txt')
  },

  de: {
      emptyDoc: 'Schreibe etwas …',
      search: 'Suchen …',
      footer: 'write lite, open source',
      share: 'teilen',
      open: 'öffnen',
      modified: 'zuletzt bearbeitet',
      welcome: require('./welcome-de.txt')
  }

};


module.exports = translations[lang] || translations.en;
