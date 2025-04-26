module.exports = locale;

/**
 * Default locale - en
 */

const LOCALE_EN = {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_')
};

function locale(locales) {
  return 'Intl' in window ? { months: months(locales), weekdaysMin: weekdays(locales) } : LOCALE_EN;
}

function months(locales) {
  const format = Intl.DateTimeFormat(locales, { month: 'long' });
  const date = new Date(2016, 0, 15); // January
  const names = [];

  // from January till December
  for (let i = 0; i < 12; i++) {
    date.setMonth(i);
    names.push(format.format(date));
  }

  return names;
}

function weekdays(locales) {
  const format = Intl.DateTimeFormat(locales, { weekday: 'narrow' });
  const date = new Date(2016, 0, 10); // Sunday
  const names = [];

  // from 2016-01-10 to 2016-01-17 - Sunday to Saturday
  for (let i = 10; i < 18; i++) {
    date.setDate(i);
    names.push(format.format(date));
  }

  return names;
}
