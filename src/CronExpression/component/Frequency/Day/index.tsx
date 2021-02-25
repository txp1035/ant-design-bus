import React from 'react';
import { Radio } from 'antd';
import classnames from 'classnames';
import getPrefixCls from '../../../../_util/getPrefixCls';
import AppointSelect from '../Base/AppointSelect';

export interface DayProps {
  value: {
    step: number;
    list: string[];
    isLastDay: boolean;
  };
  LinkCount: number;
  dataSource: any;
  onChange: (data: any) => void;
  prefixCls?: string;
}

const Day: React.FC<DayProps> = ({ value = {}, dataSource = {}, onChange, LinkCount, prefixCls: customizePrefixCls }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const { appointData = {} } = dataSource;
  const { list = [], isLastDay } = value;
  const handleChange = (data: any, type: 'step' | 'list' | 'isLastDay') => {
    if (onChange) {
      onChange({ ...value, [type]: data });
    }
  };
  const listStr = list.length !== 0 ? 'list' : '';
  const isLastDayStr = isLastDay && 'isLastDay';
  const RadioValue = listStr || isLastDayStr || '';
  const radioChange = (e) => {
    if (e.target.value === 'isLastDay') {
      onChange({ ...value, list: [], isLastDay: true });
    }
    if (e.target.value === 'list') {
      onChange({ ...value, list: [Object.keys(appointData)[0]], isLastDay: false });
    }
  };
  return (
    <Radio.Group style={{ display: 'flex' }} onChange={radioChange} value={RadioValue}>
      <div className={classnames(`${prefixCls}-item`, `${prefixCls}-step`)}>
        <Radio className={`${prefixCls}-input`} value="isLastDay">
          本月最后一天
        </Radio>
      </div>
      <div className={`${prefixCls}-item`}>
        <Radio value="list" className={`${prefixCls}-input`} />
        <AppointSelect
          LinkCount={LinkCount}
          disabled={RadioValue !== 'list'}
          dataSource={appointData}
          list={list}
          onChange={(val) => {
            handleChange(val, 'list');
          }}
        />
      </div>
    </Radio.Group>
  );
};

export default Day;
