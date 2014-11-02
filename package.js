Package.describe({
    name: 'rnorth:yammer',
    summary: 'Yammer OAuth flow',
    version: '0.1.0',
    git: ' /* Fill me in! */ '
});

Package.onUse(function (api) {
    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', ['server']);
    api.use('underscore', 'client');
    api.use('templating', 'client');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.export('Yammer');

    api.versionsFrom('1.0');
    api.addFiles('yammer_server.js', 'server');
    api.addFiles('yammer_client.js', 'client');
});