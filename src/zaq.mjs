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

  const instance = {};
  instance.version = version
  instance.loggers = loggers

  instance.getNamespace = () => {
    return namespace;
  }

  function deprecated (name = '', replacement = null, replacementName = null) {
    return (...args) => {

      const deprecationWarning = `zaq method ${red(name)} is deprecated and will be removed in future versions of instance.`;

      instance.warn(deprecationWarning);

      if (!isFunction(replacement)) return;

      const replacementWarning = `${dim('Using alternative method')} ${replacementName ? blue(replacementName) : replacement.name} ${dim('instead.')}`

      instance.warn(replacementWarning);

      replacement(...args);
    }
  }

  function getLevelValue (logLevel) {
    return Object.keys(LEVEL_VALUES)
      .find(key => LEVEL_VALUES[key] === logLevel);
  }

  instance.log = (input, level = 'misc') => {
    instance.loggers
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
    return instance;
  }

  instance.use = (handler, options = {}) => {
    return instance.loggers.push({ handler, options });
  }

  instance.dispose = (index) => {
    if (!isNumber(index))
      throw new TypeError('instance.dispose requires a valid handler index for removal.');

    return delete instance.loggers[index];
  }

  instance.unuse = deprecated('instance.unuse', instance.dispose, 'instance.dispose');

  instance.renderObject = (obj = null, color = 'cyan') => {
    if (!isString(color) || !color in chalk)
      throw new TypeError('instance.renderObject requires color arg to be valid "chalk" style.');

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

  instance.constructMessage = ({ style, prefix = '' }, { text, loggables }) => {
    const namespacePrefix = chalk.bold[style].dim(getNamespacePrefix());
    const givenPrefix = chalk.bold[style](prefix);
    const gutter = gutterize(`${namespacePrefix} ${givenPrefix}`);

    const message = gutter + chalk.bold(text);
    const details = isDefined(loggables)
      ? Array.isArray(loggables)
        ? loggables.map(obj => instance.renderObject(obj, style)).join('')
        : instance.renderObject(loggables, style)
      : '';
    return message + details;
  }

  instance.logMessage = ({ text, loggables }, { style, prefix, level }) => {
    const message = instance.constructMessage({ style, prefix }, { text, loggables });
    return instance.log(message, level);
  }

  instance.createLogStyle = (spec = {}) => (text, ...loggables) => {
    return instance.logMessage({ text, loggables }, spec);
  };

  instance.extractTo = (keyToExtract, method) => {
    return (data) => {
      var message = (isObject(data) && isString(data[keyToExtract]))
        ? data[keyToExtract]
        : `("${keyToExtract}" not found in data)`;

      return isFunction(method)
        ? method(message, data)
        : null;
    }
  };

  instance.applyTo = (message, method) => {
    return (data) => {
      return isFunction(method)
        ? method(message, data)
        : null;
    }
  };

  instance.ok = instance.createLogStyle({
    style: 'green',
    prefix: '✓ OK:',
    level: 'info'
  });

  instance.win = deprecated('instance.win', instance.ok, 'instance.ok');

  instance.err = instance.createLogStyle({
    style: 'red',
    prefix: '✘ ERR:',
    level: 'error'
  });

  instance.fatal = instance.createLogStyle({
    style: 'red',
    prefix: '✖ FATAL:',
    level: 'fatal'
  });

  instance.flag = instance.createLogStyle({
    style: 'magenta',
    prefix: '⚑ FLAG:',
    level: 'info'
  });

  instance.warn = instance.createLogStyle({
    style: 'yellow',
    prefix: '⚠ WARN:',
    level: 'warn'
  });

  instance.info = instance.createLogStyle({
    style: 'blue',
    prefix: '→ INFO:',
    level: 'info'
  });

  instance.time = instance.createLogStyle({
    style: 'grey',
    prefix: '◔ TIME:',
    level: 'info'
  });

  instance.debug = instance.createLogStyle({
    style: 'cyan',
    prefix: '⌗ DEBUG:',
    level: 'debug'
  });

  instance.space = (content, amount = 1, level) => {
    let pad = dim(nLines(amount, '\n'));
    return instance.log(dim(pad) + reset(content) + dim(pad), level);
  }

  instance.mini = (str) => str.toString().trim().substr(0, 100);

  instance.divider = (text = '', options = {}) => {
    const { lineSymbol, centered, space, lineColor } = options;
    if (lineColor && !isString(lineColor) || !lineColor in chalk)
      throw new TypeError('instance.divider: invalid lineColor option. Use a "chalk" color.');
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

    return instance.space(output, space, 'info');
  };

  instance.as = faqtory


  return instance;
}

const defaultInstance = new faqtory();

export default defaultInstance;
