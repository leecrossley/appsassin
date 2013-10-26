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
    db: 'mongodb://nodejitsu:2c020f3d52b681f539f43cbaa08ac0eb@paulo.mongohq.com:10039/nodejitsudb9065621558'
  }
};

module.exports = config[env];
