# Useuses
A module that allows you to build your project, resolving dependencies based on the `@uses` annotation.

[![Build Status](https://travis-ci.org/SpoonX/useuses.png)](https://travis-ci.org/SpoonX/useuses)
[![Dependency Status](https://david-dm.org/spoonx/useuses.svg)](https://david-dm.org/spoonx/useuses)
[![NPM version](https://badge.fury.io/js/useuses.png)](http://badge.fury.io/js/useuses)

## What?
Before I dive into the technical specifics, I'll explain what this module is all about.

In short, it allows you to annotate your files with the `@uses` annotation to specify your dependencies;
which is convenient for the developer reading your code as he or she now knows what dependencies a file has.
It looks like this:

```javascript
/**
 * My file
 *
 * Some info about My file
 *
 * @author  RWOverdijk
 * @version 0.1.0
 * @license MIT
 *
 * @uses ./my-dependency.js
 * @uses ./my/other/dependency.js
 */
 // Code here...
```

It's also convenient because this module will bundle all dependencies together for you.
If you'd like a more detailed explanation of this module and its benefits, you can read about it in this [blog post](http://blog.spoonx.nl/javascript-dependency-management/).

## Features
This module allows you to:

* Build combined dist file based on used dependencies.
* Wrap the output to prevent pollution of the global scope.
* Include external (third party) resources. __*New__
* Aliases. __*New__
* Configure custom search (include) paths. __*New__

## Installation
You can install useuses using npm:

**Save as dependency:**
`npm install useuses --save`

**Global (for the cli):**
`npm install -g useuses`

## Usage
This module can be used in a programmatic manner, or via the command line.

### CLI
This example assumes you have useuses installed globally.
If that's not the case, simply replace `useuses` with `./node_modules/useuses/bin/useuses.js`.

`useuses -i example/main.js -o example/dist/built.js -w`

All available options can be found further down this document.

### Programmatic
Below is an example on how to use Useuses.

```javascript
var Useuses = require('useuses'),
    useuses,
    options;

options = {
  in     : 'example/main.js',
  out    : 'example/dist/built.js',
  wrap   : true,
  verbose: true,
  aliases: {foo: 'bar/baz/bat'},
  search : ['bower_components']
};

useuses = new Useuses(options);

useuses.compile(function (error, assembled) {
  if (error) {
    return console.error(error);
  }

  console.log('Yay! The build succeeded. The files included in the build are:', assembled);
});
```

All available options can be found further down this document.

## Options
The following options are currently available for useuses.

### In (--in, -i)
Use this option to tell useuses where the main project file is located.

### Out (--out, -o)
Using this option you can tell useuses where to write the built file to.

### Verbose (--verbose, -v)
When supplied, useuses will output the files written to the build.

### Tolerant (--tolerant, -t)
When supplied, useuses will not stop on missing dependencies.

### DryRun (--dry-run, -d)
When supplied, useuses won't write the actual build.
In stead, it will output a list of files that _would_ have been written if this weren't a dry-run.

**Note:** Programmatically, the key for this option is `dryRun`.

### Aliases (--alias, -a)
With this option you can set up aliases for your dependencies.
This is particularly useful with external resources or vendor (lib) files.

Example:

`-a angular=https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular.min.js`

Now you can just use `@uses angular` to specify you're using angular, and it will be downloaded and added to the build.

Using aliases can also be useful to specify alias paths.

For instance, creating alias `-a namespace/core=library/namespace/src/core` would allow you to get rid of the lengthy @uses.
You can now just specify `namespace/core/array-utilities.js` as a dependency.

You can supply multiple `-a` options, or an array separated string of assignments.

Example:

`-a vendor=vendor/bower_components,angular=library/angular/angular.js`

**Note:** Programmatically, the key for this option is `aliases`.
An object where the key is the alias, and the value is what the alias links to.

### Search (--search, -s)
This option allows you to specify custom search paths; places for the module to look for your dependencies.

Example:

`useuses -i simple/main.js -o examples/simple/dist/built.js -s examples -w`

Will now find `simple/main.js` in `examples/simple/main.js` and will also use the path `examples` for nested dependencies.

**Note:** Programmatically, the value for this option should be an array of paths.

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

## Support
If you have any questions / suggestions feel free to use one of the following resources:

* Take a look at the [wiki](./wiki)
* Take a look at the [issues](./issues)
* Join us on gitter [![Gitter chat](https://badges.gitter.im/SpoonX/Dev.png)](https://gitter.im/SpoonX/Dev)
