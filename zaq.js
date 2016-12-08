var jawn = require('node-jawn');
var _ = require('underscore');
var chalk = require('chalk');

var zaq = {};

zaq.log = console.log;

zaq.win = function (x) {
  return zaq.log(chalk.bold.green(' ✓ WIN: '), x);
};
zaq.err = function (x) {
  return zaq.log(chalk.bold.red(' x ERR: '), x);
};
zaq.warn = function (x) {
  return zaq.log(chalk.bold.yellow(' # WARN:'), x);
};
zaq.info = function (x) {
  return zaq.log(chalk.bold.blue(' → INFO:'), x);
};
zaq.time = function (x) {
  return zaq.log(chalk.bold.grey(' ♦ TIME:'), x);
}
zaq.pretty = function (content) {
  return JSON.stringify(content, null, '  ');
}
zaq.space = function (content) {
  return zaq.log(jawn.wrapDoubleBreaks(content));
}
zaq.json = function (x, y) {
  var label, content;
  if (y) {
    label = x;
    content = zaq.pretty(y);
  } else {
    content = zaq.pretty(x);
  }
  zaq.log((label ? label + ': \n' : '') + jawn.wrapDoubleBreaks(content));
};

//  Lines & Dividers -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~

zaq.divider = function (text, lines) {
  zaq.log(text + ' ' + zaq.nLines(process.stdout.columns - (text.length + 1), lines));
}

zaq.nLines = function (n, lines) {
  if (!lines) lines = "=";
  return Array(n).join(lines);
}

zaq.lines = zaq.nLines(process.stdout.columns);

//  Inspection -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~

zaq.before = function (obj, funcName) {
  zaq.log(zaq.lines + "\n" + zaq.lines + "\n");
  if (funcName) zaq.log(' RUNNING', funcName);
  zaq.json(obj);
};

zaq.during = function (obj) {
  zaq.log('\t. . .', obj, '\t. . .');
};

zaq.after = function (obj) {
  zaq.log(chalk.grey('\n- - - - - ->\n'));
  zaq.json(obj);
};

zaq.mini = function (str) {
  return (_.isString(str) ? str : str.toString()).trim().substr(0, 100);
};

module.exports = zaq;
