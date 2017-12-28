const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const stripAnsi = require('strip-ansi');

const zaq = function (namespace = '') {
  this.version = '1.2.8';
  this.loggers = [
    { handler: console.log }
  ];

  this.log = (input, level = 'misc') => {
    this.loggers.forEach(({ handler, options = {} }) => {
      let { timestamps, levels, stripColors } = options;
      if (timestamps) input = (chalk.dim(moment().format('l LTS '))) + input;
      if (stripColors) input = stripAnsi(input);
      if (levels && levels.indexOf(level) < 0) return;
      if (handler) handler(input);
    });
  }

  this.use = (handler, options = {}) => {
    return this.loggers.push({ handler, options });
  }

  this.unuse = (index) => {
    return this.loggers.splice(index, 1);
  }

  this.obj = (obj = null, color = 'cyan') => {
    let msg = chalk[color]('\n >>>>       ');
    obj = (typeof obj === 'string' ? obj : this.pretty(obj))+'';
    msg += obj.split('\n').join('\n' + chalk[color].dim(' ::::       '));
    return msg;
  };

  this.message = ({ style, prefix }, { text, obj }) => {
    const space = (namespace && namespace.length ? chalk.dim(namespace) + ' ' : '');
    prefix = ' ' + space + prefix + (Array(10 - prefix.length).join(' '));
    text = chalk.bold[style](prefix) + chalk.bold(text);
    text += obj ? this.obj(obj, style) : '';
    return space + text;
  }

  this.logMessage = ({ style, prefix, level }, { text, obj }) => {
    let message = this.message({ style, prefix }, { text, obj });
    return this.log(message, level);
  }

  const logType = (spec = {}) => (text, obj) => this.logMessage(spec, { text, obj });

  this.win = logType({ style: 'green', prefix: '✓ WIN:', level: 'info' });
  this.err = logType({ style: 'red', prefix: '✘ ERR:', level: 'error' });
  this.flag = logType({ style: 'cyan', prefix: '⌘ FLAG:', level: 'info' });
  this.warn = logType({ style: 'yellow', prefix: '⌗ WARN:', level: 'warn' });
  this.info = logType({ style: 'blue', prefix: '→ INFO:', level: 'info' });
  this.time = logType({ style: 'grey', prefix: '◔ TIME:', level: 'info' });
  this.debug = logType({ style: 'magenta', prefix: '◆ DEBUG:', level: 'debug' });

  this.pretty = (content) => JSON.stringify(content, null,'  ');
  this.space = (content, amount = 1) => {
    let pad = this.nLines(amount, '\n');
    return this.log(pad + content + pad);
  }

  this.nLines = (n, line = '-') => Array(n).join(chalk.dim(line));

  this.mini = (str) => str.toString().trim().substr(0, 100);

  this.divider = (text = '', options = {}) => {
    let { lineSymbol, centered, space } = options;
    let { columns } = process.stdout;
    let textWidth = text.length + (centered ? 2 : 1);
    let lineCount = Math.floor((columns - textWidth) / (lineSymbol ? lineSymbol.length : 1));
    lineCount = centered ? Math.ceil(lineCount / 2) : lineCount;
    let filler = this.nLines(lineCount, lineSymbol);
    let output = centered ? `${filler} ${text} ${filler}` : `${text} ${filler}`;
    return this.space(output, space);
  };

  this.weight = (...pathParts) => {
    let file = path.join(...pathParts);
    let basename = path.basename(file);
    let stats;
    try {
      stats = fs.statSync(file);
    } catch (e) {
      return this.warn(`File ${chalk.yellow.italic(basename)} not found, cannot be weighed.`);
    }
    let filesize = (stats.size / 1024).toFixed(2);
    this.info(`File ${chalk.blue.italic(basename)} is ${chalk.blue(filesize)} kb`);
  };
  return this;
};


module.exports = zaq;
