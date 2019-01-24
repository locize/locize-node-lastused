'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// https://gist.github.com/Xeoncross/7663273
function ajax(url, callback, data) {
  if (data) {
    var reqOptions = typeof url === 'string' ? { uri: url, body: data, json: true } : _extends({}, url, { body: data, json: true });
    _request2.default.post(reqOptions, function (err, res, body) {
      if (err) console.log(err);
      callback(err, body, res);
    });
  } else {
    (0, _request2.default)(url, function (err, res, body) {
      if (err) console.log(err);
      callback(err, body, res);
    });
  }
};

function getDefaults() {
  return {
    lastUsedPath: 'https://api.locize.io/used/{{projectId}}/{{version}}/{{lng}}/{{ns}}',
    referenceLng: 'en',
    version: 'latest',
    debounceSubmit: 90000
  };
}

var locizeLastUsed = {
  init: function init(options) {
    var isI18next = options.t && typeof options.t === 'function';

    this.options = isI18next ? _extends({}, getDefaults(), this.options, options.options.locizeLastUsed) : _extends({}, getDefaults(), this.options, options);

    this.submitting = null;
    this.pending = {};
    this.done = {};

    this.submit = utils.debounce(this.submit, this.options.debounceSubmit);

    // intercept
    if (isI18next) this.interceptI18next(options);
  },

  interceptI18next: function interceptI18next(i18next) {
    var _this = this;

    var origGetResource = i18next.services.resourceStore.getResource;

    i18next.services.resourceStore.getResource = function (lng, ns, key, options) {
      // call last used
      if (key) _this.used(ns, key);

      // by pass orginal call
      return origGetResource.call(i18next.services.resourceStore, lng, ns, key, options);
    };
  },

  used: function used(ns, key) {
    var _this2 = this;

    ['pending', 'done'].forEach(function (k) {
      if (_this2.done[ns] && _this2.done[ns][key]) return;
      if (!_this2[k][ns]) _this2[k][ns] = {};
      _this2[k][ns][key] = true;
    });

    this.submit();
  },

  submit: function submit() {
    var _this3 = this;

    if (this.submitting) return this.submit();
    this.submitting = this.pending;
    this.pending = {};

    var namespaces = Object.keys(this.submitting);

    var todo = namespaces.length;
    var doneOne = function doneOne() {
      todo--;

      if (!todo) {
        _this3.submitting = null;
      }
    };
    namespaces.forEach(function (ns) {
      var keys = Object.keys(_this3.submitting[ns]);
      var url = utils.replaceIn(_this3.options.lastUsedPath, ['projectId', 'version', 'lng', 'ns'], _extends({}, _this3.options, { lng: _this3.options.referenceLng, ns: ns }));

      var reqOptions = {
        uri: url,
        headers: {
          'Authorization': _this3.options.apiKey
        }
      };

      if (keys.length) {
        url, callback, data;
        ajax(reqOptions, function () {
          doneOne();
        }, keys);
      } else {
        doneOne();
      }
    });
  }
};

locizeLastUsed.type = '3rdParty';

exports.default = locizeLastUsed;