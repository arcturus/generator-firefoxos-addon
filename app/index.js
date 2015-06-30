'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var changeCase = require('change-case');

module.exports = yeoman.generators.NamedBase.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    // Setup configuration
    this.packageContent = {
      name: this.name
    };
    this.contentContent = {
      name: this.name,
      camelCaseName: changeCase.pascalCase(this.name)
    };
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Ready to create an amazing ' + chalk.red('FirefoxOS') + ' addon!'
    ));

    var prompts = [];

    prompts.push({
      type: 'input',
      name: 'description',
      message: 'What\'s the addon description?',
      store: true
    });

    prompts.push({
      type: 'input',
      name: 'filter',
      message: 'What\'s the filter to apply?',
      store: true,
      default: '*'
    });

    this.prompt(prompts, function (props) {
      this.props = props;

      this.contentContent.description = this.props.description;
      this.contentContent.filter = this.props.filter;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.packageContent
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('addon.js'),
        this.destinationPath('addon/addon.js')
      );
      this.fs.copy(
        this.templatePath('style.css'),
        this.destinationPath('addon/style.css')
      );
      this.fs.copyTpl(
        this.templatePath('_manifest.webapp'),
        this.destinationPath('addon/manifest.webapp'),
        this.contentContent
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
