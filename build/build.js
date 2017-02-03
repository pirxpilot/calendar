require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Module dependencies.
 */

var domify = require('domify')
  , Emitter = require('emitter')
  , classes = require('classes')
  , Days = require('./days');

/**
 * Expose `Calendar`.
 */

module.exports = Calendar;

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

function Calendar(date) {
  if (!(this instanceof Calendar)) {
    return new Calendar(date);
  }

  Emitter.call(this);
  var self = this;
  this.el = domify('<div class=calendar></div>');
  this.days = new Days;
  this.el.appendChild(this.days.el);
  this.on('change', this.show.bind(this));
  this.days.on('prev', this.prev.bind(this));
  this.days.on('next', this.next.bind(this));
  this.days.on('year', this.menuChange.bind(this, 'year'));
  this.days.on('month', this.menuChange.bind(this, 'month'));
  this.show(date || new Date);
  this.days.on('change', function(date){
    self.emit('change', date);
  });
}

/**
 * Mixin emitter.
 */

Emitter(Calendar.prototype);

/**
 * Add class `name` to differentiate this
 * specific calendar for styling purposes,
 * for example `calendar.addClass('date-picker')`.
 *
 * @param {String} name
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.addClass = function(name){
  classes(this.el).add(name);
  return this;
};

/**
 * Select `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.select = function(date){
  if (this.days.validRange.valid(date)) {
    this.selected = date;
    this.days.select(date);
  }
  this.show(date);
  return this;
};

/**
 * Show `date`.
 *
 * @param {Date} date
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.show = function(date){
  this._date = date;
  this.days.show(date);
  return this;
};

/**
 * Set minimum valid date (inclusive)
 *
 * @param {Date} date
 * @api public
 */

Calendar.prototype.min = function(date) {
  this.days.validRange.min(date);
  return this;
};


/**
 * Set maximum valid date (inclusive)
 *
 * @param {Date} date
 * @api public
 */

Calendar.prototype.max = function(date) {
  this.days.validRange.max(date);
  return this;
};

/**
 * Enable a year dropdown.
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.showYearSelect = function(from, to){
  from = from || this._date.getFullYear() - 10;
  to = to || this._date.getFullYear() + 10;
  this.days.yearMenu(from, to);
  this.show(this._date);
  return this;
};

/**
 * Enable a month dropdown.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.showMonthSelect = function(){
  this.days.monthMenu();
  this.show(this._date);
  return this;
};

/**
 * Return the previous month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.prevMonth = function(){
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() - 1);
  return date;
};

/**
 * Return the next month.
 *
 * @return {Date}
 * @api private
 */

Calendar.prototype.nextMonth = function(){
  var date = new Date(this._date);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  return date;
};

/**
 * Show the prev view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.prev = function(){
  this.show(this.prevMonth());
  this.emit('view change', this.days.selectedMonth(), 'prev');
  return this;
};

/**
 * Show the next view.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.next = function(){
  this.show(this.nextMonth());
  this.emit('view change', this.days.selectedMonth(), 'next');
  return this;
};

/**
 * Switch to the year or month selected by dropdown menu.
 *
 * @return {Calendar}
 * @api public
 */

Calendar.prototype.menuChange = function(action){
  var date = this.days.selectedMonth();
  this.show(date);
  this.emit('view change', date, action);
  return this;
};

