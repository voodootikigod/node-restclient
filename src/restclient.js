var http = require("http"), base64 = require("./base64");


var RestClient = (function () {
  var loopback = http.createClient(80, "127.0.0.1");
  var rest_call = function (method, url, data, callback, type) {
    if (typeof data == "function")  {
      type = callback;
      callback = data;
    }
    if (typeof callback == "string") {
      type = callback;
    }
    var uri = http.parseUri(url);
    var headers = {};
    if (!headers["Host"] && uri.host) {
      headers["Host"] = uri.host;
    }
    if (!headers["User-Agent"]) {
      headers["User-Agent"] = "Node.js HTTP Client";
    }
    if (!headers["Authorization"] && uri.user) {
      headers["Authorization"] = "Basic "+base64.encode(uri.user+":"+(uri.password||""));
    }
    var path = (uri.path || "/");
    var client = http.createClient((uri.port ||80), uri.host);
    var result = method.apply(client, [uri.path, headers]);
    if (typeof callback == "function") {
      result.finish(function (response) {
        var body = "";
        response.addListener("body", function (chunk) {
          body += chunk;
        });
        response.addListener("complete", function () {
          if (type == "json") {
            callback(JSON.parse(body));
          } else {
            callback(body);
          }
        });
      });
    }
    return result;
  };
  return {
    get: function(url, data, callback, type) {
      var res = rest_call(loopback.get, url, data, callback, type);
      return res;
    },
    post: function(url, data, callback, type) {
      var res = rest_call(loopback.post,url, data, callback, type);
      return res;
    },
    head: function(url, data, callback, type) {
      var res = rest_call(loopback.head, url, data, callback, type);
      return res;
    },
    put: function(url, data, callback, type) {
      var res = rest_call(loopback.put, url, data, callback, type);  
      return res;
    },
    del: function(url, data, callback, type) {
      var res = rest_call(loopback.del, url, data, callback, type);
      return res;
    }
  }
  
})()

exports.get = RestClient.get;
exports.post = RestClient.post;
exports.head = RestClient.head;
exports.put = RestClient.put;
exports.del = RestClient.del;