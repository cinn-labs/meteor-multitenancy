Package.describe({
  name: 'cinn:multitenancy',
  version: '0.0.3',
  summary: 'Multi tenancy for meteor apps',
  git: 'https://github.com/cinn-labs/meteor-multitenancy',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  const both = ['client', 'server'];
  api.versionsFrom('1.3.2.4');

  api.export('Tenancy');

  api.use('ecmascript');
  api.use('meteor-base');
  api.use("matb33:collection-hooks@0.7.15");

  api.addFiles('tenancy.common.js', both);
  api.addFiles('tenancy.server.js', 'server');
  api.addFiles('tenancy.client.js', 'client');
});
