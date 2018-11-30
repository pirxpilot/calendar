const Bounds = require('bounds');


function date(d) {
  return Array.isArray(d) ? new Date(d[0], d[1], d[2]) : d;
}

function compare(a, b) {
  return date(a).getTime() - date(b).getTime();
}

class DayRange extends Bounds {
  constructor(min, max) {
    super();

    this.compare(compare);
    this.distance((a, b) => Math.abs(compare(a, b)));

    this.min(min);
    this.max(max);
  }

}

module.exports = DayRange;
