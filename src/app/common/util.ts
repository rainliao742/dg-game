/**
 * select all or none
 */
export function selectAll(list: any[], isAll: boolean): void {
  list.forEach(element => {
    element.isSelected = isAll;
  });
}

/**
 * clone
 */
export function clone<T>(obj: T, isDeep = false): T {
  return Object.assign({}, obj);
}

/**
 * merge property (modify target, and return it)
 */
export function mergeProperty(target: Object, source: Object): Object {
  return Object.assign(target, source);
}

/**
 * this method don't modify input object
 * ex. if input is { a:1, b: { c:2 }, d: { e:3, f: { g:4 } } }
 *     then return { a:1, c:2, e:3, g;4 }
 
export function concatAllProperty(inp: Object): Object {
  const rtn = {};
  Object.keys(inp).forEach(property => {
    if (inp[property] !== null && inp[property] !== undefined && inp[property].constructor === Object) {
      mergeProperty(rtn, concatAllProperty(inp[property]));
    } else {
      rtn[property] = inp[property];
    }
  });
  return rtn;
}
*/
/**
 * check param is empty
 */
export function isEmpty(param: string | any[] | null): boolean {

  // null and undefined are "empty"
  if (param == null) { return true; }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (param.length > 0) { return false; }
  if (param.length === 0) { return true; }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof param !== 'object') { return true; }

  return Object.keys(param).length === 0;
}

/**
 * check param is not empty
 */
export function isNotEmpty(param: any): boolean {
  return !isEmpty(param);
}

/**
 * check param is valid guid

export function isValidGUID(val: string | string[]): boolean {

  const invalidList = '00000000,11111111';
  if (/^\d{8}$/.test(val) === false || invalidList.indexOf(val) !== -1) {
    return false;
  }

  const validateOperator = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;

  for (let i = 0; i < validateOperator.length; i++) {
    sum += calculate(val[i] * validateOperator[i]);
  }

  return sum % 10 === 0 || (val[6] === '7' && (sum + 1) % 10 === 0);
}
 */
function calculate(product: number) {
  const ones = product % 10;
  const tens = (product - ones) / 10;
  return ones + tens;
}

/**
 * remove array element by porperty (modify list)
 * ex. if inputs are [ { a:1, b:2 }, { a:1, b:3 }, { a:2, b:4 } ] & { a:1 }
 *     then array of input will be [ { a:2, b:4 } ]
 
export function removeByProperty(list: any[], property: {}): void {
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    Object.keys(property).some(key => {
      if (element[key] === property[key]) {
        list.splice(i--, 1);
        return true;
      }
    });
  }
}*/


/**
 * check if the key of element in array is duplicate
 * ex. if inputs are [ { a:1, b:2, c:3 }, { a:1, b:2, c:4 }, { a:1, b:3, c:3 } ] & ['a', 'b']
 *     then return true
 * ex. if inputs are [ {id: {a: 1, b: 2, c: 3}}, {id: {a: 1, b: 3, c: 4}}, {id: {a: 1, b: 2, c: 8}} ] & ['a', 'c'], true
 */
export function isElementKeyDuplicate(list: any[], keys: string[], inId = false): boolean {
  const result = list.reduce((eleAcc, ele) => {
    const rKey = keys.reduce((keyAcc, key) => keyAcc + '_' + (inId ? ele.id[key] : ele[key]), '');
    eleAcc[rKey] = eleAcc[rKey] + 1 || 1;
    return eleAcc;
  }, {});

  return Object.keys(result).some(rKey => result[rKey] > 1);
}

/**
 * check if the key value in list is duplicate
 */
export function isElementKeyValueDuplicate(list: any[], key: string, value: string): boolean {
  return list.filter(obj => obj[key] === value).length > 1;
}

/**
 * sum the input numbers
 * ps. if the element in the input numbers cannot parse to number
 *     then it will be considered 0
 */
export function addAll(...nums: any[]): number {
  return nums.reduce((acc, cur) => acc += Number(cur) || 0, 0);
}

/**
 * check if param is number
 * ex. isNumber(1)          // true
 *     isNumber('1')        // true
 *     isNumber('1', false) // false
 */
export function isNumber(value: string, includeString = true): boolean {
  if (includeString) {
    return !isNaN(parseFloat(value));
  }
  return typeof value === 'number' && !isNaN(value);
}

/**
 * check param is not number
 */
export function isNotNumber(value: any, includeString = true): boolean {
  return !isNumber(value, includeString);
}

/**
 * if param is number, then set its precise to the given precise.
 * ex. getPrecise('10.3456', 2)          // 10.35
 *     getPrecise('10.3456', 2, 'chop')  // 10.34
 *     getPrecise('-10.3456', 2)         // -10.35
 *     getPrecise('-10.3456', 2, 'chop') // -10.34
 */
export function getPrecise(value: number, precise = 0, action: 'round' | 'chop' = 'round'): number {
  if (isNotNumber(value)) {
    return 0;
  }
  const multiplier = Math.pow(10, precise);
  if (action === 'round') {
    return Math.round(value * multiplier) / multiplier;
  }
  if (action === 'chop') {
    return (value >= 0 ? Math.floor(value * multiplier) : Math.ceil(value * multiplier)) / multiplier;
  }
  return 0;
}

