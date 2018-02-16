// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    search: function search(searchTerm, searchLimit, sortBy) {
        //use return to make our function returns a promise => so we can use it
        return fetch("http://reddit.com/search.json?q=" + searchTerm + "&" + sortBy + "&" + searchLimit).then(function (res) {
            return res.json();
        }) //convert the response to json format
        .then(function (data) {
            return data.data.children.map(function (data) {
                return data.data;
            });
        }) //usin map() to return only the data

        // in case there's any error
        .catch(function (err) {
            return console.log(err);
        });
    }
};
},{}],3:[function(require,module,exports) {
'use strict';

var _redditApi = require('./redditApi');

var _redditApi2 = _interopRequireDefault(_redditApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchForm = document.getElementById('search-form'); // importing reddit js file => remeber to keep things in modules

var searchInput = document.getElementById('search-input');

// listen to form submit
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // get seach term
    var searchTerm = searchInput.value;

    // get sort button value
    var sortBy = document.querySelector('input[name="sortby"]:checked').value;

    // get the limit option
    var searchLimit = document.getElementById('limit').value;

    // check input
    if (searchTerm === '') {
        // show message
        showMessage('Please add a search term', 'alert-danger'); // args => msg & className
    }

    // clear form on submit
    searchInput.value = '';

    // search Reddit
    // we imported the file and used the function search() in it
    _redditApi2.default.search(searchTerm, searchLimit, sortBy).then(function (results) {

        console.log(results);

        // output the data to dom
        var output = '<div class="card-columns">';

        // loop through the results
        results.forEach(function (post) {

            // check for post image => if it has one or not
            // if there's post.preview => then go and take out the source
            //if not => then use the imaage in our root folder
            var image = post.preview ? post.preview.images[0].source.url : 'http://www.programwitherik.com/content/images/2016/07/reddit.png';

            output += '\n            <div class="card">\n                <img class="card-img-top" src="' + image + '" alt="Card image cap">\n                <div class="card-body">\n                <h5 class="card-title">' + post.title + '</h5>\n                <p class="card-text">' + trimText(post.selftext, 50) + '</p> \n                <a href="' + post.url + '" class="btn btn-primary" target="_blank">Read More</a>\n                <hr>\n                <span class="badge badge-secondary">Subriddet: ' + post.subreddit + '</span>\n                <span class="badge badge-dark">Score: ' + post.score + '</span>\n                </div>\n            </div>\n            ';
        });

        // close the div
        output += '</div>';

        // output the div to the dom
        document.getElementById('results').innerHTML = output;
    });
});

// show message function
function showMessage(msg, className) {
    //create a div
    var div = document.createElement('div');

    // add class to div
    div.className = 'alert ' + className;

    // add the txt
    div.appendChild(document.createTextNode(msg));

    // get the parent container so we can add the message to it
    var searchContainer = document.getElementById('search-container');

    // get the other element that we want to add the message before
    var search = document.getElementById('search');

    // insert the message
    searchContainer.insertBefore(div, search); //insert the div before search element

    // set time out to hide the message after 3s
    setTimeout(function () {
        return document.querySelector('.alert').remove();
    }, 3000);
}

// truncate long text => aka. trim the text
function trimText(text, limit) {
    var shortened = text.indexOf(' ', limit); //use indexOf() to make sure that we don't cut off words in the middle

    if (shortened === -1) {
        //if indexOf() doesnt match the space => it'll return -1
        return text;
    }

    return text.substring(0, shortened);
}
},{"./redditApi":5}],7:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60662' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[7,3])
//# sourceMappingURL=/dist/Reddit_search_app.map