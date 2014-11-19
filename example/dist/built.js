(function () {
function hippify(what) {
  return what + ', now gluten free!';
}
function opposite_day(what) {
  return what.split('').reverse().join('');
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

var Useuses = require('../index.js'),
    useuses,
    options;

options = {
  in  : 'example/main.js',
  out : 'example/dist/built.js',
  wrap: true
};

useuses = new Useuses(options);

useuses.compile(function (error, assembled) {
  if (error) {
    return console.error(error);
  }

  console.log('Yay! The build succeeded. The files included in the build are:', assembled);
});

})();