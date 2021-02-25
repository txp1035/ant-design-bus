import React from 'react';
import { Select } from 'antd';
import getPrefixCls from '../../../../_util/getPrefixCls';

const { Option } = Select;

export type StepDataSource = Record<string, string>;
export interface StepProps {
  stepDataSource: StepDataSource; // 数据源
  unit: string; // 单位
  value: string;
  onChange: (val: string) => void;
  prefixCls?: string;
}

const Step: React.FC<StepProps> = ({ stepDataSource, unit, value, onChange, prefixCls: customizePrefixCls }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  return (
    <>
      每
      <Select value={value} onChange={onChange} style={{ width: 68 }} className={`${prefixCls}-input`}>
        {Object.entries(stepDataSource).map(([keys, values]) => (
          <Option key={keys} value={keys}>
            {values}
          </Option>
        ))}
      </Select>
      {unit}
    </>
  );
};
export default Step;
