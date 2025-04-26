/**
 * Clamp `month`.
 *
 * @param {Number} month
 * @return {Number}
 * @api public
 */

export function clamp(month) {
  if (month > 11) return 0;
  if (month < 0) return 11;
  return month;
}
