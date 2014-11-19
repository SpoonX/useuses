(function () {
function hippify(what) {
  return what + ', now gluten free!';
}
function opposite_day(what) {
  return what.split('').reverse().join('');
}
// Ensure btoa exists
if (typeof btoa === 'undefined') {
  var btoa = function (a) {return a;};
}

function drop_the_base(what) {
  return btoa(encodeURIComponent(what));
}
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
/**
 * This cool function to demonstrate the power of the @uses annotation
 *
 * @param something
 * @param rather
 * @param awesome
 * @returns {*}
 * @constructor
 *
 * @uses ./lib/mixup.js
 * @uses ./lib/hippify.js
 */
function represent (something, rather, awesome) {
  console.log(hippify(something) + ' is ' + rather + ' ' + mixup(awesome));
}

represent('Useuses', 'pretty damn', 'Wicked');

})();