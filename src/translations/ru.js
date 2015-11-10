function plural(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
    
module.exports = {
  emptyDoc: 'Пишите …',
  search:   'Искать …',
  footer:   'пишите с легкостью. код открыт',
  share:    'Поделиться',
  open:     'открыть',
  modified: 'изменен',
  welcome:  require('./welcome-ru.txt'),
  secondAgo:   function ()  { return 'секунду назад'     ; },
  secondsAgo:  function (x) { return x + ' seconds ago' ; },
  minuteAgo:   function ()  { return 'минуту назад'     ; },
  minutesAgo:  function (x) { return x + ' minutes ago' ; },
  hourAgo:     function ()  { return 'час назад'      ; },
  hoursAgo:    function (x) { return x + ' hours ago'   ; },
  dayAgo:      function ()  { return 'день назад'        ; },
  daysAgo:     function (x) { return x + ' days ago'    ; },
  monthAgo:    function ()  { return 'месяц назад'      ; },
  monthsAgo:   function (x) { return x + ' months ago'  ; },
  yearAgo:     function ()  { return 'год назад'       ; },
  yearsAgo:    function (x) { return x + ' years ago'   ; }
  timeAgo: function relativeTimeWithPlural(number, key) {
        var format = {
            'mm': 'минуту_минуты_минут',
            'hh': 'час_часа_часов',
            'dd': 'день_дня_дней',
            'MM': 'месяц_месяца_месяцев',
            'yy': 'год_года_лет'
        };
        if (key === 'm') {
            return 'минуту';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    }
};
