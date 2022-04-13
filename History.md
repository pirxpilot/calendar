
2.0.4 / 2022-04-13
==================

 * upgrade bounds to ~3

2.0.3 / 2022-04-13
==================

 * remove component-domify dependency

2.0.2 / 2021-01-24
==================

 * add prefix to non-standard user-select property

2.0.1 / 2019-07-09
==================

 * remove stringify transformation
 * replace template.html with template.js

2.0.0 / 2018-11-29
==================

 * add minify option to stringify
 * rewrite in ES6

1.0.3 / 2017-12-12
==================

 * remove component-event
 * remove component-classes

1.0.2 / 2017-03-18
==================

 * update deprecated dependencies

1.0.1 / 2017-02-16
==================

 * change name to @pirxpilot/calendar

1.0.0 / 2017-02-03
==================

 * use Intl to localize month and weekdays
 * breaking change: locale() now takes the String with desired locale (before it took object with month and weekday names)
 * remove dependencies required only for non ES5 compliant browsers, upgrade other dependencies
 * switch to yarn (from npm)

0.2.4 / 2015-09-18
==================

 * remove yields/empty dependency
 * switch deps: in-groups-of -> code42day-in-groups-of

0.2.3 / 2015-09-14
==================

 * fix Makefile - restore lint and test targets
 * fix dependencies - type-component

0.2.2 / 2015-09-14
==================

 * improve Makefile
 * add browserify options to package.json

0.2.1 / 2015-09-12
==================

 * switch to browserify build

0.2.0 / 2015-04-26
==================

 * enable changing locales for calendar
 * use component templates to translate HTML

0.1.0 / 2014-04-02
==================

 * add dates restriction: min/max functions

0.0.5 / 2013-06-06 
==================

 * fix tags

0.0.4 / 2013-05-31
==================

 * pin deps
 * fix short months selection on 31th of the month

0.0.3 / 2012-09-21
==================

  * fix start of the month date padding [colinf]

0.0.2 / 2012-09-20
==================

  * add package.json
  * fix prev/next month day selection [colinf]
