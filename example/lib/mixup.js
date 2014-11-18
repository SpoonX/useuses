/**
 * Let's mix up the string!
 *
 * @param {string} what
 *
 * @uses ./hippify.js
 * @uses ./opposite_day.js
 * @uses ../fake_vendor/drop_the_base.js
 */
function mixup (what) {
  return hippify(opposite_day(drop_the_base(what)));
}
