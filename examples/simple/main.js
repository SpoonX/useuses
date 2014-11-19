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
