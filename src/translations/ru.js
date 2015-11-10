module.exports = {
  emptyDoc: 'Пишите …',
  search:   'Искать …',
  footer:   'пишите с легкостью. код открыт',
  share:    'Поделиться',
  open:     'открыть',
  modified: 'изменен',
  welcome:  require('./welcome-ru.txt'),
  secondsAgo: function (x) {
    if (x === 1) return 'a second ago';
    return x + ' seconds ago';
  },
  minutesAgo: function (x) {
    if (x === 1) return 'минуту';
    return timeAgoWithPlural('минуту_минуты_минут' , x);
  },
  hoursAgo: function (x) {
    return timeAgoWithPlural('час_часа_часов', x);
  },
  daysAgo: function (x) {
    return timeAgoWithPlural('день_дня_дней', x);
  },
  monthsAgo: function (x) {
    return timeAgoWithPlural('месяц_месяца_месяцев', x);
  },
  yearsAgo: function (x) {
    return timeAgoWithPlural('год_года_лет', x);
  }
};

function timeAgoWithPlural(word, number) {
  return number + ' ' + plural(word, +number);
}

function plural(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
