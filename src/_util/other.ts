export type jsType =
  | 'Number' // 原始类型
  | 'String' // 原始类型
  | 'Boolean' // 原始类型
  | 'Null' // 原始类型
  | 'Undefined' // 原始类型
  | 'Symbol' // 原始类型
  | 'BigInt' // 原始类型
  | 'Object'
  | 'Function'
  | 'Array'
  | 'Date';

export function getType(params: any): jsType {
  const str = Object.prototype.toString.call(params);
  const reg = /\[object ([a-zA-Z]*)\]/;
  const type = (reg.exec(str) || { 1: 'Undefined' })[1] as jsType;
  return type;
}
