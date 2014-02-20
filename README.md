# grunt-useuses

A grunt plugin allowing you to use `@uses` annotations to load dependencies for your javascript files.
This plugin resolves dependencies recursively, and builds a list of correctly sorted, non-duplicate dependencies.

**Note:** This plugin doesn't support external urls yet.
If you need support for this, create an issue [here](https://github.com/SpoonX/useuses/issues), or submit a pull request.

## Getting Started
This plugin requires Grunt `~0.4.2` or older.

If you haven't used [Grunt](http://gruntjs.com/) before,
be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide,
as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.
Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-useuses --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-useuses');
```

## The "useuses" task

### Overview
In your project's Gruntfile, add a section for this task to the data object passed into `grunt.initConfig()`.

**Example:**

```js
grunt.initConfig({
  useuses: {
    myTarget: {
      src: 'assets/scripts/target/app.js',
      dest: 'dist/scripts/target.js'
    }
  },
});
```

### Options
#### aliases
Allows you to specify aliases for your dependencies.

Example:

```js
grunt.initConfig({
  useuses: {
    myTarget: {},
    options: {
      aliases: {
        'angular': 'assets/vendor/angular/angular',
      }
    }
  },
});
```

Allows you to do the following in your javascript files:

```js
/**
 * Some cool file.
 *
 * Gives you back assets/vendor/angular/angular.min.js
 * @uses angular.min
 *
 * Gives you back assets/vendor/angular/angular.js
 * @uses angular
 */
```

#### searchPaths
Allows you to specify searchPaths for useuses.
It's exactly what it sounds like, in that it will apply its search algorhythm in the supplied searchPaths as well.

Example:

```js
grunt.initConfig({
  useuses: {
    myTarget: {},
    options: {
      searchPaths: [
        'assets/bower_components'
      ]
    }
  },
});
```

Allows you to do the following in your javascript files:

```js
/**
 * Some cool file.
 *
 * Gives you back assets/bower_components/angular/angular.min.js
 * @uses angular/angular.min
 */
```

### Syntax
The syntax is pretty straight forward.
Usually your javascript files will already have a docblock at the beginning of the file:

```js
/*
 * My file
 *
 * Some info about My file
 *
 * @author  RWOverdijk
 * @version 0.1.0
 * @license MIT
 */
```

This plugin allows you to add a new annotation by the name of `@uses` in the following ways:
```js
/*
 * Relative to your current dir:
 * @uses ./my-dependency.js
 *
 * Without the .js extension (will load ./my-dependency.js):
 * @uses ./my-dependency
 *
 * A package with an index.js (will load ./package/index.js)
 * @uses ./package
 *
 * Paths relative to your project directory:
 * @uses assets/scripts/common/filter/age.js
 */
```

**The advantages are clear.**

You can specify dependencies in annotations making development easier,
as you have a reference to the file's dependencies.
The files individually still work without any dependencies, and you can still build a concatenated file.

### Examples
I've made a very small, but very informative example. You can find it in the `example` directory.
