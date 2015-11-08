var lang = (navigator.language || navigator.browserLanguage).slice(0, 2);

var translations = {

  en: {
      emptyDoc: 'Write …',
      search:   'Search …',
      footer:   'write lite, open source',
      share:    'share',
      open:     'open',
      modified: 'modified',
      welcome:  require('./welcome.txt'),
      secondAgo:   function (x) { return x + ' second ago'; },
      secondsAgo:  function (x) { return x + ' seconds ago'; },
      minuteAgo:   function (x) { return x + ' minute ago'; },
      minutesAgo:  function (x) { return x + ' minutes ago'; },
      hourAgo:     function (x) { return x + ' hour ago'; },
      hoursAgo:    function (x) { return x + ' hours ago'; },
      dayAgo:      function (x) { return x + ' day ago'; },
      daysAgo:     function (x) { return x + ' days ago'; },
      monthAgo:    function (x) { return x + ' month ago'; },
      monthsAgo:   function (x) { return x + ' months ago'; },
      yearAgo:     function (x) { return x + ' year ago'; },
      yearsAgo:    function (x) { return x + ' years ago'; }
  },

  fr: {
      emptyDoc: 'Écrire …',
      search:   'Rechercher …',
      footer:   'Ecrivez léger, écrivez libre !',
      share:    'Partagez',
      open:     'ouvrir',
      modified: 'modifier',
      welcome:  require('./welcome-fr.txt'),
      secondAgo:   function (x) { return x + ' second ago'; },
      secondsAgo:  function (x) { return x + ' seconds ago'; },
      minuteAgo:   function (x) { return x + ' minute ago'; },
      minutesAgo:  function (x) { return x + ' minutes ago'; },
      hourAgo:     function (x) { return x + ' hour ago'; },
      hoursAgo:    function (x) { return x + ' hours ago'; },
      dayAgo:      function (x) { return x + ' day ago'; },
      daysAgo:     function (x) { return x + ' days ago'; },
      monthAgo:    function (x) { return x + ' month ago'; },
      monthsAgo:   function (x) { return x + ' months ago'; },
      yearAgo:     function (x) { return x + ' year ago'; },
      yearsAgo:    function (x) { return x + ' years ago'; }
  },

  ru: {
      emptyDoc: 'Пишите …',
      search:   'Искать …',
      footer:   'пишите с легкостью. код открыт',
      share:    'Поделиться',
      open:     'открыть',
      modified: 'изменен',
      welcome:  require('./welcome-ru.txt'),
      secondAgo:   function (x) { return x + ' second ago'; },
      secondsAgo:  function (x) { return x + ' seconds ago'; },
      minuteAgo:   function (x) { return x + ' minute ago'; },
      minutesAgo:  function (x) { return x + ' minutes ago'; },
      hourAgo:     function (x) { return x + ' hour ago'; },
      hoursAgo:    function (x) { return x + ' hours ago'; },
      dayAgo:      function (x) { return x + ' day ago'; },
      daysAgo:     function (x) { return x + ' days ago'; },
      monthAgo:    function (x) { return x + ' month ago'; },
      monthsAgo:   function (x) { return x + ' months ago'; },
      yearAgo:     function (x) { return x + ' year ago'; },
      yearsAgo:    function (x) { return x + ' years ago'; }
  },

  de: {
      emptyDoc: 'Schreibe etwas …',
      search:   'Suchen …',
      footer:   'write lite, open source',
      share:    'teilen',
      open:     'öffnen',
      modified: 'zuletzt bearbeitet',
      welcome:  require('./welcome-de.txt'),
      secondAgo:   function (x) { return 'vor ' + x + ' Sekunde'; },
      secondsAgo:  function (x) { return 'vor ' + x + ' Sekunden'; },
      minuteAgo:   function (x) { return 'vor ' + x + ' Minute'; },
      minutesAgo:  function (x) { return 'vor ' + x + ' Minuten'; },
      hourAgo:     function (x) { return 'vor ' + x + ' Stunde'; },
      hoursAgo:    function (x) { return 'vor ' + x + ' Stunden'; },
      dayAgo:      function (x) { return 'vor ' + x + ' Tag'; },
      daysAgo:     function (x) { return 'vor ' + x + ' Tagen'; },
      monthAgo:    function (x) { return 'vor ' + x + ' Monat'; },
      monthsAgo:   function (x) { return 'vor ' + x + ' Monaten'; },
      yearAgo:     function (x) { return 'vor ' + x + ' Jahr'; },
      yearsAgo:    function (x) { return 'vor ' + x + ' Jahren'; }
  }

};


module.exports = translations[lang] || translations.en;