/**
 * check if value is between start and end
 * ex. isBetween(12, 9, 11)               // false
 *     isBetween(10, 9, 11)               // true
 *     isBetween(10, 10, 11)              // true
 *     isBetween(10, 10, 11, false, true) // false
 *     isBetween(10, 9, 10, true, false)  // false
 */
export function isBetween(value: number, start: number, end: number, isIncludeStart = true, isIncludeEnd = true): boolean {
  if (start > end) {
    return false;
  }
  if (isIncludeStart && isIncludeEnd) {
    return value >= start && value <= end;
  }
  if (isIncludeStart && !isIncludeEnd) {
    return value >= start && value < end;
  }
  if (!isIncludeStart && isIncludeEnd) {
    return value > start && value <= end;
  }
  if (!isIncludeStart && !isIncludeEnd) {
    return value > start && value < end;
  }
  return false;
}

/**
 * check if value is not between start and end
 */
export function isNotBetween(value: any, start: any, end: any, isIncludeStart = true, isIncludeEnd = true): boolean {
  return !isBetween(value, start, end, isIncludeStart, isIncludeEnd);
}

/**
 * ======= 計算XYZ座標軸 =======
 * param1: storehouseId 庫別
 * param2: shelfType 料架別
 * param3: line 排
 * param4: bin (3碼)
 * param5: levelId level
 */
export function caculateCoordinate(storehouseId: string, shelfType: string, line: any, bin: string, levelId: string) {
  let x: number=0;
  let y: number=0;
  let z: number=0;
  // 重型料架
  if (shelfType === 'B') {
    x = convertLineToNumber(line) * 2 + 1 + (parseInt(bin, 10) + 1) % 2;
    y = parseInt(bin, 10) % 2 === 0 ? parseInt(bin, 10) / 2 : (parseInt(bin, 10) + 1) / 2;
    z = parseInt(levelId, 10);
  }

  // 輕型料架
  if (shelfType === 'C') {
    x = convertLineToNumber(line) * 2 + 1 + (parseInt(bin, 10) + 1) % 2;
    y = parseInt(bin, 10) % 2 === 0 ? parseInt(bin, 10) / 2 : (parseInt(bin, 10) + 1) / 2;
    if (storehouseId === '5' && shelfType === 'C' && parseInt(bin, 10) > 30) {
      z = 2;
    } else {
      z = 1;
    }
  }

  // 平面
  if (shelfType === 'D') {
    x = convertLineToNumber(line) + 1;
    y = parseInt(bin, 10);
    z = 1;
  }

  return { x: x, y: y, z: z };
}

function convertLineToNumber(line: string) {
  switch (line) {
    case 'A': return 0;
    case 'B': return 1;
    case 'C': return 2;
    case 'D': return 3;
    case 'E': return 4;
    case 'F': return 5;
    case 'G': return 6;
    case 'H': return 7;
    case 'I': return 8;
    case 'J': return 9;
    case 'K': return 10;
    case 'L': return 11;
    case 'M': return 12;
    case 'N': return 13;
    case 'O': return 14;
    case 'P': return 15;
    case 'Q': return 16;
    case 'R': return 17;
    case 'S': return 18;
    case 'T': return 19;
    case 'U': return 20;
    case 'V': return 21;
    case 'W': return 22;
    case 'X': return 23;
    case 'Y': return 24;
    case 'Z': return 25;
    default : return -1;
  }
}

const padding = '000000';
const prefix = '';
const suffix = '';
const decimal_separator = '.';
const thousands_separator = ',';

export function transform(value: string, fractionSize: number = 0): string {

  // if(parseFloat(value) % 1 != 0)
  // {
  //   fractionSize = 2;
  // }
  let [integer, fraction = ''] = (parseFloat(value).toString() || '').toString().split('.');

  fraction = fractionSize > 0
    ? decimal_separator + (fraction + padding).substring(0, fractionSize) : '';
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousands_separator);
  if (isNaN(parseFloat(integer))) {
    integer = '';
  }
  return prefix + integer + fraction + suffix;

}

export function parse(value: string, fractionSize: number = 2): string {
  let [integer, fraction = ''] = (value || '').replace(prefix, '')
    .replace(suffix, '')
    .split(decimal_separator);

  integer = integer.replace(new RegExp(thousands_separator, 'g'), '');

  fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
    ? decimal_separator + (fraction + padding).substring(0, fractionSize)
    : '';

  return integer + fraction;
}

/**
 * find max value in array
 */
export function findMax(array: number[]): number | undefined {
  if (isEmpty(array)) {
    return undefined;
  }
  return array.reduce((cur, acc) => cur > acc ? cur : acc);
}

/**
 * find min value in array
 */
export function findMin(array: number[]): number | undefined {
  if (isEmpty(array)) {
    return undefined;
  }
  return array.reduce((cur, acc) => cur < acc ? cur : acc);
}