/**
 * Select locale
 *
 * @param locales A string with a BCP 47 language tag, or an array of such strings (optional)
 * @api public
 */

 Calendar.prototype.locale = function(locales) {
  this.days.setLocale(locales);
  this.days.show(this._date);
  return this;
 };

},{"./days":3,"classes":10,"domify":11,"emitter":12}],2:[function(require,module,exports){
var Bounds = require('bounds');

module.exports = DayRange;

function date(d) {
  return Array.isArray(d) ? new Date(d[0], d[1], d[2]) : d;
}

function DayRange(min, max) {
  return this.min(min).max(max);
}

Bounds(DayRange.prototype);

DayRange.prototype._compare = function(a, b) {
  return date(a).getTime() - date(b).getTime();
};

DayRange.prototype._distance = function(a, b) {
  return Math.abs(this.compare(a, b));
};

},{"bounds":7}],3:[function(require,module,exports){

/**
 * Module dependencies.
 */

var domify = require('domify')
  , Emitter = require('emitter')
  , classes = require('classes')
  , events = require('event')
  , template = require('./template.html')
  , inGroupsOf = require('in-groups-of')
  , clamp = require('./utils').clamp
  , range = require('range')
  , DayRange = require('./dayrange')
  , locale = require('./locale');

/**
 * Get days in `month` for `year`.
 *
 * @param {Number} month
 * @param {Number} year
 * @return {Number}
 * @api private
 */

function daysInMonth(month, year) {
  return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

/**
 * Check if `year` is a leap year.
 *
 * @param {Number} year
 * @return {Boolean}
 * @api private
 */

function isLeapYear(year) {
  return (0 === year % 400)
    || ((0 === year % 4) && (0 !== year % 100))
    || (0 === year);
}


/**
 * Expose `Days`.
 */

module.exports = Days;

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

function Days() {
  Emitter.call(this);
  var self = this;
  this.el = domify(template);
  classes(this.el).add('calendar-days');
  this.head = this.el.tHead;
  this.body = this.el.tBodies[0];
  this.title = this.head.querySelector('.title');
  this.select(new Date);
  this.validRange = new DayRange;
  this.locale = locale();

  // emit "day"
  events.bind(this.body, 'click', function(e){
    if (e.target.tagName !== 'A') {
      return true;
    }

    e.preventDefault();

    var el = e.target;
    var data = el.getAttribute('data-date').split('-');
    if (!self.validRange.valid(data)) {
      return false;
    }
    var year = data[0];
    var month = data[1];
    var day = data[2];
    var date = new Date(year, month, day);
    self.select(date);
    self.emit('change', date);
    return false;
  });

  // emit "prev"
  events.bind(this.el.querySelector('.prev'), 'click', function(ev){
    ev.preventDefault();

    self.emit('prev');
    return false;
  });

  // emit "next"
  events.bind(this.el.querySelector('.next'), 'click', function(ev){
    ev.preventDefault();

    self.emit('next');
    return false;
  });
}

/**
 * Mixin emitter.
 */

Emitter(Days.prototype);

/**
 * Select the given `date`.
 *
 * @param {Date} date
 * @return {Days}
 * @api public
 */

Days.prototype.select = function(date){
  this.selected = date;
  return this;
};


/**
 * Select locale
 *
 * @param A string with a BCP 47 language tag, or an array of such strings (optional)
 * @api public
 */

 Days.prototype.setLocale = function(locales) {
  this.locale = locale(locales);
  return this;
 };

/**
 * Show date selection.
 *
 * @param {Date} date
 * @api public
 */

Days.prototype.show = function(date){
  var year = date.getFullYear();
  var month = date.getMonth();
  this.showSelectedYear(year);
  this.showSelectedMonth(month);
  var subhead = this.head.querySelector('.subheading');
  if (subhead) {
    subhead.parentElement.removeChild(subhead);
  }

  this.head.insertAdjacentHTML('beforeend', this.renderHeading(this.locale.weekdaysMin));
  this.body.innerHTML = this.renderDays(date);
};

/**
 * Enable a year dropdown.
 *
 * @param {Number} from
 * @param {Number} to
 * @api public
 */

Days.prototype.yearMenu = function(from, to){
  this.selectYear = true;
  this.title.querySelector('.year').innerHTML = yearDropdown(from, to);
  var self = this;
  events.bind(this.title.querySelector('.year .calendar-select'), 'change', function(){
    self.emit('year');
    return false;
  });
};

/**
 * Enable a month dropdown.
 *
 * @api public
 */

Days.prototype.monthMenu = function(){
  this.selectMonth = true;
  this.title.querySelector('.month').innerHTML = monthDropdown(this.locale.months);
  var self = this;
  events.bind(this.title.querySelector('.month .calendar-select'), 'change', function(){
    self.emit('month');
    return false;
  });
};

/**
 * Return current year of view from title.
 *
 * @api private
 */

Days.prototype.titleYear = function(){
  if (this.selectYear) {
    return this.title.querySelector('.year .calendar-select').value;
  } else {
    return this.title.querySelector('.year').innerHTML;
  }
};

/**
 * Return current month of view from title.
 *
 * @api private
 */

Days.prototype.titleMonth = function(){
  if (this.selectMonth) {
    return this.title.querySelector('.month .calendar-select').value;
  } else {
    return this.title.querySelector('.month').innerHTML;
  }
};

/**
 * Return a date based on the field-selected month.
 *
 * @api public
 */

Days.prototype.selectedMonth = function(){
  return new Date(this.titleYear(), this.titleMonth(), 1);
};

/**
 * Render days of the week heading with
 * the given `length`, for example 2 for "Tu",
 * 3 for "Tue" etc.
 *
 * @param {String} len
 * @return {Element}
 * @api private
 */

Days.prototype.renderHeading = function(days){
  var rows = '<tr class=subheading>' + days.map(function(day){
    return '<th>' + day + '</th>';
  }).join('') + '</tr>';
  return rows;
};

/**
 * Render days for `date`.
 *
 * @param {Date} date
 * @return {Element}
 * @api private
 */

Days.prototype.renderDays = function(date){
  var rows = this.rowsFor(date);
  var html = rows.map(function(row){
    return '<tr>' + row.join('') + '</tr>';
  }).join('\n');
  return html;
};

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

Days.prototype.rowsFor = function(date){
  var selected = this.selected;
  var selectedDay = selected.getDate();
  var selectedMonth = selected.getMonth();
  var selectedYear = selected.getFullYear();
  var month = date.getMonth();
  var year = date.getFullYear();

  // calculate overflow
  var start = new Date(date);
  start.setDate(1);
  var before = start.getDay();
  var total = daysInMonth(month, year);
  var perRow = 7;
  var totalShown = perRow * Math.ceil((total + before) / perRow);
  var after = totalShown - (total + before);
  var cells = [];

  // cells before
  cells = cells.concat(cellsBefore(before, month, year, this.validRange));

  // current cells
  for (var i = 0; i < total; ++i) {
    var day = i + 1
      , select = (day == selectedDay && month == selectedMonth && year == selectedYear);
    cells.push(renderDay([year, month, day], this.validRange, select));
  }

  // after cells
  cells = cells.concat(cellsAfter(after, month, year, this.validRange));

  return inGroupsOf(cells, 7);
};

/**
 * Update view title or select input for `year`.
 *
 * @param {Number} year
 * @api private
 */

Days.prototype.showSelectedYear = function(year){
  if (this.selectYear) {
    this.title.querySelector('.year .calendar-select').value = year;
  } else {
    this.title.querySelector('.year').innerHTML = year;
  }
};

/**
 * Update view title or select input for `month`.
 *
 * @param {Number} month
 * @api private
 */

Days.prototype.showSelectedMonth = function(month) {
  if (this.selectMonth) {
    this.title.querySelector('.month .calendar-select').value = month;
  } else {
    this.title.querySelector('.month').innerHTML = this.locale.months[month];
  }
};

/**
 * Return `n` days before `month`.
 *
 * @param {Number} n
 * @param {Number} month
 * @return {Array}
 * @api private
 */

function cellsBefore(n, month, year, validRange){
  var cells = [];
  if (month === 0) --year;
  var prev = clamp(month - 1);
  var before = daysInMonth(prev, year);
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

function cellsAfter(n, month, year, validRange){
  var cells = [];
  var day = 0;
  if (month == 11) ++year;
  var next = clamp(month + 1);
  while (n--) cells.push(renderDay([year, next, ++day], validRange, false, 'next-day'));
  return cells;
}


/**
 * Day template.
 */

function renderDay(ymd, validRange, selected, style) {
  var date = 'data-date=' + ymd.join('-')
    , styles = []
    , tdClass = ''
    , aClass = '';

  if (selected) {
    tdClass = ' class="selected"';
  }
  if (style) {
    styles.push(style);
  }
  if (!validRange.valid(ymd)) {
    styles.push('invalid');
  }
  if (styles.length) {
    aClass = ' class="' + styles.join(' ') + '"';
  }


  return '<td' + tdClass + '><a ' + date + aClass + '>' + ymd[2] + '</a></td>';
}

/**
 * Year dropdown template.
 */

function yearDropdown(from, to) {
  var years = range(from, to, 'inclusive');
  var options = years.map(yearOption).join('');
  return '<select class="calendar-select">' + options + '</select>';
}

/**
 * Month dropdown template.
 */

function monthDropdown(months) {
  var options = months.map(monthOption).join('');
  return '<select class="calendar-select">' + options + '</select>';
}

/**
 * Year dropdown option template.
 */

function yearOption(year) {
  return '<option value="' + year + '">' + year + '</option>';
}

/**
 * Month dropdown option template.
 */

function monthOption(month, i) {
  return '<option value="' + i + '">' + month + '</option>';
}

},{"./dayrange":2,"./locale":4,"./template.html":5,"./utils":6,"classes":10,"domify":11,"emitter":12,"event":13,"in-groups-of":9,"range":16}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = "<table class=\"calendar-table\">\n  <thead>\n    <tr>\n      <td class=\"prev\"><a href=\"#\">←</a></td>\n      <td colspan=\"5\" class=\"title\"><span class=\"month\"></span> <span class=\"year\"></span></td>\n      <td class=\"next\"><a href=\"#\">→</a></td>\n    </tr>\n  </thead>\n  <tbody>\n  </tbody>\n</table>";

},{}],6:[function(require,module,exports){

/**
 * Clamp `month`.
 *
 * @param {Number} month
 * @return {Number}
 * @api public
 */

exports.clamp = function(month){
  if (month > 11) return 0;
  if (month < 0) return 11;
  return month;
};

},{}],7:[function(require,module,exports){
var clone;

if ('undefined' == typeof window) {
  clone = require('clone-component');
} else {
  clone = require('clone');
}

module.exports = Bounds;


function calculateReversed(self) {
  return self._min
    && self._max
    && self.before(self._max);
}

function Bounds(obj) {
  if (obj) return mixin(obj);
}

function mixin(obj) {
  for (var key in Bounds.prototype) {
    obj[key] = Bounds.prototype[key];
  }
  return obj;
}

Bounds.prototype.compare = function(fn) {
  this._compare = fn;
  return this;
};

Bounds.prototype.distance = function(fn) {
  this._distance = fn;
  return this;
};

Bounds.prototype.min = function(v) {
  if (!arguments.length) {
    return this._min;
  }
  this._min = v;
  delete this._reversed;
  return this;
};

Bounds.prototype.max = function(v) {
  if (!arguments.length) {
    return this._max;
  }
  this._max = v;
  delete this._reversed;
  return this;
};

Bounds.prototype.before = function(v) {
  return this._min && (this._compare(v, this._min) < 0);
};

Bounds.prototype.after = function(v) {
  return this._max && (this._compare(v, this._max) > 0);
};

Bounds.prototype.out = function(v) {
  return this.before(v) || this.after(v);
};

Bounds.prototype.in = function(v) {
  return !this.out(v);
};

Bounds.prototype.valid = function(v) {
  if (this.reversed()) {
    return !this.after(v) || !this.before(v);
  }
  return this.in(v);
};

Bounds.prototype.invalid = function(v) {
  return !this.valid(v);
};

Bounds.prototype.reversed = function() {
  if (this._reversed === undefined) {
    this._reversed = calculateReversed(this);
  }
  return this._reversed;
};

Bounds.prototype.restrict = function(v) {
  if (this.reversed()) {
    if(this.after(v) && this.before(v)) {
      // select closer bound
      return (this._distance(this._max, v) < this._distance(v, this._min))
        ? clone(this._max)
        : clone(this._min);
    }
    return v;
  }
  if(this.before(v)) {
    return clone(this._min);
  }
  if(this.after(v)) {
    return clone(this._max);
  }
  return v;
};

},{"clone":8,"clone-component":8}],8:[function(require,module,exports){
/**
 * Module dependencies.
 */

var type;
try {
  type = require('component-type');
} catch (_) {
  type = require('type');
}

/**
 * Module exports.
 */

module.exports = clone;

/**
 * Clones objects.
 *
 * @param {Mixed} any object
 * @api public
 */

function clone(obj){
  switch (type(obj)) {
    case 'object':
      var copy = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = clone(obj[key]);
        }
      }
      return copy;

    case 'array':
      var copy = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;

    case 'regexp':
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);

    case 'date':
      return new Date(obj.getTime());

    default: // string, number, boolean, …
      return obj;
  }
}

},{"component-type":15,"type":15}],9:[function(require,module,exports){

module.exports = function(arr, n){
  var i, ret = [];

  if (n < 1) {
    return arr;
  }

  for (i = 0; i < arr.length; i += n) {
    ret.push(arr.slice(i, i + n));
  }

  return ret;
};
},{}],10:[function(require,module,exports){
/**
 * Module dependencies.
 */

try {
  var index = require('indexof');
} catch (err) {
  var index = require('component-indexof');
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

},{"component-indexof":14,"indexof":14}],11:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return document.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = document.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],12:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],13:[function(require,module,exports){
var bind, unbind, prefix;

function detect () {
  bind = window.addEventListener ? 'addEventListener' : 'attachEvent';
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
  prefix = bind !== 'addEventListener' ? 'on' : '';
}

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (!bind) detect();
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (!unbind) detect();
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};

},{}],14:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],15:[function(require,module,exports){
/**
 * toString ref.
 */

var toString = Object.prototype.toString;

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = function(val){
  switch (toString.call(val)) {
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
    case '[object Error]': return 'error';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'nan';
  if (val && val.nodeType === 1) return 'element';

  if (isBuffer(val)) return 'buffer';

  val = val.valueOf
    ? val.valueOf()
    : Object.prototype.valueOf.apply(val);

  return typeof val;
};

// code borrowed from https://github.com/feross/is-buffer/blob/master/index.js
function isBuffer(obj) {
  return !!(obj != null &&
    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
      (obj.constructor &&
      typeof obj.constructor.isBuffer === 'function' &&
      obj.constructor.isBuffer(obj))
    ))
}

},{}],16:[function(require,module,exports){

module.exports = function(from, to, inclusive){
  var ret = [];
  if (inclusive) to++;

  for (var n = from; n < to; ++n) {
    ret.push(n);
  }

  return ret;
}
},{}],"calendar":[function(require,module,exports){

module.exports = require('./lib/calendar');
},{"./lib/calendar":1}]},{},[]);
