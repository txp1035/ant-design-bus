import lodash from 'lodash';
import { join, getCronType, arrToObj } from './utils';

export type frequencyType = 'second' | 'minute' | 'hour' | 'day' | 'moth' | 'week' | 'year' | 'frequency';
const FREQUENCY_BASE = {
  minute: '分钟',
  hour: '小时',
  day: '日',
  moth: '月',
  week: '周',
};
const specialWeek = {
  1: '周日',
  2: '周一',
  3: '周二',
  4: '周三',
  5: '周四',
  6: '周五',
  7: '周六',
};
export const constant = {
  second: {
    emum: arrToObj(lodash.range(0, 60).map((item) => String(item))),
    stepEmum: arrToObj(['1', '2', '3', '4', '5', '10', '15', '20', '30']),
  },
  minute: {
    emum: arrToObj(lodash.range(0, 60).map((item) => String(item))),
    stepEmum: arrToObj(['1', '2', '3', '4', '5', '10', '15', '20', '30']),
  },
  hour: {
    emum: arrToObj(lodash.range(0, 24).map((item) => String(item))),
    stepEmum: arrToObj(['1', '2', '3', '4', '6', '8', '12']),
  },
  day: {
    emum: arrToObj(lodash.range(1, 32).map((item) => String(item))),
    stepEmum: arrToObj(lodash.range(1, 32).map((item) => String(item))),
    workingDaysEmum: arrToObj(lodash.range(1, 32)),
  },
  moth: {
    emum: arrToObj(lodash.range(1, 13).map((item) => String(item))),
    stepEmum: arrToObj(['1', '2', '3', '4', '6', '12']),
  },
  week: {
    emum: specialWeek,
    stepEmum: specialWeek,
    Last: specialWeek,
    appointValue: {
      ranking: {
        1: '第一周',
        2: '第二周',
        3: '第三周',
        4: '第四周',
        5: '第五周',
      },
      week: specialWeek,
    },
  },
  year: {
    emum: arrToObj(lodash.range(1970, 2100).map((item) => String(item))),
    stepEmum: arrToObj(lodash.range(1, 11).map((item) => String(item))),
  },
  frequency: {
    linux: FREQUENCY_BASE,
    spring: {
      second: '秒',
      ...FREQUENCY_BASE,
    },
    quartz: {
      second: '秒',
      ...FREQUENCY_BASE,
      year: '年',
    },
  },
};

export interface TransformParams {
  second?: SecondParams;
  minute?: MinuteParams;
  hour?: HourParams;
  day?: DayParams;
  moth?: MothParams;
  week?: WeekParams;
  year?: YearParams;
}
export interface FrequencyParams {
  second: string;
  minute: string;
  hour: string;
  day: string;
  moth: string;
  week: string;
  year: string;
}
export interface Range {
  start: string; // 开始
  end: string; // 结束
  step?: string; // 步长
}
export interface BaseParams {
  isCommon: boolean; // 通配符，例：*
  list?: (string | Range)[]; // 指定的单值或者区间值，例：[1,1-10/2]
}
export type SecondParams = BaseParams
export type MinuteParams = BaseParams
export type HourParams = BaseParams
export interface DayParams extends BaseParams {
  isAppoint?: boolean; // 指定符号，例：?
  workingDays?: string; // 每月几号最近的那个工作日，例：1W
  isLastDay?: boolean; // 是否是本月最后一天，例：L
}
export type MothParams = BaseParams
export interface WeekValue {
  ranking: string; // 排名（第几周）
  week: string; // 星期几
}
export interface WeekParams extends BaseParams {
  isAppoint?: boolean; // 指定符号，例：?
  Last?: string; // 本月最后一个星期几，例：1L
  appointValue?: WeekValue; // 指定值（第几周的星期几）
}
export type YearParams = BaseParams

/**
 * 描述：基于UI的转换器，时间只接受数字
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:字符串或者对象
 * @returns {any} 对象或者字符串
 */
export function transformBase(params: string | BaseParams): string | BaseParams {
  // 如果是字符串，转换成可以用的对象；如果是对象，转换成可以用的字符串
  if (typeof params === 'string') {
    // 先根据,符号转换成数组
    if (params === '*') {
      return {
        isCommon: true,
        list: undefined,
      };
    }
    const reg = /([0-9]+)-([0-9]+)(\/([0-9]+))?/;
    const regNumber = /[0-9]+/;
    const list = params
      .split(',')
      .filter((item) => reg.test(item) || regNumber.test(item)) // 过滤掉不是指定字符串，例：L
      .map((item) => {
        if (Number.isNaN(Number(item))) {
          // 有特殊符号的子项
          // 特殊项例子：1-2/3 1-2
          const arr = reg.exec(item) as (string | undefined)[];
          return {
            start: arr[1], // string
            end: arr[2], // string
            step: arr[4], // string| undefined
          };
        }
        // 只有数字的子项
        return item;
      });
    return {
      isCommon: false,
      list,
    };
  }
  const { list } = params;
  if (list === undefined || (list && list.length === 0)) {
    return '*';
  }
  const newList = list.map((item) => {
    if (typeof item === 'string') {
      return item;
    }
    const { start, end, step } = item;
    return join([`${start}-${end}`, step], '/');
  });
  return join(newList, ',');
}

/**
 * 描述：基于基本转换
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|second
 * @returns {any}
 */
export function transformSecond(params: string | SecondParams) {
  return transformBase(params);
}

/**
 * 描述：基于基本转换
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|second
 * @returns {any}
 */
