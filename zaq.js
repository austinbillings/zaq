const jawn = require('node-jawn');
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const zaq = {
  version: '1.1.5',
  verbose: true,
  log: console.log
};

zaq.obj = (obj = null, color = 'cyan') => {
  let msg = chalk[color]('\n >>       ');
  obj = (_.isString(obj) ? obj : zaq.pretty(obj))+'';
  msg += obj.split('\n').join('\n' + chalk[color].dim(' ::       '));
  //msg += chalk[color].dim('\n ' + zaq.nLines(40, '\''));
  return msg;
};

zaq.win = (text, obj) => {
  text = chalk.bold.green(' ✓ WIN:   ') + chalk.bold(text);
  return zaq.log(text + (obj ? zaq.obj(obj, 'green') : ''));
};

zaq.err = (text, obj) => {
  text = chalk.bold.red(' x ERR:   ') + chalk.bold(text);
  return zaq.log(text + (obj ? zaq.obj(obj, 'red') : ''));
};

zaq.warn = (text, obj) => {
  text = chalk.bold.yellow(' # WARN:  ') + text;
  return zaq.log(text + (obj ? zaq.obj(obj, 'yellow') : ''));
};

zaq.info = (text, obj) => {
  text = chalk.bold.blue(' → INFO:  ') + text;
  return zaq.log(text + (obj ? zaq.obj(obj, 'blue') : ''));
};

zaq.time = (text, obj) => {
  text = chalk.bold.grey(' ♦ TIME:  ') + text;
  return zaq.log(text + (obj ? zaq.obj(obj, 'grey') : ''));
};

zaq.pretty = (content) => JSON.stringify(content, null,'  ');

zaq.space = (content) => zaq.log('\n' + content + '\n');

zaq.nLines = (n, lines = '-') => Array(n).join(chalk.dim(lines));

zaq.mini = (str) => str.toString().trim().substr(0, 100);

zaq.divider = (text, lines) => {
  let lineCount = Math.floor((process.stdout.columns - (text.length + 1)) * (1 / (lines ? lines.length : 1)));
  return zaq.space(`${text} ${zaq.nLines(lineCount, lines)}`);
};

zaq.weight = (...pathParts) => {
  let file = path.join(...pathParts);
  let basename = path.basename(file);
  let stats;
  try {
    stats = fs.statSync(file);
  } catch (e) {
    return zaq.warn(`File ${chalk.yellow.italic(basename)} not found, cannot be weighed.`);
  }
  let filesize = (stats.size / 1024).toFixed(2);
  zaq.info(`File ${chalk.blue.italic(basename)} is ${chalk.blue(filesize)} kb`);
};

module.exports = zaq;
