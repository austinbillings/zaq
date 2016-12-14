const jawn = require('node-jawn');
const _ = require('underscore');
const chalk = require('chalk');

let deprecated = (x) => {
  zaq.warn('Function ' + chalk.bold.yellow('[zaq.' + x + '()]') + ' is deprecated. Please consult your doctor.');
}

let zaq = {
  verbose: true,
  log: console.log,
  obj (obj, color = 'cyan') {
    let msg = chalk[color]('\n >>    ');
    msg += (_.isString(obj) ? obj : zaq.pretty(obj)).split('\n').join('\n' + chalk[color].dim(' ::    '));
    //msg += chalk[color].dim('\n ' + zaq.nLines(40, '\''));
    return msg;
  },
  win (text, obj) {
    text = chalk.bold.green(' ✓ WIN:   ') + chalk.bold(text);
    return zaq.log(text + (obj ? zaq.obj(obj, 'green') : ''));
  },
  err (text, obj) {
    text = chalk.bold.red(' x ERR:   ') + chalk.bold(text);
    return zaq.log(text + (obj ? zaq.obj(obj, 'red') : ''));
  },
  warn (text, obj) {
    text = chalk.bold.yellow(' # WARN:  ') + chalk.bold(text);
    return zaq.log(text + (obj ? zaq.obj(obj, 'yellow') : ''));
  },
  info (text, obj) {
    text = chalk.bold.blue(' → INFO:  ') + chalk.bold(text);
    return zaq.log(text + (obj ? zaq.obj(obj, 'blue') : ''));
  },
  time (text, obj) {
    text = chalk.bold.grey(' ♦ TIME:  ') + chalk.bold(text);
    return zaq.log(text + (obj ? zaq.obj(obj, 'grey') : ''));
  },
  pretty: (content) => JSON.stringify(content, null,'  '),
  space: (content) => zaq.log('\n' + content + '\n'),
  nLines (n, lines) {
    return Array(n).join(lines || '=')
  },
  mini (str) {
    return (_.isString(str) ? str : str.toString()).trim().substr(0, 100);
  },
  divider (text, lines) {
    let lineCount = Math.floor((process.stdout.columns - (text.length + 1)) * (1 / (lines ? lines.length : 1)));
    return zaq.log(text + ' '+ zaq.nLines(lineCount, lines));
  },
  json (x, y) {
    zaq.log(zaq.obj(y ? y : x));
    deprecated('json');
  },
  before (obj) {
    zaq.log(zaq.obj(obj));
    deprecated('before');
  },
  during (obj) {
    zaq.log(zaq.obj(obj));
    deprecated('during');
  },
  after (obj) {
    zaq.log(zaq.obj(obj));
    deprecated('after');
  }
};

module.exports = zaq;
