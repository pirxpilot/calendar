var calendar = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/component-emitter/index.js
  var require_component_emitter = __commonJS({
    "node_modules/component-emitter/index.js"(exports, module) {
      if (typeof module !== "undefined") {
        module.exports = Emitter3;
      }
      function Emitter3(obj) {
        if (obj)
          return mixin(obj);
      }
      function mixin(obj) {
        for (var key in Emitter3.prototype) {
          obj[key] = Emitter3.prototype[key];
        }
        return obj;
      }
      Emitter3.prototype.on = Emitter3.prototype.addEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
        return this;
      };
      Emitter3.prototype.once = function(event, fn) {
        function on() {
          this.off(event, on);
          fn.apply(this, arguments);
        }
        on.fn = fn;
        this.on(event, on);
        return this;
      };
      Emitter3.prototype.off = Emitter3.prototype.removeListener = Emitter3.prototype.removeAllListeners = Emitter3.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        if (0 == arguments.length) {
          this._callbacks = {};
          return this;
        }
        var callbacks = this._callbacks["$" + event];
        if (!callbacks)
          return this;
        if (1 == arguments.length) {
          delete this._callbacks["$" + event];
          return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
          cb = callbacks[i];
          if (cb === fn || cb.fn === fn) {
            callbacks.splice(i, 1);
            break;
          }
        }
        if (callbacks.length === 0) {
          delete this._callbacks["$" + event];
        }
        return this;
      };
      Emitter3.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
        if (callbacks) {
          callbacks = callbacks.slice(0);
          for (var i = 0, len = callbacks.length; i < len; ++i) {
            callbacks[i].apply(this, args);
          }
        }
        return this;
      };
      Emitter3.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks["$" + event] || [];
      };
      Emitter3.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
      };
    }
  });

  // node_modules/@pirxpilot/in-groups-of/index.js
  var require_in_groups_of = __commonJS({
    "node_modules/@pirxpilot/in-groups-of/index.js"(exports, module) {
      module.exports = function(arr, n) {
        var i, ret = [];
        if (n < 1) {
          return arr;
        }
        for (i = 0; i < arr.length; i += n) {
          ret.push(arr.slice(i, i + n));
        }
        return ret;
      };
    }
  });

  // node_modules/range-component/index.js
  var require_range_component = __commonJS({
    "node_modules/range-component/index.js"(exports, module) {
      module.exports = function(from, to, inclusive) {
        var ret = [];
        if (inclusive)
          to++;
        for (var n = from; n < to; ++n) {
          ret.push(n);
        }
        return ret;
      };
    }
  });

  // node_modules/bounds/index.js
  var require_bounds = __commonJS({
    "node_modules/bounds/index.js"(exports, module) {
      var Bounds2 = class _Bounds {
        static mixin(obj) {
          for (const key in _Bounds.prototype) {
            obj[key] = _Bounds.prototype[key];
          }
          return obj;
        }
        compare(fn) {
          this._compare = fn;
          return this;
        }
        distance(fn) {
          this._distance = fn;
          return this;
        }
        min(v) {
          if (!arguments.length) {
            return this._min;
          }
          this._min = v;
          delete this._reversed;
          return this;
        }
        max(v) {
          if (!arguments.length) {
            return this._max;
          }
          this._max = v;
          delete this._reversed;
          return this;
        }
        before(v) {
          return this._min && this._compare(v, this._min) < 0;
        }
        after(v) {
          return this._max && this._compare(v, this._max) > 0;
        }
        out(v) {
          return this.before(v) || this.after(v);
        }
        in(v) {
          return !this.out(v);
        }
        valid(v) {
          if (this.reversed()) {
            return !this.after(v) || !this.before(v);
          }
          return this.in(v);
        }
        invalid(v) {
          return !this.valid(v);
        }
        reversed() {
          if (this._reversed === void 0) {
            this._reversed = calculateReversed(this);
          }
          return this._reversed;
        }
        restrict(v) {
          const { _min, _max } = this;
          if (this.reversed()) {
            if (this.after(v) && this.before(v)) {
              return this._distance(_max, v) < this._distance(v, _min) ? _max : _min;
            }
            return v;
          }
          if (this.before(v)) {
            return _min;
          }
          if (this.after(v)) {
            return _max;
          }
          return v;
        }
      };
      function calculateReversed(self) {
        return self._min && self._max && self.before(self._max);
      }
      module.exports = Bounds2;
    }
  });

  // lib/calendar.js
  var calendar_exports = {};
  __export(calendar_exports, {
    default: () => Calendar
  });
  var import_component_emitter2 = __toESM(require_component_emitter(), 1);

  // lib/days.js
  var import_component_emitter = __toESM(require_component_emitter(), 1);
  var import_in_groups_of = __toESM(require_in_groups_of(), 1);
  var import_range_component = __toESM(require_range_component(), 1);

  // lib/dayrange.js
  var import_bounds = __toESM(require_bounds(), 1);
  function date(d) {
    return Array.isArray(d) ? new Date(d[0], d[1], d[2]) : d;
  }
  function compare(a, b) {
    return date(a).getTime() - date(b).getTime();
  }
  var DayRange = class extends import_bounds.default {
    constructor(min, max) {
      super();
      this.compare(compare);
      this.distance((a, b) => Math.abs(compare(a, b)));
      this.min(min);
      this.max(max);
    }
  };

  // lib/locale.js
  var LOCALE_EN = {
    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_")
  };
  function locale(locales) {
    return "Intl" in window ? { months: months(locales), weekdaysMin: weekdays(locales) } : LOCALE_EN;
  }
  function months(locales) {
    const format = Intl.DateTimeFormat(locales, { month: "long" });
    const date2 = new Date(2016, 0, 15);
    const names = [];
    for (let i = 0; i < 12; i++) {
      date2.setMonth(i);
      names.push(format.format(date2));
    }
    return names;
  }
  function weekdays(locales) {
    const format = Intl.DateTimeFormat(locales, { weekday: "narrow" });
    const date2 = new Date(2016, 0, 10);
    const names = [];
    for (let i = 10; i < 18; i++) {
      date2.setDate(i);
      names.push(format.format(date2));
    }
    return names;
  }

  // lib/template.js
  var template_default = `
<table class="calendar-table">
  <thead>
    <tr>
      <td class="prev"><a href="#">\u2190</a></td>
      <td colspan="5" class="title"><span class="month"></span> <span class="year"></span></td>
      <td class="next"><a href="#">\u2192</a></td>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
`;

  // lib/utils.js
  function clamp(month) {
    if (month > 11)
      return 0;
    if (month < 0)
      return 11;
    return month;
  }

  // lib/days.js
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function daysInMonth(month, year) {
    return month === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month];
  }
  function isLeapYear(year) {
    return 0 === year % 400 || 0 === year % 4 && 0 !== year % 100 || 0 === year;
  }
  function domify(template) {
    const el = document.createElement("div");
    el.innerHTML = template;
    return el.removeChild(el.firstElementChild);
  }
  var Days = class extends import_component_emitter.default {
    constructor() {
      super();
      this.el = domify(template_default);
      this.el.classList.add("calendar-days");
      this.head = this.el.tHead;
      this.body = this.el.tBodies[0];
      this.title = this.head.querySelector(".title");
      this.select(/* @__PURE__ */ new Date());
      this.validRange = new DayRange();
      this.locale = locale();
      this.body.addEventListener("click", (e) => {
        if (e.target.tagName !== "A") {
          return;
        }
        e.preventDefault();
        const el = e.target;
        const data = el.getAttribute("data-date").split("-");
        if (!this.validRange.valid(data)) {
          return;
        }
        const [year, month, day] = data;
        const date2 = new Date(year, month, day);
        this.select(date2);
        this.emit("change", date2);
      });
      this.el.querySelector(".prev").addEventListener("click", (ev) => {
        ev.preventDefault();
        this.emit("prev");
      });
      this.el.querySelector(".next").addEventListener("click", (ev) => {
        ev.preventDefault();
        this.emit("next");
      });
    }
    /**
     * Select the given `date`.
     *
     * @param {Date} date
     * @return {Days}
     * @api public
     */
    select(date2) {
      this.selected = date2;
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
    show(date2) {
      const year = date2.getFullYear();
      const month = date2.getMonth();
      this.showSelectedYear(year);
      this.showSelectedMonth(month);
      const subhead = this.head.querySelector(".subheading");
      if (subhead) {
        subhead.parentElement.removeChild(subhead);
      }
      this.head.insertAdjacentHTML("beforeend", this.renderHeading(this.locale.weekdaysMin));
      this.body.innerHTML = this.renderDays(date2);
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
      this.title.querySelector(".year").innerHTML = yearDropdown(from, to);
      this.title.querySelector(".year .calendar-select").addEventListener("change", () => this.emit("year"));
    }
    /**
     * Enable a month dropdown.
     *
     * @api public
     */
    monthMenu() {
      this.selectMonth = true;
      this.title.querySelector(".month").innerHTML = monthDropdown(this.locale.months);
      this.title.querySelector(".month .calendar-select").addEventListener("change", () => this.emit("month"));
    }
    /**
     * Return current year of view from title.
     *
     * @api private
     */
    titleYear() {
      return this.selectYear ? this.title.querySelector(".year .calendar-select").value : this.title.querySelector(".year").innerHTML;
    }
    /**
     * Return current month of view from title.
     *
     * @api private
     */
    titleMonth() {
      return this.selectMonth ? this.title.querySelector(".month .calendar-select").value : this.title.querySelector(".month").innerHTML;
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
      const daysStr = days.map((day) => `<th>${day}</th>`).join("");
      return `<tr class=subheading>${daysStr}</tr>`;
    }
    /**
     * Render days for `date`.
     *
     * @param {Date} date
     * @return {Element}
     * @api private
     */
    renderDays(date2) {
      return this.rowsFor(date2).map((row) => `<tr>${row.join("")}</tr>`).join("\n");
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
    rowsFor(date2) {
      const selected = this.selected;
      const selectedDay = selected.getDate();
      const selectedMonth = selected.getMonth();
      const selectedYear = selected.getFullYear();
      const month = date2.getMonth();
      const year = date2.getFullYear();
      const start = new Date(date2);
      start.setDate(1);
      const before = start.getDay();
      const total = daysInMonth(month, year);
      const perRow = 7;
      const totalShown = perRow * Math.ceil((total + before) / perRow);
      const after = totalShown - (total + before);
      let cells = [];
      cells = cells.concat(cellsBefore(before, month, year, this.validRange));
      for (let i = 0; i < total; ++i) {
        const day = i + 1;
        const select = day === selectedDay && month === selectedMonth && year === selectedYear;
        cells.push(renderDay([year, month, day], this.validRange, select));
      }
      cells = cells.concat(cellsAfter(after, month, year, this.validRange));
      return (0, import_in_groups_of.default)(cells, 7);
    }
    /**
     * Update view title or select input for `year`.
     *
     * @param {Number} year
     * @api private
     */
    showSelectedYear(year) {
      if (this.selectYear) {
        this.title.querySelector(".year .calendar-select").value = year;
      } else {
        this.title.querySelector(".year").innerHTML = year;
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
        this.title.querySelector(".month .calendar-select").value = month;
      } else {
        this.title.querySelector(".month").innerHTML = this.locale.months[month];
      }
    }
  };
  function cellsBefore(n, month, year, validRange) {
    const cells = [];
    if (month === 0)
      --year;
    const prev = clamp(month - 1);
    let before = daysInMonth(prev, year);
    while (n--)
      cells.push(renderDay([year, prev, before--], validRange, false, "prev-day"));
    return cells.reverse();
  }
  function cellsAfter(n, month, year, validRange) {
    const cells = [];
    let day = 0;
    if (month === 11)
      ++year;
    const next = clamp(month + 1);
    while (n--)
      cells.push(renderDay([year, next, ++day], validRange, false, "next-day"));
    return cells;
  }
  function renderDay(ymd, validRange, selected, style) {
    const date2 = `data-date=${ymd.join("-")}`;
    const styles = [];
    if (style) {
      styles.push(style);
    }
    if (!validRange.valid(ymd)) {
      styles.push("invalid");
    }
    const tdClass = selected ? ' class="selected"' : "";
    const aClass = styles.length ? ` class="${styles.join(" ")}"` : "";
    return `<td${tdClass}><a ${date2}${aClass}>${ymd[2]}</a></td>`;
  }
  function yearDropdown(from, to) {
    const years = (0, import_range_component.default)(from, to, "inclusive");
    const options = years.map(yearOption).join("");
    return `<select class="calendar-select">${options}</select>`;
  }
  function monthDropdown(months2) {
    const options = months2.map(monthOption).join("");
    return `<select class="calendar-select">${options}</select>`;
  }
  function yearOption(year) {
    return `<option value="${year}">${year}</option>`;
  }
  function monthOption(month, i) {
    return `<option value="${i}">${month}</option>`;
  }

  // lib/calendar.js
  var Calendar = class _Calendar extends import_component_emitter2.default {
    static of(...args) {
      return new _Calendar(...args);
    }
    constructor(date2 = /* @__PURE__ */ new Date()) {
      super();
      this.el = document.createElement("div");
      this.el.className = "calendar";
      this.days = new Days();
      this.el.appendChild(this.days.el);
      this.on("change", (date3) => this.show(date3));
      this.days.on("prev", () => this.prev());
      this.days.on("next", () => this.next());
      this.days.on("year", () => this.menuChange("year"));
      this.days.on("month", () => this.menuChange("month"));
      this.show(date2);
      this.days.on("change", (date3) => this.emit("change", date3));
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
    select(date2) {
      if (this.days.validRange.valid(date2)) {
        this.selected = date2;
        this.days.select(date2);
      }
      this.show(date2);
      return this;
    }
    /**
     * Show `date`.
     *
     * @param {Date} date
     * @return {Calendar}
     * @api public
     */
    show(date2) {
      this._date = date2;
      this.days.show(date2);
      return this;
    }
    /**
     * Set minimum valid date (inclusive)
     *
     * @param {Date} date
     * @api public
     */
    min(date2) {
      this.days.validRange.min(date2);
      return this;
    }
    /**
     * Set maximum valid date (inclusive)
     *
     * @param {Date} date
     * @api public
     */
    max(date2) {
      this.days.validRange.max(date2);
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
    showYearSelect(from = this._date.getFullYear() - 10, to = this._date.getFullYear() + 10) {
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
      const date2 = new Date(this._date);
      date2.setDate(1);
      date2.setMonth(date2.getMonth() - 1);
      return date2;
    }
    /**
     * Return the next month.
     *
     * @return {Date}
     * @api private
     */
    nextMonth() {
      const date2 = new Date(this._date);
      date2.setDate(1);
      date2.setMonth(date2.getMonth() + 1);
      return date2;
    }
    /**
     * Show the prev view.
     *
     * @return {Calendar}
     * @api public
     */
    prev() {
      this.show(this.prevMonth());
      this.emit("view change", this.days.selectedMonth(), "prev");
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
      this.emit("view change", this.days.selectedMonth(), "next");
      return this;
    }
    /**
     * Switch to the year or month selected by dropdown menu.
     *
     * @return {Calendar}
     * @api public
     */
    menuChange(action) {
      const date2 = this.days.selectedMonth();
      this.show(date2);
      this.emit("view change", date2, action);
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
  };
  return __toCommonJS(calendar_exports);
})();
