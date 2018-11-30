/**
 * Module dependencies.
 */

const Emitter = require('component-emitter');

const Days = require('./days');

/**
 * Initialize a new `Calendar`
 * with the given `date` defaulting
 * to now.
 *
 * Events:
 *
 *  - `prev` when the prev link is clicked
 *  - `next` when the next link is clicked
 *  - `change` (date) when the selected date is modified
 *
 * @params {Date} date
 * @api public
 */

class Calendar extends Emitter {
  static of(...args) {
    return new Calendar(...args);
  }

  constructor(date = new Date()) {
    super();
    this.el = document.createElement('div');
    this.el.className = 'calendar';

    this.days = new Days();
    this.el.appendChild(this.days.el);

    this.on('change', date => this.show(date));

    this.days.on('prev', () => this.prev());
    this.days.on('next', () => this.next());

    this.days.on('year', () => this.menuChange('year'));
    this.days.on('month', () => this.menuChange('month'));

    this.show(date);

    this.days.on('change', date => this.emit('change', date));
  }

  /**
   * Add class `name` to differentiate this
   * specific calendar for styling purposes,
   * for example `calendar.addClass('date-picker')`.
   *
   * @param {String} name
   * @return {Calendar}
   * @api public
   */

  addClass(name) {
    this.el.classList.add(name);
    return this;
  }

  /**
   * Select `date`.
   *
   * @param {Date} date
   * @return {Calendar}
   * @api public
   */

  select(date) {
    if (this.days.validRange.valid(date)) {
      this.selected = date;
      this.days.select(date);
    }
    this.show(date);
    return this;
  }

  /**
   * Show `date`.
   *
   * @param {Date} date
   * @return {Calendar}
   * @api public
   */

  show(date) {
    this._date = date;
    this.days.show(date);
    return this;
  }

  /**
   * Set minimum valid date (inclusive)
   *
   * @param {Date} date
   * @api public
   */

  min(date) {
    this.days.validRange.min(date);
    return this;
  }

  /**
   * Set maximum valid date (inclusive)
   *
   * @param {Date} date
   * @api public
   */

  max(date) {
    this.days.validRange.max(date);
    return this;
  }

  /**
   * Enable a year dropdown.
   *
   * @param {Number} from
   * @param {Number} to
   * @return {Calendar}
   * @api public
   */

  showYearSelect(
    from = this._date.getFullYear() - 10,
    to = this._date.getFullYear() + 10
  ) {
    this.days.yearMenu(from, to);
    this.show(this._date);
    return this;
  }

  /**
   * Enable a month dropdown.
   *
   * @return {Calendar}
   * @api public
   */

  showMonthSelect() {
    this.days.monthMenu();
    this.show(this._date);
    return this;
  }

  /**
   * Return the previous month.
   *
   * @return {Date}
   * @api private
   */

  prevMonth() {
    const date = new Date(this._date);
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  /**
   * Return the next month.
   *
   * @return {Date}
   * @api private
   */

  nextMonth() {
    const date = new Date(this._date);
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  /**
   * Show the prev view.
   *
   * @return {Calendar}
   * @api public
   */

  prev() {
    this.show(this.prevMonth());
    this.emit('view change', this.days.selectedMonth(), 'prev');
    return this;
  }

  /**
   * Show the next view.
   *
   * @return {Calendar}
   * @api public
   */

  next() {
    this.show(this.nextMonth());
    this.emit('view change', this.days.selectedMonth(), 'next');
    return this;
  }

  /**
   * Switch to the year or month selected by dropdown menu.
   *
   * @return {Calendar}
   * @api public
   */

  menuChange(action) {
    const date = this.days.selectedMonth();
    this.show(date);
    this.emit('view change', date, action);
    return this;
  }

  /**
   * Select locale
   *
   * @param locales A string with a BCP 47 language tag, or an array of such strings (optional)
   * @api public
   */

  locale(locales) {
   this.days.setLocale(locales);
   this.days.show(this._date);
   return this;
  }
}

/**
 * Expose `Calendar`.
 */
module.exports = Calendar;
