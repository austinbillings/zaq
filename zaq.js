var jawn = require('node-jawn');
var _ = require('underscore');
var chalk = require('chalk');

var zaq = {
  log: console.log,
  err: function (x) {
    return this.log(chalk.bold.red(' x ERROR:   '), x);
  },
  warn: function (x) {
    return this.log(chalk.bold.yellow(' ! WARNING: '), x);
  },
  info: function (x) {
    return this.log(chalk.bold.blue(' → INFO:    '), x);
  },
  win: function (x) {
    return this.log(chalk.bold.green(' ✓ SUCCESS: '), x);
  },
  json: function (x) { this.log(jawn.wrapDoubleBreaks(JSON.stringify(x, null, '  '))); },
  lines: Array(70).join('='),
  before: function (obj, funcName) {
    this.log(this.lines + "\n" + this.lines + "\n");
    if (funcName) this.log(' RUNNING', funcName);
    this.json(obj);
  },
  during: function (obj) {
    this.log('\t. . .', obj, '\t. . .');
  },
  after: function (obj) {
    this.log(chalk.grey('\n- - - - - ->\n'));
    this.json(obj);
  },
  mini: function (str) {
    return (_.isString(str) ? str : str.toString()).trim().substr(0, 100)
  }
};

module.exports = zaq;
