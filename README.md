# DEPRECATED

Can be replaced with: [locize-lastused](https://github.com/locize/locize-lastused)

---


[![Travis](https://img.shields.io/travis/locize/locize-node-lastused/master.svg?style=flat-square)](https://travis-ci.org/locize/locize-node-lastused)
[![npm version](https://img.shields.io/npm/v/locize-node-lastused.svg?style=flat-square)](https://www.npmjs.com/package/locize-node-lastused)
[![David](https://img.shields.io/david/locize/locize-node-lastused.svg?style=flat-square)](https://david-dm.org/locize/locize-node-lastused)

This is an i18next plugin or standalone scriot to be used for [locize](http://locize.com) service. It will update last used timestamps on reference keys from your locize project using xhr. It sets the last used date on your reference language's namespaces.

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/locize-node-lastused) or [downloaded](https://cdn.rawgit.com/locize/locize-node-lastused/master/locize-node-lastusedd.min.js) from this repo.

```
# npm package
$ npm install locize-node-lastused
```

## Options

```js
{
  // the id of your locize project
  projectId: '[PROJECTID]',

  // add an api key if you want to send missing keys
  apiKey: '[APIKEY]',

  // the reference language of your project
  referenceLng: '[LNG]',

  // version - defaults to latest
  version: '[VERSION]'

  // debounce interval to send data in milliseconds
  debounceSubmit: 90000
}
```

## Using with i18next

Options can be passed in by setting options.locizeLastUsed in i18next.init:

```js
import i18next from "i18next";
import locizeLastUsed from "locize-node-lastused";

i18next.use(locizeLastUsed).init({
  locizeLastUsed: options
});
```

- If you don't use a module loader it will be added to `window.locizeLastUsed`

## Using without i18next

Directly call locizeLastUsed.init:

```js
import locizeLastUsed from "locize-node-lastused";

locizeLastUsed.init(options);
```

then call used function with namespace and key:

```js
import locizeLastUsed from "locize-node-lastused";

locizeLastUsed.used("myNamespace", "myKey.as.in.locize");
```
