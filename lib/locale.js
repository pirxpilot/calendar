module.exports = locale;

/**
 * Default locale - en
 */

var LOCALE_EN = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_')
};

function locale(locales) {
  return 'Intl' in window
    ? { months: months(locales), weekdaysMin: weekdays(locales) }
    : LOCALE_EN;
}

function months(locales) {
  var format = Intl.DateTimeFormat(locales, { month: 'long' });
  var date = new Date(2016, 0, 15);
  var names = [];
  for (var i = 0; i < 12; i++) {
    date.setMonth(i);
    names.push(format.format(date));
  }
  return names;
}

function weekdays(locales) {
  var format = Intl.DateTimeFormat(locales, { weekday: 'narrow' });
  var date = new Date(2016, 0, 10); // Sunday
  var names = [];
  for (var i = 0; i < 7; i++) {
    names.push(format.format(date));
    date.setDate(date.getDate() + 1);
  }
  return names;
}
