# Useuses
A module that allows you to build your project, resolving dependencies based on the `@uses` annotation.

## Installation
You can install useuses using npm:

### Save as dependency:
`npm install useuses --save`

### Global (for the cli):
`npm install -g useuses`

## Usage
This module can be used in a programmatic manner, or via the command line.

### CLI
This example assumes you have useuses installed globally.
If that's not the case, simply replace `useuses` with `./node_modules/useuses/bin/useuses`.

`useuses -i example/main.js -o example/dist/built.js -w`

### Programmatic
Below is a full example of how to use Useuses.

```javascript
var Useuses = require('useuses'),
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
```

## Options
The following options are currently available for useuses.

### In (--in, -i)
Use this option to tel useuses where the main project file is located.

### Out (--out, -o)
Using this option you can tell useuses where to write the built file to.

### Wrap (--wrap, -w)
Setting this to true, will instruct useuses to wrap the built code in a self-invoking function.
The advantage here, is that your code will not pollute the global scope; but will still run.

For example, this:

```javascript
var name = 'World';

console.log('Hello ' + name);
```

Would become this:

```javascript
(function () {
  var name = 'World';

  console.log('Hello ' + name);
})();
```
