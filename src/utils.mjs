import chalk from 'chalk';

const CONNECTORS = ['{','}','[',']'];

export function joinBy (glue = '') {
  return (...strings) => !Array.isArray(strings)
    ? strings
    : strings.filter(s => s).join(glue);
};

export function nLines (n, line = '-') {
  return Array(n).join(line)
};

export function toString (content) {
  return typeof content === 'undefined' ? 'undefined' : JSON
    .stringify(content, null, '  ')
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      return trimmed.length && CONNECTORS.includes(trimmed)
        ? chalk.dim(line)
        : line;
    })
    .join('\n');
}
