/**
 * A simple, rather useless method that appends the string "bro".
 *
 * @param {string} text
 * @returns {string}
 */
function appendBro(text) {
  return text + ' bro!';
}
/*
 * A simple function that outputs a groovy alert.
 *
 * @author RWOverdijk
 * @version 0.0.1
 * @license wtfpl
 *
 * @uses ./append-bro
 */

/**
 * A groovy function allowing you to spice up your alerts.
 *
 * @param {string} text
 */
function groovyAlert(text) {
  text = appendBro('Check this out') + "\n" + text;

  alert(text);
}
/*
 * A very cool application that will bro your mind. (Get it, blow your mind?)
 *
 * @author RWOverdijk
 * @version 0.0.1
 * @license wtfpl
 *
 * @uses ./groovy-alert.js
 * @uses ./append-bro
 */

var name = prompt(appendBro('Please tell me what your name is'), 'Mayflower');

groovyAlert(appendBro('Your name is ' + name));
