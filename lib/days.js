/**
 * Module dependencies.
 */

const Emitter = require('component-emitter');
const inGroupsOf = require('@pirxpilot/in-groups-of');
const range = require('range-component');

const DayRange = require('./dayrange');
const locale = require('./locale');
const template = require('./template');
const { clamp } = require('./utils');

/**
 * Get days in `month` for `year`.
 *
 * @param {Number} month
 * @param {Number} year
 * @return {Number}
 * @api private
 */

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function daysInMonth(month, year) {
  return (month === 1 && isLeapYear(year)) ? 29 : DAYS_IN_MONTH[month];
}

/**
 * Check if `year` is a leap year.
 *
 * @param {Number} year
 * @return {Boolean}
 * @api private
 */

function isLeapYear(year) {
  return (0 === year % 400) ||
    ((0 === year % 4) && (0 !== year % 100)) ||
    (0 === year);
}

function domify(template) {
  const el = document.createElement('div');
  el.innerHTML = template;
  return el.removeChild(el.firstElementChild);
}

/**
 * Initialize a new `Days` view.
 *
 * Emits:
 *
 *   - `prev` when prev link is clicked
 *   - `next` when next link is clicked
 *   - `change` (date) when a date is selected
 *
 * @api public
 */

class Days extends Emitter {
  constructor() {
    super();
    this.el = domify(template);
    this.el.classList.add('calendar-days');
    this.head = this.el.tHead;
    this.body = this.el.tBodies[0];
    this.title = this.head.querySelector('.title');
    this.select(new Date());
    this.validRange = new DayRange();
    this.locale = locale();

    // emit "day"
    this.body.addEventListener('click', e => {
      if (e.target.tagName !== 'A') {
        return;
      }

      e.preventDefault();

      const el = e.target;
      const data = el.getAttribute('data-date').split('-');
      if (!this.validRange.valid(data)) {
        return;
      }
      const [year, month, day] = data;
      const date = new Date(year, month, day);
      this.select(date);
      this.emit('change', date);
    });

    // emit "prev"
    this.el.querySelector('.prev').addEventListener('click', ev => {
      ev.preventDefault();
      this.emit('prev');
    });

    // emit "next"
    this.el.querySelector('.next').addEventListener('click', ev => {
      ev.preventDefault();
      this.emit('next');
    });
  }

  /**
   * Select the given `date`.
   *
   * @param {Date} date
   * @return {Days}
   * @api public
   */

  select(date) {
    this.selected = date;
    return this;
  }

  /**
   * Select locale
   *
   * @param A string with a BCP 47 language tag, or an array of such strings (optional)
   * @api public
   */

  setLocale(locales) {
    this.locale = locale(locales);
    return this;
  }

  /**
   * Show date selection.
   *
   * @param {Date} date
   * @api public
   */

  show(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    this.showSelectedYear(year);
    this.showSelectedMonth(month);

    const subhead = this.head.querySelector('.subheading');
    if (subhead) {
      subhead.parentElement.removeChild(subhead);
    }

    this.head.insertAdjacentHTML('beforeend', this.renderHeading(this.locale.weekdaysMin));
    this.body.innerHTML = this.renderDays(date);
  }

  /**
   * Enable a year dropdown.
   *
   * @param {Number} from
   * @param {Number} to
   * @api public
   */

  yearMenu(from, to) {
    this.selectYear = true;
    this.title.querySelector('.year').innerHTML = yearDropdown(from, to);
    this.title.querySelector('.year .calendar-select')
      .addEventListener('change', () => this.emit('year'));
  }

  /**
   * Enable a month dropdown.
   *
   * @api public
   */

  monthMenu() {
    this.selectMonth = true;
    this.title.querySelector('.month').innerHTML = monthDropdown(this.locale.months);
    this.title.querySelector('.month .calendar-select')
      .addEventListener('change', () => this.emit('month'));
  }

  /**
   * Return current year of view from title.
   *
   * @api private
   */

  titleYear() {
    return this.selectYear ?
      this.title.querySelector('.year .calendar-select').value :
      this.title.querySelector('.year').innerHTML;
  }

  /**
   * Return current month of view from title.
   *
   * @api private
   */

  titleMonth() {
    return this.selectMonth ?
      this.title.querySelector('.month .calendar-select').value :
      this.title.querySelector('.month').innerHTML;
  }

  /**
   * Return a date based on the field-selected month.
   *
   * @api public
   */

  selectedMonth() {
    return new Date(this.titleYear(), this.titleMonth(), 1);
  }

