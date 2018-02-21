const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const stripAnsi = require('strip-ansi');

const namespaceCache = new Map();;

const faqtory = (namespace = '') => {
  if (typeof namespace === 'string' && namespaceCache.has(namespace)) {
    return namespaceCache.get(namespace);
  }

  const zaq = {
    version: '1.4.1',
    loggers: [ { handler: console.log } ]
  };

  zaq.log = (input, level = 'misc') => {
    zaq.loggers.forEach(({ handler, options = {} }) => {
      let { timestamps, levels, stripColors } = options;
      if (timestamps) input = (chalk.dim(moment().format('l LTS '))) + input;
      if (stripColors) input = stripAnsi(input);
      if (levels && levels.indexOf(level) < 0) return;
      if (handler) handler(input);
    });
  }

  zaq.use = (handler, options = {}) => {
    return zaq.loggers.push({ handler, options });
  }

  zaq.unuse = (index) => {
    return zaq.loggers.splice(index, 1);
  }

  zaq.obj = (obj = null, color = 'cyan') => {
    let msg = chalk[color]('\n >>>>       ');
    obj = (typeof obj === 'string' ? obj : zaq.pretty(obj))+'';
    msg += obj.split('\n').join('\n' + chalk[color].dim(' ::::       '));
    return msg;
  };

  zaq.message = ({ style, prefix }, { text, obj }) => {
    const space = namespace && namespace.length ? `[${namespace}] ` : ' ';
    prefix = prefix + (Array(10 - prefix.length).join(' '));
    text = chalk.bold[style].dim(space) + chalk.bold[style](prefix) + chalk.bold(text);
    text += obj ? zaq.obj(obj, style) : '';
    return text;
  }

  zaq.logMessage = ({ style, prefix, level }, { text, obj }) => {
    let message = zaq.message({ style, prefix }, { text, obj });
    return zaq.log(message, level);
  }

  const logType = (spec = {}) => (text, obj) => zaq.logMessage(spec, { text, obj });

  zaq.win = logType({
    style: 'green',
    prefix: '✓ WIN:',
    level: 'info'
  });

  zaq.err = logType({
    style: 'red',
    prefix: '✘ ERR:',
    level: 'error'
  });

  zaq.flag = logType({
    style: 'magenta',
    prefix: '⌘ FLAG:',
    level: 'info'
  });

  zaq.warn = logType({
    style: 'yellow',
    prefix: '⌗ WARN:',
    level: 'warn'
  });

  zaq.info = logType({
    style: 'blue',
    prefix: '→ INFO:',
    level: 'info'
  });

  zaq.time = logType({
    style: 'grey',
    prefix: '◔ TIME:',
    level: 'info'
  });

  zaq.debug = logType({
    style: 'cyan',
    prefix: '◆ DEBUG:',
    level: 'debug'
  });

  zaq.pretty = (content) => JSON.stringify(content, null,'  ');

  zaq.space = (content, amount = 1) => {
    let pad = zaq.nLines(amount, '\n');
    return zaq.log(pad + content + pad);
  }

  zaq.nLines = (n, line = '-') => Array(n).join(chalk.dim(line));

  zaq.mini = (str) => str.toString().trim().substr(0, 100);

  zaq.divider = (text = '', options = {}) => {
    let { lineSymbol, centered, space } = options;
    let { columns } = process.stdout;
    let textWidth = text.length + (centered ? 2 : 1);
    let lineCount = Math.floor((columns - textWidth) / (lineSymbol ? lineSymbol.length : 1));
    lineCount = centered ? Math.ceil(lineCount / 2) : lineCount;
    let filler = zaq.nLines(lineCount, lineSymbol);
    let output = centered ? `${filler} ${text} ${filler}` : `${text} ${filler}`;
    return zaq.space(output, space);
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
  namespaceCache.set(namespace, zaq);
  return zaq;
}

const defaultInstance = faqtory();
defaultInstance.as = faqtory;

module.exports = defaultInstance;
