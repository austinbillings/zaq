const jawn = require('node-jawn');
const _ = require('underscore');
const chalk = require('chalk');

let deprecated = (x) => {
  zaq.log('Function [zaq.' + x + '()] is deprecated. Please consult your doctor.');
}

var zaq = {
  verbose: true,
  log: console.log,
  obj: (obj, color = 'cyan') => {
    let msg = chalk[color]('\n >>     ');
    msg += zaq.pretty(obj).split('\n').join('\n' + chalk.dim(' ::     '));
    msg += '\n';
    return msg;
  },
  win: (text, obj) => {
    text = chalk.bold.green(' ✓ WIN:   ') + text;
    return zaq.log(text + (obj ? zaq.obj(obj, 'green') : ''));
  },
  err: (text, obj) => {
    text = chalk.bold.red(' x ERR:   ') + text;
    return zaq.log(text + (obj ? zaq.obj(obj, 'red') : ''));
  },
  warn: (text, obj) => {
    text = chalk.bold.yellow(' # WARN:  ') + text;
    return zaq.log(text + (obj ? zaq.obj(obj, 'yellow') : ''));
  },
  info: (text, obj) => {
    text = chalk.bold.blue(' → INFO:  ') + text;
    return zaq.log(text + (obj ? zaq.obj(obj, 'blue') : ''));
  },
  time: (text, obj) => {
    text = chalk.bold.grey(' ♦ TIME:  ') + text;
    return zaq.log(text + obj ? zaq.obj(obj, 'grey') : '');
  },
  pretty: (content) => JSON.stringify(content, null,'  '),
  space: (content) => zaq.log('\n' + content + '\n'),
  nLines: (n, lines) => {
    console.log(n);
    return Array(n).join(lines || '=')
  },
  mini: (str) => {
    return (_.isString(str) ? str : str.toString()).trim().substr(0, 100);
  },
  divider: (text, lines) => {
    let lineCount = Math.floor((process.stdout.columns - text.length + 1) * (1 / (lines ? lines.length : 1)));
    return zaq.log(text + ' '+ zaq.nLines(lineCount, lines));
  },
  json: (x, y) => deprecated('json'),
  before: (obj) => deprecated('before'),
  during: (obj) => deprecated('during'),
  after: (obj) => deprecated('after')
};

module.exports = zaq;
