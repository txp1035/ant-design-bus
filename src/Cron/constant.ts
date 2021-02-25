export const DEFAULT_VALUE = {
  linux: '* * * * *',
  spring: '* * * * * ?',
  quartz: '* * * * * ? *',
};
const BASE_MARK = [
  ['*', '任意值'],
  [',', '多个值之间的分隔符'],
  ['-', '区间值的连接符'],
  ['/', '平均分配'],
];
export const MARK = {
  linux: {
    minute: [...BASE_MARK, ['0-59', '允许范围']],
    hour: [...BASE_MARK, ['0-23', '允许范围']],
    day: [...BASE_MARK, ['1-31', '允许范围']],
    moth: [...BASE_MARK, ['1-12', '允许范围']],
    week: [...BASE_MARK, ['0-6', '允许范围（0代表周日，1-6依次为周一到周六）']],
  },
  spring: {
    second: [...BASE_MARK, ['0-59', '允许范围']],
    minute: [...BASE_MARK, ['0-59', '允许范围']],
    hour: [...BASE_MARK, ['0-23', '允许范围']],
    day: [...BASE_MARK, ['1-31', '允许范围']],
    moth: [...BASE_MARK, ['1-12', '允许范围']],
    week: [...BASE_MARK, ['1-7', '允许范围（1代表周日，2-7依次为周一到周六）']],
  },
  quartz: {
    second: [...BASE_MARK, ['0-59', '允许范围']],
    minute: [...BASE_MARK, ['0-59', '允许范围']],
    hour: [...BASE_MARK, ['0-23', '允许范围']],
    day: [
      ...BASE_MARK,
      ['?', '不指定'],
      ['L', '本月最后一天'],
      ['W', '例：5W(距离5日最近的工作日)'],
      ['1-31', '允许范围'],
    ],
    moth: [...BASE_MARK, ['1-12', '允许范围']],
    week: [
      ...BASE_MARK,
      ['?', '不指定'],
      ['L', '例：1L(最后一周的周日)'],
      ['#', '例：1L3(第三周的周日)'],
      ['1-7', '允许范围（1代表周日，2-7依次为周一到周六）'],
    ],
    year: [...BASE_MARK, ['1970-2099', '允许范围']],
  },
};
