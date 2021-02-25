import React, { useState, useEffect } from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { Card, Select, Divider } from 'antd';
import { translate } from './utils/cron';
import { getSchedulingTime, transformByType } from './utils';
import { DEFAULT_VALUE } from './constant';
import { constant } from './utils/cron/transform';
import { Frequency, Pro, ResultView } from './component';
import getPrefixCls from '../_util/getPrefixCls';
import './style/index.less';

export interface CronBaseProps {
  value?: string;
  onChange?: (value: string) => void;
  type?: 'linux' | 'spring' | 'quartz';
  prefixCls?: string;
}
export interface CronProps extends CronBaseProps {
  shortcuts?: { value: string; text: string }[];
  mode?: 'default' | 'pro';
  defaultValue?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const getCronTranslate = (translateStr) => {
  return translateStr === '' || translateStr === 'cron表达式不合法' ? translateStr : `${translateStr}执行`;
};

export const getCronExample = (translateStr, CronValue, ResultViewTimes) => {
  return translateStr === 'cron表达式不合法'
    ? ['']
    : getSchedulingTime(CronValue, ResultViewTimes).map((item) => {
        if (/error/.test(item)) {
          return '暂不支持调度解析';
        }
        return moment(item).format('YYYY-MM-DD HH:mm:ss');
      });
};

export const getTimeValue = (timeValue: string, unit: string) => {
  if (unit === '周') {
    return constant.week.emum[timeValue];
  }
  return `${timeValue}${unit}`;
};

export const defaultOptions = {
  translateMode: {
    week: (params) => {
      const appointReg = /^([1-7])#([1-5])$/;
      if (appointReg.test(params)) {
        return `第${(appointReg.exec(params) as string[])[2]}周的${constant.week.emum[(appointReg.exec(params) as string[])[1]]}`;
      }
      return false;
    },
    appointMode: ({ cur, index, arr, type: modeType }) => {
      let mark = '，';
      const appointUnit = {
        second: '秒',
        minute: '分',
        hour: '点',
        day: '日',
        moth: '月',
        week: '周',
        year: '年',
      };
      if (index === arr.length - 1) {
        mark = '';
      }
      if (typeof cur === 'string' || typeof cur === 'number') {
        return `${getTimeValue(cur as string, appointUnit[modeType])}${mark}`;
      }
      const curStr = `${getTimeValue(cur.start, appointUnit[modeType])}到${getTimeValue(cur.end, appointUnit[modeType])}${mark}`;
      return curStr;
    },
    stepMode: ({ curs, indexs, arrs, type: modeType, step, index, arr }) => {
      let mark = '，';
      if (indexs === arrs.length - 1 && index === arr.length - 1) {
        mark = '';
      }
      const appointUnit = {
        second: '秒',
        minute: '分',
        hour: '点',
        day: '日',
        moth: '月',
        week: '周',
        year: '年',
      };
      const stepUnit = {
        second: '秒',
        minute: '分钟',
        hour: '小时',
        day: '天',
        moth: '月',
        week: '周',
        year: '年',
      };
      const curStr = `${getTimeValue(curs.start, appointUnit[modeType])}到${getTimeValue(curs.end, appointUnit[modeType])}每${step}${
        stepUnit[modeType]
      }${mark}`;
      return curStr;
    },
  },
};

const Cron: React.FC<CronProps> = ({
  value,
  onChange,
  prefixCls: customizePrefixCls,
  style,
  className,
  defaultValue,
  shortcuts = [
    { value: '0 0 0-23/1 * * ? *', text: '每小时' },
    { value: '0 0 18-23 * * ? *', text: '每天晚上' },
    { value: '0 0 0 ? * 6 *', text: '每周五' },
  ],
  type = 'quartz',
  mode = 'default',
  title = '频度设置',
}) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const [Mode, setMode] = useState(mode);
  const newDefaultValue = defaultValue || DEFAULT_VALUE[type][mode];
  const [CronValue, setCronValue] = useState(value || transformByType(newDefaultValue, type));
  const [LinkCount, setLinkCount] = useState(0);
  const [ResultViewTimes, setResultViewTimes] = useState(5);
  useEffect(() => {
    if (onChange) {
      onChange(CronValue);
    }
  }, [CronValue]);
  useEffect(() => {
    if (value) {
      setCronValue(value);
    }
  }, [value]);
  const resetValue = (v) => {
    setCronValue(DEFAULT_VALUE[type][v]);
  };
  // 标题区右侧配置
  const extra = (
    <>
      {shortcuts
        .filter((_, index) => index < 3)
        .map((item, index) => (
          <span key={item.value}>
            {index !== 0 && <Divider type="vertical" />}
            <a
              onClick={() => {
                if (item.value !== CronValue) {
                  const count = LinkCount + 1;
                  setLinkCount(count);
                }
                const str = transformByType(item.value, type);
                setCronValue(str);
              }}
              style={{ marginRight: 10 }}
            >
              {item.text}
            </a>
          </span>
        ))}
      <Select
        onChange={(v: 'default' | 'pro') => {
          setMode(v);
          resetValue(v);
        }}
        value={Mode}
        style={{ width: 100, marginLeft: 10 }}
      >
        <Select.Option value="default">默认模式</Select.Option>
        <Select.Option value="pro">专业模式</Select.Option>
      </Select>
    </>
  );
  const translateStr = translate(CronValue, defaultOptions);
  return (
    <div
      className={classnames(`${prefixCls}-main ${className}`, {
        [`${className}`]: !!className,
      })}
      style={style}
    >
      <Card title={title} extra={extra} style={{ width: 702 }}>
        <div className={`${prefixCls}-config`}>
          {Mode === 'default' && <Frequency LinkCount={LinkCount} value={CronValue} onChange={setCronValue} type={type} />}
          {Mode === 'pro' && <Pro value={CronValue} onChange={setCronValue} type={type} />}
        </div>
        <ResultView
          loadMore={() => {
            setResultViewTimes(ResultViewTimes + 5);
          }}
          result={getCronExample(translateStr, CronValue, ResultViewTimes)}
          desc={getCronTranslate(translateStr)}
        />
      </Card>
    </div>
  );
};

export default Cron;
