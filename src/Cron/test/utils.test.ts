import { checkFrequency, getSchedulingTime, hasRange } from '../utils';

test('checkFrequency', () => {
  expect(checkFrequency([''], 'linux')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'linux')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'spring')).toBe(false);
  expect(checkFrequency([1, 2, 3, 4, 5, 6, 7], 'quartz')).toBe(false);
});
test('getSchedulingTime', () => {
  expect(getSchedulingTime('1 2 3 4 5 6 7 8 2')).toEqual(['error']);
});
test('hasRange', () => {
  expect(hasRange(['1-2'])).toBe(true);
});
