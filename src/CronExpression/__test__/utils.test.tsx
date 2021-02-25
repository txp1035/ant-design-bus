import { checkFrequency, getSchedulingTime, transformByType } from '../utils';
import { transformOutValue } from '../component/Frequency';
import { disabledRange } from '../component/Frequency/Base/AppointSelect';

test('checkFrequency', () => {
  expect(checkFrequency([''], 'linux')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'linux')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'spring')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'quartz')).toBe(false);
});
test('getSchedulingTime', () => {
  expect(getSchedulingTime('1 2 3 4 5 6 7 8 2')).toEqual(['error']);
});
test('transformByType', () => {
  expect(transformByType('1 2 3 4 5 ? 7', 'linux')).toBe('2 3 4 5 *');
  expect(transformByType('1 2 3 ? 5 6 7', 'linux')).toBe('2 3 * 5 6');
  expect(transformByType('1 2 3 4 5 6 7', 'spring')).toBe('1 2 3 4 5 6');
  expect(transformByType('1 2 3 4 5 6 7', 'quartz')).toBe('1 2 3 4 5 6 7');
  expect(transformByType('1 2 3 4 5 6', 'quartz')).toBe('1 2 3 4 5 6 *');
  expect(transformByType('1 2 3 4 *', 'quartz')).toBe('* 1 2 3 4 ? *');
  expect(transformByType('1 2 * 4 5', 'quartz')).toBe('* 1 2 ? 4 5 *');
});

// Frequency
test('Frequency', () => {
  expect(transformOutValue({ list: ['1', '2-5'] }, 'hour')).toEqual({ list: ['1', { start: '2', end: '5' }] });
});

test('AppointSelect', () => {
  expect(disabledRange({ limitTop: null, limitBottom: '3' })).toBe(false);
});
