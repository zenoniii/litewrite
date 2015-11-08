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
      secondAgo:   function ()  { return 'a second ago'     ; },
      secondsAgo:  function (x) { return x + ' seconds ago' ; },
      minuteAgo:   function ()  { return 'a minute ago'     ; },
      minutesAgo:  function (x) { return x + ' minutes ago' ; },
      hourAgo:     function ()  { return 'an hour ago'      ; },
      hoursAgo:    function (x) { return x + ' hours ago'   ; },
      dayAgo:      function ()  { return 'a day ago'        ; },
      daysAgo:     function (x) { return x + ' days ago'    ; },
      monthAgo:    function ()  { return 'a month ago'      ; },
      monthsAgo:   function (x) { return x + ' months ago'  ; },
      yearAgo:     function ()  { return 'a year ago'       ; },
      yearsAgo:    function (x) { return x + ' years ago'   ; }
  },

  fr: {
      emptyDoc: 'Écrire …',
      search:   'Rechercher …',
      footer:   'Ecrivez léger, écrivez libre !',
      share:    'Partagez',
      open:     'ouvrir',
      modified: 'modifier',
      welcome:  require('./welcome-fr.txt'),
      secondAgo:   function ()  { return 'il y a une seconde'      ; },
      secondsAgo:  function (x) { return 'il y a ' + x + ' secondes' ; },
      minuteAgo:   function ()  { return 'il y a une minute'       ; },
      minutesAgo:  function (x) { return 'il y a ' + x + ' minutes'  ; },
      hourAgo:     function ()  { return 'il y a une heure'       ; },
      hoursAgo:    function (x) { return 'il y a ' + x + ' heures'  ; },
      dayAgo:      function ()  { return 'il y a un jour'          ; },
      daysAgo:     function (x) { return 'il y a ' + x + ' jours'    ; },
      monthAgo:    function ()  { return 'il y a un mois'        ; },
      monthsAgo:   function (x) { return 'il y a ' + x + ' mois'  ; },
      yearAgo:     function ()  { return 'il y a un an'         ; },
      yearsAgo:    function (x) { return 'il y a ' + x + ' ans'   ; }
  },

  ru: {
      emptyDoc: 'Пишите …',
      search:   'Искать …',
      footer:   'пишите с легкостью. код открыт',
      share:    'Поделиться',
      open:     'открыть',
      modified: 'изменен',
      welcome:  require('./welcome-ru.txt'),
      secondAgo:   function ()  { return 'a second ago'     ; },
      secondsAgo:  function (x) { return x + ' seconds ago' ; },
      minuteAgo:   function ()  { return 'a minute ago'     ; },
      minutesAgo:  function (x) { return x + ' minutes ago' ; },
      hourAgo:     function ()  { return 'an hour ago'      ; },
      hoursAgo:    function (x) { return x + ' hours ago'   ; },
      dayAgo:      function ()  { return 'a day ago'        ; },
      daysAgo:     function (x) { return x + ' days ago'    ; },
      monthAgo:    function ()  { return 'a month ago'      ; },
      monthsAgo:   function (x) { return x + ' months ago'  ; },
      yearAgo:     function ()  { return 'a year ago'       ; },
      yearsAgo:    function (x) { return x + ' years ago'   ; }
  },

  de: {
      emptyDoc: 'Schreibe etwas …',
      search:   'Suchen …',
      footer:   'write lite, open source',
      share:    'teilen',
      open:     'öffnen',
      modified: 'zuletzt bearbeitet',
      welcome:  require('./welcome-de.txt'),
      secondAgo:   function ()  { return 'vor einer Sekunde'      ; },
      secondsAgo:  function (x) { return 'vor ' + x + ' Sekunden' ; },
      minuteAgo:   function ()  { return 'vor einer Minute'       ; },
      minutesAgo:  function (x) { return 'vor ' + x + ' Minuten'  ; },
      hourAgo:     function ()  { return 'vor einer Stunde'       ; },
      hoursAgo:    function (x) { return 'vor ' + x + ' Stunden'  ; },
      dayAgo:      function ()  { return 'vor einem Tag'          ; },
      daysAgo:     function (x) { return 'vor ' + x + ' Tagen'    ; },
      monthAgo:    function ()  { return 'vor einem Monat'        ; },
      monthsAgo:   function (x) { return 'vor ' + x + ' Monaten'  ; },
      yearAgo:     function ()  { return 'vor einem Jahr'         ; },
      yearsAgo:    function (x) { return 'vor ' + x + ' Jahren'   ; }
  }

};


module.exports = translations[lang] || translations.en;
