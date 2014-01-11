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
