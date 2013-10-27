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
    db: 'mongodb://nodejitsu:9eb13bf493755e4e6ad41b9dd7bf96be@paulo.mongohq.com:10082/nodejitsudb6533400004'
  }
};

module.exports = config[env];