  /**
   * Render days of the week heading with
   * the given `length`, for example 2 for "Tu",
   * 3 for "Tue" etc.
   *
   * @param {String} len
   * @return {Element}
   * @api private
   */

  renderHeading(days) {
    const daysStr = days
      .map(day => `<th>${day}</th>`)
      .join('');
    return `<tr class=subheading>${daysStr}</tr>`;
  }

  /**
   * Render days for `date`.
   *
   * @param {Date} date
   * @return {Element}
   * @api private
   */

  renderDays(date) {
    return this
      .rowsFor(date)
      .map(row => `<tr>${row.join('')}</tr>`)
      .join('\n');
  }

  /**
   * Return rows array for `date`.
   *
   * This method calculates the "overflow"
   * from the previous month and into
   * the next in order to display an
   * even 5 rows.
   *
   * @param {Date} date
   * @return {Array}
   * @api private
   */

  rowsFor(date) {
    const selected = this.selected;
    const selectedDay = selected.getDate();
    const selectedMonth = selected.getMonth();
    const selectedYear = selected.getFullYear();
    const month = date.getMonth();
    const year = date.getFullYear();

    // calculate overflow
    const start = new Date(date);
    start.setDate(1);

    const before = start.getDay();
    const total = daysInMonth(month, year);
    const perRow = 7;
    const totalShown = perRow * Math.ceil((total + before) / perRow);
    const after = totalShown - (total + before);

    let cells = [];

    // cells before
    cells = cells.concat(cellsBefore(before, month, year, this.validRange));

    // current cells
    for (let i = 0; i < total; ++i) {
      const day = i + 1;
      const select = (day === selectedDay && month === selectedMonth && year === selectedYear);
      cells.push(renderDay([year, month, day], this.validRange, select));
    }

    // after cells
    cells = cells.concat(cellsAfter(after, month, year, this.validRange));

    return inGroupsOf(cells, 7);
  }

  /**
   * Update view title or select input for `year`.
   *
   * @param {Number} year
   * @api private
   */

  showSelectedYear(year) {
    if (this.selectYear) {
      this.title.querySelector('.year .calendar-select').value = year;
    } else {
      this.title.querySelector('.year').innerHTML = year;
    }
  }

  /**
   * Update view title or select input for `month`.
   *
   * @param {Number} month
   * @api private
   */

  showSelectedMonth(month) {
    if (this.selectMonth) {
      this.title.querySelector('.month .calendar-select').value = month;
    } else {
      this.title.querySelector('.month').innerHTML = this.locale.months[month];
    }
  }
}

/**
 * Expose `Days`.
 */

module.exports = Days;


/**
 * Return `n` days before `month`.
 *
 * @param {Number} n
 * @param {Number} month
 * @return {Array}
 * @api private
 */

function cellsBefore(n, month, year, validRange) {
  const cells = [];
  if (month === 0) --year;
  const prev = clamp(month - 1);
  let before = daysInMonth(prev, year);
  while (n--) cells.push(renderDay([year, prev, before--], validRange, false, 'prev-day'));
  return cells.reverse();
}

/**
 * Return `n` days after `month`.
 *
 * @param {Number} n
 * @param {Number} month
 * @return {Array}
 * @api private
 */

function cellsAfter(n, month, year, validRange) {
  const cells = [];
  let day = 0;
  if (month === 11) ++year;
  const next = clamp(month + 1);
  while (n--) cells.push(renderDay([year, next, ++day], validRange, false, 'next-day'));
  return cells;
}


/**
 * Day template.
 */

function renderDay(ymd, validRange, selected, style) {
  const date = `data-date=${ymd.join('-')}`;

  const styles = [];
  if (style) {
    styles.push(style);
  }
  if (!validRange.valid(ymd)) {
    styles.push('invalid');
  }

  const tdClass = selected ? ' class="selected"' : '';
  const aClass = styles.length ? ` class="${styles.join(' ')}"` : '';

  return `<td${tdClass}><a ${date}${aClass}>${ymd[2]}</a></td>`;
}

/**
 * Year dropdown template.
 */

function yearDropdown(from, to) {
  const years = range(from, to, 'inclusive');
  const options = years.map(yearOption).join('');
  return `<select class="calendar-select">${options}</select>`;
}

/**
 * Month dropdown template.
 */

function monthDropdown(months) {
  const options = months.map(monthOption).join('');
  return `<select class="calendar-select">${options}</select>`;
}

/**
 * Year dropdown option template.
 */

function yearOption(year) {
  return `<option value="${year}">${year}</option>`;
}

/**
 * Month dropdown option template.
 */

function monthOption(month, i) {
  return `<option value="${i}">${month}</option>`;
}
