[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# Calendar

  Calendar UI component designed for use as a date-picker,
  full-sized calendar or anything in-between.

  Live demo is [here](https://pirxpilot.github.io/calendar/)

## Installation

    $ npm install --save @pirxpilot/calendar

## Example

```js
var Calendar = require('@pirxpilot/calendar');
var cal = new Calendar;
cal.el.appendTo('body');
```

## Events

  - `view change` (date, action) when the viewed month/year is changed without modification of the selected date. This can be done either by next/prev buttons or dropdown menu. The action will be "prev", "next", "month" or "year" depending on what action caused the view to change.
  - `change` (date) when the selected date is modified

## API

### new Calendar(date)

  Initialize a new `Calendar` with the given `date` shown,
  defaulting to now.

### Calendar#select(date)

  Select the given `date` (`Date` object).

### Calendar#show(date)

  Show the given `date`. This does _not_ select the given date,
  it simply ensures that it is visible in the current view.

### Calendar#showMonthSelect()

  Add month selection input.

### Calendar#showYearSelect([from], [to])

  Add year selection input, with optional range specified by `from` and `to`,
  which default to the current year -10 / +10.

### Calendar#prev()

  Show the previous view (month).

### Calendar#next()

  Show the next view (month).

### Calendar#min()

  Define earliest valid date - calendar won't generate `change` events for dates before this one.

### Calendar#max()

  Define latest valid date - calendar won't generate `change` events for dates after this one.

### Calendar#locale(locales)

  Set alternative locale:
  - `locales` - Optional. A string with a BCP 47 language tag, or an array of such strings. For the general form and interpretation of the locales argument, see the [Intl] page.

  For [browsers][caniuse-intl] which do not support `Intl` in not available only English locale is supported.

## Themes

  [Aurora](https://github.com/component/aurora-calendar):

  ![](http://f.cl.ly/items/043N1r0e1L130y162R2f/Screen%20Shot%202012-09-17%20at%209.17.32%20PM.png)

# License

  MIT

[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
[caniuse-intl]: http://caniuse.com/#search=Intl

[npm-image]: https://img.shields.io/npm/v/@pirxpilot/calendar
[npm-url]: https://npmjs.org/package/@pirxpilot/calendar

[build-url]: https://github.com/pirxpilot/calendar/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/calendar/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/@pirxpilot/calendar
[deps-url]: https://libraries.io/npm/@pirxpilot%2Fcalendar
