// Ensure btoa exists
if (typeof btoa === 'undefined') {
  var btoa = function (a) {return a;};
}

function drop_the_base(what) {
  return btoa(encodeURIComponent(what));
}
