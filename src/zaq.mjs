import path from 'path'
import chalk from 'chalk'
import moment from 'moment'
import stripAnsi from 'strip-ansi'
import packageJson from '../package.json' with { type: "json" };
import { joinBy, nLines, toString } from './utils.mjs'
import { GUTTER_DEFAULT, NAMESPACE_TYPES, LEVEL_VALUES } from './config.mjs'
import { isString, isNumber, isArray, isFunction, isObject, isDefined } from './typeUtils.mjs'

const namespaceCache = new Map();
const { dim, blue, red, yellow, bold, reset } = chalk;

export const { version } = packageJson;

export function faqtory (namespace = '') {
  if (NAMESPACE_TYPES.includes(typeof namespace) && namespaceCache.has(namespace)) {
    return namespaceCache.get(namespace);
  }

  function gutterize (prefix = '') {
    if (!isString(prefix))
      throw new TypeError('gutterize: expects prefix to be string; ' + typeof prefix + ' given.');
    const gutterSize = GUTTER_DEFAULT - stripAnsi(prefix).length + (isString(namespace) ? namespace.length + 3 : 0);
    const gutter = ' '.repeat(gutterSize);

    return prefix + gutter;
  }

  function getNamespacePrefix () {
    return isDefined(namespace)
      ? isString(namespace)
        ? namespace.length
          ? `[${namespace}]`
          : ''
        : `[${namespace.toString()}]`
      : ''
  }

  const loggers = [
    { handler: console.log }
  ];

  this.version = version
  this.loggers = loggers

  this.getNamespace = () => {
    return namespace;
  }

  function deprecated (name = '', replacement = null, replacementName = null) {
    return (...args) => {

      const deprecationWarning = `zaq method ${red(name)} is deprecated and will be removed in future versions of this.`;

      this.warn(deprecationWarning);

      if (!isFunction(replacement)) return;

      const replacementWarning = `${dim('Using alternative method')} ${replacementName ? blue(replacementName) : replacement.name} ${dim('instead.')}`

      this.warn(replacementWarning);

      replacement(...args);
    }
  }

  function getLevelValue (logLevel) {
    return Object.keys(LEVEL_VALUES)
      .find(key => LEVEL_VALUES[key] === logLevel);
  }

  this.log = (input, level = 'misc') => {
    this.loggers
      .filter(logger => isObject(logger))
      .forEach(({ handler, options = {} }) => {
        let { timestamps, logLevel, acceptLevels, stripColors } = options;

        const timestamp = timestamps ? dim(moment().format()) : null;

        switch (true) {
          case timestamps:
            input = timestamp + input.split('\n').join('\n' + timestamp);

          case stripColors:
            input = stripAnsi(input);

          case (isNumber(logLevel) && getLevelValue(level) < logLevel):
          case (isArray(acceptLevels) && !acceptLevels.includes(level)):
          case (isString(acceptLevels) && acceptLevels !== level):
            return;

          case isFunction(handler):
            return handler(input);
        }
      });
    return zaq;
  }

  this.use = (handler, options = {}) => {
    return this.loggers.push({ handler, options });
  }

  this.dispose = (index) => {
    if (!isNumber(index))
      throw new TypeError('this.dispose requires a valid handler index for removal.');

    return delete this.loggers[index];
  }

  this.unuse = deprecated('this.unuse', this.dispose, 'this.dispose');

  this.renderObject = (obj = null, color = 'cyan') => {
    if (!isString(color) || !color in chalk)
      throw new TypeError('this.renderObject requires color arg to be valid "chalk" style.');

    const NAMESPACE = chalk[color].dim(getNamespacePrefix());
    const LEAD_DECOR = ' >>>>';
    const REST_DECOR = ' ::::';
    const colorize = chalk[color];
    const prefix = gutterize(NAMESPACE + colorize(LEAD_DECOR)) + '  ';
    const rendered = isString(obj) ? obj : toString(obj);

    return '\n' + prefix + rendered
      .split('\n')
      .join('\n' + gutterize(NAMESPACE + colorize.dim(REST_DECOR)) + '  ');
    return output;
  };

  this.constructMessage = ({ style, prefix = '' }, { text, loggables }) => {
    const namespacePrefix = chalk.bold[style].dim(getNamespacePrefix());
    const givenPrefix = chalk.bold[style](prefix);
    const gutter = gutterize(`${namespacePrefix} ${givenPrefix}`);

    const message = gutter + chalk.bold(text);
    const details = isDefined(loggables)
      ? Array.isArray(loggables)
        ? loggables.map(obj => this.renderObject(obj, style)).join('')
        : this.renderObject(loggables, style)
      : '';
    return message + details;
  }

  this.logMessage = ({ text, loggables }, { style, prefix, level }) => {
    const message = this.constructMessage({ style, prefix }, { text, loggables });
    return this.log(message, level);
  }

  this.createLogStyle = (spec = {}) => (text, ...loggables) => {
    return this.logMessage({ text, loggables }, spec);
  };

  this.extractTo = (keyToExtract, method) => {
    return (data) => {
      var message = (isObject(data) && isString(data[keyToExtract]))
        ? data[keyToExtract]
        : `("${keyToExtract}" not found in data)`;

      return isFunction(method)
        ? method(message, data)
        : null;
    }
  };

  this.applyTo = (message, method) => {
    return (data) => {
      return isFunction(method)
        ? method(message, data)
        : null;
    }
  };

  this.ok = this.createLogStyle({
    style: 'green',
    prefix: '✓ OK:',
    level: 'info'
  });

  this.win = deprecated('this.win', this.ok, 'this.ok');

  this.err = this.createLogStyle({
    style: 'red',
    prefix: '✘ ERR:',
    level: 'error'
  });

  this.fatal = this.createLogStyle({
    style: 'red',
    prefix: '✖ FATAL:',
    level: 'fatal'
  });

  this.flag = this.createLogStyle({
    style: 'magenta',
    prefix: '⚑ FLAG:',
    level: 'info'
  });

  this.warn = this.createLogStyle({
    style: 'yellow',
    prefix: '⚠ WARN:',
    level: 'warn'
  });

  this.info = this.createLogStyle({
    style: 'blue',
    prefix: '→ INFO:',
    level: 'info'
  });

  this.time = this.createLogStyle({
    style: 'grey',
    prefix: '◔ TIME:',
    level: 'info'
  });

  this.debug = this.createLogStyle({
    style: 'cyan',
    prefix: '⌗ DEBUG:',
    level: 'debug'
  });

  this.space = (content, amount = 1, level) => {
    let pad = dim(nLines(amount, '\n'));
    return this.log(dim(pad) + reset(content) + dim(pad), level);
  }

  this.mini = (str) => str.toString().trim().substr(0, 100);

  this.divider = (text = '', options = {}) => {
    const { lineSymbol, centered, space, lineColor } = options;
    if (lineColor && !isString(lineColor) || !lineColor in chalk)
      throw new TypeError('this.divider: invalid lineColor option. Use a "chalk" color.');
    const { columns } = process.stdout;
    const namespacePrefix = getNamespacePrefix();
    const textWidth = text && text.length
      ? stripAnsi(text).length + (centered ? 2 : 1)
      : 0;
    const NAMESPACE = lineColor
      ? chalk.dim[lineColor](namespacePrefix)
      : chalk.dim(namespacePrefix);

    let lineCount = Math.floor((columns - textWidth - namespacePrefix.length) / (lineSymbol ? stripAnsi(lineSymbol).length : 1));
    lineCount = centered ? Math.ceil(lineCount / 2) : lineCount;
    lineCount = Math.max(0, lineCount);

    let filler = nLines(lineCount, lineSymbol);
    filler = lineColor ? chalk[lineColor](filler) : filler;

    const output = `${NAMESPACE} ${centered ? `${filler} ${text} ${filler}` : `${text} ${filler}`}`;

    return this.space(output, space, 'info');
  };

  this.as = faqtory


  return this;
}

const defaultInstance = new faqtory();

export default defaultInstance;