export function transformMinute(params: string | MinuteParams) {
  return transformBase(params);
}

/**
 * 描述：基于基本转换
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|second
 * @returns {any}
 */
export function transformHour(params: string | HourParams) {
  return transformBase(params);
}

/**
 * 描述 (quartz和spring?LW)+基础
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|day
 * @returns {any}
 */
export function transformDay(params: string | DayParams, isAppoint: boolean = false) {
  if (typeof params === 'string') {
    if (params === '?') {
      return { isCommon: false, isAppoint: true };
    }
    if (params === 'L') {
      return { isCommon: false, isLastDay: true };
    }
    const weekReg = /^([1-9][0-9]*)W$/;
    if (weekReg.test(params)) {
      return { isCommon: false, workingDays: (weekReg.exec(params) as string[])[1] };
    }
    const base = transformBase(params);
    return base;
  }
  const { workingDays, isLastDay, list } = params;
  if (workingDays === undefined && isLastDay === undefined && (list === undefined || (list && list.length === 0))) {
    if (isAppoint) {
      return '?';
    }
    return '*';
  }
  if (isLastDay) {
    return 'L';
  }
  if (workingDays) {
    return `${workingDays}W`;
  }
  const base = transformBase(params);
  return base;
}

/**
 * 描述：基于基本转换
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|second
 * @returns {any}
 */
export function transformMoth(params: string | MothParams) {
  return transformBase(params);
}

/**
 * 描述：(quartz和spring?L#)+基础
 * @author ShawDanon
 * @date 2020-06-15
 * @param {any} params:string|week
 * @returns {any}
 */
export function transformWeek(params: string | WeekParams, isAppoint: boolean = false) {
  if (typeof params === 'string') {
    if (params === '?') {
      return { isCommon: false, isAppoint: true };
    }
    const appointReg = /^([1-7])#([1-5])$/;
    if (appointReg.test(params)) {
      return {
        isCommon: false,
        appointValue: {
          ranking: (appointReg.exec(params) as string[])[2],
          week: (appointReg.exec(params) as string[])[1],
        },
      };
    }
    const lastReg = /^([1-7])L$/;
    if (lastReg.test(params)) {
      return {
        isCommon: false,
        Last: (lastReg.exec(params) as string[])[1],
      };
    }
    const base = transformBase(params);
    return base;
  }
  const { list, appointValue, Last } = params;
  if (appointValue === undefined && Last === undefined && (list === undefined || (list && list.length === 0))) {
    if (isAppoint) {
      return '?';
    }
    return '*';
  }
  if (appointValue) {
    return `${appointValue.week}#${appointValue.ranking}`;
  }
  if (Last) {
    return `${Last}L`;
  }
  const base = transformBase(params);
  return base;
}

/**
 * 描述：基于基本转换
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|second
 * @returns {any}
 */
export function transformYear(params: string | YearParams) {
  return transformBase(params);
}

/**
 * 描述
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string|frequency
 * @returns {any}
 */
export function transformFrequency(params: string | FrequencyParams) {
  /**
   * 目前市面上有3种解析方式
   * Linux:5个字段
   * Java(Spring):6个字段
   * Java(Quartz):7个字段
   */
  if (typeof params === 'string') {
    const frequencyArr = params.split(' ');
    let frequency;
    const type = getCronType(params);
    if (type === 'linux') {
      frequency = {
        minute: frequencyArr[0],
        hour: frequencyArr[1],
        day: frequencyArr[2],
        moth: frequencyArr[3],
        week: frequencyArr[4],
      };
    }
    if (type === 'spring') {
      frequency = {
        second: frequencyArr[0],
        minute: frequencyArr[1],
        hour: frequencyArr[2],
        day: frequencyArr[3],
        moth: frequencyArr[4],
        week: frequencyArr[5],
      };
    }
    if (type === 'quartz') {
      frequency = {
        second: frequencyArr[0],
        minute: frequencyArr[1],
        hour: frequencyArr[2],
        day: frequencyArr[3],
        moth: frequencyArr[4],
        week: frequencyArr[5],
        year: frequencyArr[6],
      };
    }
    return frequency;
  }
  const { second, minute, hour, day, moth, week, year } = params;
  return join([second, minute, hour, day, moth, week, year], ' ');
}
const all = {
  second: transformSecond,
  minute: transformMinute,
  hour: transformHour,
  day: transformDay,
  moth: transformMoth,
  week: transformWeek,
  year: transformYear,
};
export default function transform(params: string | TransformParams) {
  if (typeof params === 'string') {
    const frequency = transformFrequency(params);
    const obj = {};
    Object.entries(frequency).forEach(([key, value]) => {
      obj[key] = all[key](value);
    });
    return obj;
  }
  const obj: FrequencyParams = {
    second: '',
    minute: '',
    hour: '',
    day: '',
    moth: '',
    week: '',
    year: '',
  };
  if (!params.second && !params.year) {
    // linux
    Object.entries(params).forEach(([key, value]) => {
      obj[key] = all[key](value);
    });
  } else {
    // spring and  quartz
    obj.week = all.week(params.week, true) as string;
    Object.entries(params).forEach(([key, value]) => {
      obj[key] = all[key](value);
      if (key === 'day') {
        const weekIsNull = obj.week === '?';
        obj[key] = all[key](value, !weekIsNull) as string;
      }
      if (key === 'week') {
        const dayIsNull = obj.day === '?';
        obj[key] = all[key](value, !dayIsNull) as string;
      }
    });
  }

  return transformFrequency(obj);
}
