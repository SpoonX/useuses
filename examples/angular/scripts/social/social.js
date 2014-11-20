/**
 * @uses angular
 */
angular.module('social', []);

angular.module('social').controller('GreetController', function () {
  this.name = 'Dr. awesome';

  this.kind = function () {
    alert('Hello, kind ' + this.name);
  };

  this.mean = function () {
    alert('What are you looking at, ' + this.name + '!');
  };
});
