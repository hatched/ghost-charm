var path = require('path'),
    fs = require('fs');
/**
  Writes the supplied string to the configuration file.

  @param {String} fileData The completed configuration file string.
*/
function writeConfigToFile(fileData) {
  fs.writeFileSync('/home/ubuntu/ghost/config.js', fileData, 'utf8');
}


/**
  Substitutes the values in the template with the charm
  configuration values

  @method substituteValues
  @param {Object} err exec command error object.
  @param {Object} tmplFile Config file template contents.
*/
function substituteValues(err, config) {
  var fileData = fs.readFileSync(
    path.join(__dirname, 'assets/config.js.template'), 'utf8');
  config = JSON.parse(config);

  Object.keys(config).forEach(function(key) {
    fileData = fileData.replace('{{' + key + '}}', config[key]);
  });

  writeConfigToFile(fileData);
}

module.exports = {
  substituteValues: substituteValues
};
