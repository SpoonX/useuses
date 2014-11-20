# Angular example
This is a small example demonstrating what useuses can do for you when using angular.

This example also illustrates how to use aliases for external files and applies wrapping to the build.xga 

## running
To compile the code in this directory, run:

`./bin/useuses.js -i examples/angular/scripts/app.js -o examples/angular/scripts/dist/built.js -a angular=https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular.min.js -w`

Then:

`npm install -g node-static`

Then:

`cd examples/angular && static`
