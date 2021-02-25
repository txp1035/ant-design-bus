import React, { useState } from 'react';
import { Select, Radio } from 'antd';
import type { WeekParams } from '../../../utils/cron/transform';
import { constant } from '../../../utils/cron/transform';
import getPrefixCls from '../../../../_util/getPrefixCls';
import AppointSelect from '../Base/AppointSelect';

const { Option } = Select;

export interface WeekProps {
  value: WeekParams;
  LinkCount: number;
  onChange: Function;
  dataSource: any;
  prefixCls?: string;
}

const Week: React.FC<WeekProps> = ({ value = {}, onChange, LinkCount, dataSource = {}, prefixCls: customizePrefixCls }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const { appointData = {} } = dataSource;
  const { list = [], appointValue } = value;
  // 改变值触发onChange传递变化值
  const handleChange = (data: any, type: 'ranking' | 'week' | 'list') => {
    if (type === 'list') {
      if (onChange) {
        onChange({ ...value, list: data });
      }
    }
    if (type === 'week') {
      const { ranking = '' } = appointValue || {};
      if (onChange) {
        onChange({ ...value, appointValue: { week: data, ranking } });
      }
    }
    if (type === 'ranking') {
      const { week = '' } = appointValue || {};
      if (onChange) {
        onChange({ ...value, appointValue: { week, ranking: data } });
      }
    }
  };
  const listStr = list.length !== 0 && 'list';
  const appointValueStr = appointValue && 'appointValue';
  const [RadioValue, setRadioValue] = useState(listStr || appointValueStr || '');
  const radioChange = (e) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'appointValue') {
      onChange({
        ...value,
        list: [],
        appointValue: {
          ranking: Object.keys(constant.week.appointValue.ranking)[0],
          week: Object.keys(appointData)[0],
        },
      });
    }
    if (e.target.value === 'list') {
      onChange({ ...value, list: [Object.keys(appointData)[0]], appointValue: undefined });
    }
  };
  const disableList = RadioValue !== 'list';
  const disableAppoint = RadioValue !== 'appointValue';
  return (
    <Radio.Group style={{ display: 'flex' }} onChange={radioChange} value={RadioValue}>
      <div className={`${prefixCls}-item`} style={{ width: 264 }}>
        <Radio value="appointValue" className={`${prefixCls}-input`} />第
        <Select
          disabled={disableAppoint}
          value={appointValue && appointValue.ranking}
          style={{ width: 60 }}
          className={`${prefixCls}-input`}
          onChange={(e) => {
            handleChange(e, 'ranking');
          }}
        >
          {Object.entries(constant.week.appointValue.ranking).map(([keys]) => (
            <Option key={keys} value={keys}>
              {keys}
            </Option>
          ))}
        </Select>
        周的周
        <Select
          disabled={disableAppoint}
          value={appointValue && appointValue.week}
          style={{ width: 76 }}
          className={`${prefixCls}-input`}
          onChange={(e) => {
            handleChange(e, 'week');
          }}
        >
          {Object.entries(appointData).map(([keys, values]) => (
            <Option key={keys} value={keys}>
              {values}
            </Option>
          ))}
        </Select>
      </div>

      <div className={`${prefixCls}-item`}>
        <Radio value="list" className={`${prefixCls}-input`} />
        <AppointSelect
          LinkCount={LinkCount}
          width={174}
          disabled={disableList}
          dataSource={appointData}
          list={list as string[]}
          onChange={(val) => {
            handleChange(val, 'list');
          }}
        />
      </div>
    </Radio.Group>
  );
};

export default Week;
