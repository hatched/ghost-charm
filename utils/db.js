var exec = require('child_process').exec,
    utils = require('./utils');

/*
  Setup the mysql db config file.

  @method configureMysql
  @param {Object} err Exec function error
  @param {Object} config The json config data
 */
function configureMysql(err, config) {
  config = JSON.parse(config);
  var required_keys = ['user', 'database', 'password', 'private-address'];
  required_keys.map(function(key) {
    if(!(key in config)) {
      // We don't have the keys we need, exit silently by convention. 
      exec('juju-log DB Relation doesn\'t provide required keys.');
      return;
    }    
  }); 
  utils.renderTemplate(
    config, 'mysql.js.template', '/var/www/ghost/dbconfig.js');
};

/*
  Setup the sqlite db config file.

  @method configureSqlite
 */
function configureSqlite() {
  exec('cp assets/sqlite.js.template /var/www/ghost/dbconfig.js');
}

module.exports = {
  configureSqlite: configureSqlite,
  configureMysql: configureMysql,
}
