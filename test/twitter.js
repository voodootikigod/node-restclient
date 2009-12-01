var sys = require('sys');
var restclient = require('../src/restclient');
var fail = false


// Test JSON encoding
var res = restclient.get("http://twitter.com/statuses/public_timeline.json", function(result) {
  if ((typeof result !== "object")) {
    fail = true;
  }
}, "json");


// Test Non-JSON encoding
restclient.get("http://twitter.com/statuses/public_timeline.json", function(result) {
  if ((typeof result !== "string")) {
    fail = true;
  }
});



process.addListener("exit", function () {
  if (fail) {
    sys.puts("Get it right -- or else!!!");
  }
});
