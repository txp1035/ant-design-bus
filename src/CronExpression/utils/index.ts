import parser from 'cron-parser';
import type { cronType} from './cron/utils';
import { getCronType } from './cron/utils';

export function checkFrequency(params: any[], type: any) {
  let isAdd = true;
  params.forEach((item: any) => {
    if (item === '') {
      isAdd = false;
    }
  });
  if (params.length >= 5 && type === 'linux') {
    isAdd = false;
  }
  if (params.length >= 5 && type === 'spring') {
    isAdd = false;
  }
  if (params.length >= 6 && type === 'quartz') {
    isAdd = false;
  }
  return isAdd;
}
export function getSchedulingTime(time: string, times: number = 5): string[] {
  let timeStr = time;
  const timeArr = time.split(' ');
  if (timeArr.length === 7) {
    timeArr.pop();
    timeStr = timeArr.join(' ');
  }
  try {
    const interval = parser.parseExpression(timeStr);
    const arr = [];
    for (let index = 0; index < times; index += 1) {
      arr[index] = interval.next().toString();
    }
    return arr;
  } catch (err) {
    return ['error'];
  }
}
export function transformByType(params: string, type: cronType) {
  const frequencyArr = params.split(' ');
  const typeLength = {
    5: 'linux',
    6: 'spring',
    7: 'quartz',
  };
  const isMatch = typeLength[frequencyArr.length] === type;
  if (!isMatch) {
    let frequency = {
      second: '*',
      minute: '*',
      hour: '*',
      day: '*',
      moth: '*',
      week: '*',
      year: '*',
    };
    const types = getCronType(params);
    if (types === 'linux') {
      frequency = {
        ...frequency,
        minute: frequencyArr[0],
        hour: frequencyArr[1],
        day: frequencyArr[2],
        moth: frequencyArr[3],
        week: frequencyArr[4],
      };
    }
    if (types === 'spring') {
      frequency = {
        ...frequency,
        second: frequencyArr[0],
        minute: frequencyArr[1],
        hour: frequencyArr[2],
        day: frequencyArr[3],
        moth: frequencyArr[4],
        week: frequencyArr[5],
      };
    }
    if (types === 'quartz') {
      frequency = {
        ...frequency,
        second: frequencyArr[0],
        minute: frequencyArr[1],
        hour: frequencyArr[2],
        day: frequencyArr[3],
        moth: frequencyArr[4],
        week: frequencyArr[5],
        year: frequencyArr[6],
      };
    }
    // 特殊处理
    // linux->spring quartz
    if (types === 'linux') {
      if (frequency.week === '*') {
        frequency.week = '?';
      }
      if (frequency.day === '*' && frequency.week !== '*') {
        frequency.day = '?';
      }
    }
    // spring quartz->linux
    if (type === 'linux') {
      if (frequency.day === '?') {
        frequency.day = '*';
      }
      if (frequency.week === '?') {
        frequency.week = '*';
      }
    }
    // 返回值
    let str = '';
    if (type === 'linux') {
      str = `${frequency.minute} ${frequency.hour} ${frequency.day} ${frequency.moth} ${frequency.week}`;
    }
    if (type === 'spring') {
      str = `${frequency.second} ${frequency.minute} ${frequency.hour} ${frequency.day} ${frequency.moth} ${frequency.week}`;
    }
    if (type === 'quartz') {
      str = `${frequency.second} ${frequency.minute} ${frequency.hour} ${frequency.day} ${frequency.moth} ${frequency.week} ${frequency.year}`;
    }
    return str;
  }
  return params;
}
