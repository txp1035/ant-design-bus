import React from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import type { base } from '../../../utils/cron/transform';
import type { AppointDataSource } from './AppointSelect';
import AppointSelect from './AppointSelect';
import getPrefixCls from '../../../../_util/getPrefixCls';
import type { stepDataSource } from './Step';
import Step from './Step';

export interface valueObj extends base {
  step: string;
  list: string[];
}
export interface dataSource {
  stepData: stepDataSource;
  unit: string;
  appointData: AppointDataSource;
}
export interface BaseProps {
  value: valueObj;
  onChange: (data: any) => void;
  dataSource: dataSource;
  prefixCls?: string;
  LinkCount: number;
}

const Base: React.FC<BaseProps> = ({
  dataSource = {},
  value = {},
  onChange,
  LinkCount,
  prefixCls: customizePrefixCls,
}) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const { stepData = {}, appointData = {}, unit = '' } = dataSource;
  const { step = '', list = [] } = value;
  // bind onChange
  const handleChange = (data: any, type: 'step' | 'list') => {
    if (onChange) {
      onChange({ ...value, [type]: data });
    }
  };

  const changeCheckboxStep = e => {
    if (e.target.checked) {
      handleChange(Object.keys(stepData)[0], 'step');
    } else {
      handleChange('', 'step');
    }
  };
  const changeCheckboxAppoint = e => {
    if (e.target.checked) {
      onChange({ ...value, list: [Object.keys(appointData)[0]] });
    } else {
      onChange({ ...value, list: [] });
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <div className={classnames(`${prefixCls}-item`, `${prefixCls}-step`)}>
        <Checkbox
          checked={!!(value && value.step)}
          onChange={changeCheckboxStep}
          className={`${prefixCls}-input`}
        />
        <Step
          stepDataSource={stepData}
          unit={unit}
          value={step}
          onChange={val => {
            handleChange(val, 'step');
          }}
        />
      </div>
      <div className={`${prefixCls}-item`}>
        <Checkbox
          checked={!!list.length}
          onChange={changeCheckboxAppoint}
          className={`${prefixCls}-input`}
        />
        <AppointSelect
          LinkCount={LinkCount}
          dataSource={appointData}
          list={list}
          onChange={val => {
            handleChange(val, 'list');
          }}
        />
      </div>
    </div>
  );
};

export default Base;
