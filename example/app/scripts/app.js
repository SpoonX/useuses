/*
 * A very cool application that will bro your mind. (Get it, blow your mind?)
 *
 * @author RWOverdijk
 * @version 0.0.1
 * @license wtfpl
 *
 * @uses ./append-bro
 * @uses ./groovy-alert.js
 */

var name = prompt(appendBro('Please tell me what your name is'), 'Mayflower');

groovyAlert(appendBro('Your name is ' + name));
