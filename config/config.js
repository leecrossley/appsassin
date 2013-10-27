var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'appsassin'
    },
    port: 3000,
    db: 'mongodb://localhost/appsassin-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'appsassin'
    },
    port: 3000,
    db: 'mongodb://localhost/appsassin-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'appsassin'
    },
    port: 3000,
    db: 'mongodb://nodejitsu:c90a64e7bbf462858df23ebef93d94df@paulo.mongohq.com:10093/nodejitsudb3429878947'
  }
};

module.exports = config[env];
