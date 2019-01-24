const i18next = require('i18next');
const LocizeBackend = require('i18next-node-locize-backend');
const LocizeLastUsed = require('../lib/index.js').default;
// const LocizeBackend = require('../lib/index.js').default;

const yourOptions = {
	debug: true,
  saveMissing: true,
  preload: ['en', 'de'],
  fallbackLng: 'en',
  backend: {
    referenceLng: 'en',
    projectId: 'c55b9812-f5d2-4856-adba-c750afc82bb3',
    apiKey: '51837bfd-ed1f-4ed4-afb6-dd3049f6ee7f',
		// version: 'staging',
    // loadPath: 'https://api.locize.io/2596e805-2ce2-4e21-9481-ee62202ababd/{{version}}/{{lng}}/{{ns}}',
    // addPath: 'https://api.locize.io/missing/2596e805-2ce2-4e21-9481-ee62202ababd/{{version}}/{{lng}}/{{ns}}'
  },
  locizeLastUsed: {
    referenceLng: 'en',
    projectId: 'c55b9812-f5d2-4856-adba-c750afc82bb3',
    apiKey: '51837bfd-ed1f-4ed4-afb6-dd3049f6ee7f',
  }
};

i18next.use(LocizeBackend);
i18next.use(LocizeLastUsed);
i18next.init(yourOptions);

setTimeout(() => {
  console.log(i18next.t('translation:key1', { lng: 'en' }))
  console.log(i18next.t('translation:key2', { lng: 'en' }))
}, 5000);
