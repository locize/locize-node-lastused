import * as utils from './utils';
import request from 'request';

// https://gist.github.com/Xeoncross/7663273
function ajax(url, callback, data) {
  if (data) {
    let reqOptions = typeof url === 'string' ? { uri: url, body: data, json: true } : { ...url, ...{ body: data, json: true }};
    request.post(reqOptions, function(err, res, body) {
      if (err) console.log(err);
      callback(err, body, res);
    });
  } else {
    request(url, function(err, res, body) {
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

const locizeLastUsed = {
  init: function(options) {
    const isI18next = options.t && typeof options.t === 'function';

    this.options = isI18next ? { ...getDefaults(), ...this.options, ...options.options.locizeLastUsed } : { ...getDefaults(), ...this.options, ...options };

    this.submitting = null;
    this.pending = {};
    this.done = {};
    
    if (!this.options.projectId || this.options.projectId === 'projectid' || this.options.projectId === 'projectId') {
      const err = new Error('projectId is not valid');
      console.error(err);
      throw err;
    }

    this.submit = utils.debounce(this.submit, this.options.debounceSubmit);

    // intercept
    if (isI18next) this.interceptI18next(options);
  },

  interceptI18next: function(i18next) {
    const origGetResource = i18next.services.resourceStore.getResource;

    i18next.services.resourceStore.getResource = (lng, ns, key, options) => {
      // call last used
      if (key) this.used(ns, key);

      // by pass orginal call
      return origGetResource.call(i18next.services.resourceStore, lng, ns, key, options);
    }
  },

  used: function(ns, key) {
    ['pending', 'done'].forEach((k) => {
      if (this.done[ns] && this.done[ns][key]) return;
      if (!this[k][ns]) this[k][ns] = {};
      this[k][ns][key] = true;
    });

    this.submit();
  },

  submit: function() {
    if (this.submitting) return this.submit();
    this.submitting = this.pending;
    this.pending = {};

    const namespaces = Object.keys(this.submitting);

    let todo = namespaces.length;
    const doneOne = () => {
      todo--;

      if (!todo) {
        this.submitting = null;
      }
    }
    namespaces.forEach((ns) => {
      const keys = Object.keys(this.submitting[ns]);
      let url = utils.replaceIn(this.options.lastUsedPath, ['projectId', 'version', 'lng', 'ns'], { ...this.options, lng: this.options.referenceLng, ns });

      const reqOptions = {
        uri: url,
        headers: {
          'Authorization': this.options.apiKey
        }
      };

      if (keys.length) {
        ajax(reqOptions, () => { doneOne(); }, keys);
      } else {
        doneOne();
      }
    });
  }
}

locizeLastUsed.type = '3rdParty';

export default locizeLastUsed;
