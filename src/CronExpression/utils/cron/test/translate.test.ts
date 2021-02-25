import { translate } from '../index';

test('translate', () => {
  // common、day common、week ?
  expect(translate('1,2,3,4-6,7-9/2,10-11/2 0 18-23 * * ? *')).toBe('18点到23点的0分的1秒到6秒，7秒到11秒每2秒');
  // day L
  expect(translate('* * * L * ? *')).toBe('本月最后一天');
  // day 1W
  expect(translate('* * * 1W * ? *')).toBe('离1日最近的工作日');
  // week 1#2 and day ?
  expect(translate('* * * ? * 1#2 *')).toBe('第2周的周1');
  // week 1L
  expect(translate('* * * ? * 1L *')).toBe('最后一周的周1');
  // week common
  expect(translate('* * * ? * 1 *')).toBe('周1');
  // opts
  expect(
    translate('* * * ? * 1L *', {
      translateMode: {
        day: () => '123',
        week: () => '123',
      },
    }),
  ).toBe('123的123');
  // not cron
  expect(translate('123')).toBe('cron表达式不合法');
  // Emum
  expect(translate('0 0 0 * * ? *')).toBe('每天');
});
