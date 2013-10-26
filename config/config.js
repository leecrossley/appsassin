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
    db: 'mongodb://localhost/appsassin-production'
  }
};

module.exports = config[env];
