var path = require('path'),
    fs = require('fs');

/**
  Render a template file with the config data.

  @method renderTemplateData
  @param {Object} data Config data
  @param {String} template The template filename
  @param {String} filepath Path to render the template out to
*/
function renderTemplate(data, template, filepath) {
  var fileData = fs.readFileSync(path.join('assets', template), 'utf8');

  Object.keys(data).forEach(function(key) {
    fileData = fileData.replace('{{' + key + '}}', data[key]);
  });

  fs.writeFileSync(filepath, fileData, 'utf8');
}

module.exports = {
  renderTemplate: renderTemplate
};
