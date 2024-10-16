export function isDefined (value) {
  return typeof value !== 'undefined';
}

export function isString (value) {
  return typeof value === 'string';
}

export function isNonEmptyString (value){
  return isString(value) && value.length;
}

export function isFunction (value) {
  return typeof value === 'function';
}

export function isArray (value) {
  return Array.isArray(value);
}

export function isNonEmptyArray (value) {
  return isArray(value) && value.length;
}

export function isNumber (value) {
  return typeof value === 'number' && !isNaN(value);
}

export function isNumberLike (value) {
  return isNumber(value)
    || (isString(value) && parseFloat(value) + 1 >= parseInt(value));
}

export function isNaN (value) {
  return Number.isNaN(value);
}

export function isNull (value) {
  return value === null;
}

export function isRegex (value) {
  return value instanceof RegExp;
}

export function isBoolean (value) {
  return typeof value === 'boolean';
}

export function isObject (value) {
  return typeof value === 'object'
    && !isNull(value)
    && !isArray(value)
    && !isRegex(value);
}

export function isPrimitive (value) {
  return isString(value)
    || isNumber(value)
    || isBoolean(value)
    || isNull(value);
}
