import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Select as SelectAntd, Spin } from 'antd';
import type {
  OptionProps as OptionPropsAntd,
  SelectProps as SelectPropsAntd,
} from 'antd/es/select/index';
import { getType } from '@/_util/other';

export interface OptionProps extends OptionPropsAntd {
  text: string;
  value: string;
}

export interface SelectProps<VT> extends SelectPropsAntd<VT> {
  config?: OptionProps[] | object;
  allowAll?: boolean;
  request?: () => { data: OptionProps[] | object };
}

const transformConfig = (config: OptionProps[] | object) => {
  let configs = [];
  if (getType(config) === 'Array') {
    configs = config as [];
  }
  if (getType(config) === 'Object') {
    configs = Object.entries(config).map(([key, value]) => {
      if (getType(value) === 'String' || getType(value) === 'Number') {
        return { value: key, text: value };
      }
      return { value: key, ...value };
    });
  }
  return configs;
};

const Select: React.FC<SelectProps> = ({ config, allowAll, request, ...rest }, ref) => {
  // 获取请求数据
  const [RequestData, setRequestData]: any = useState({
    data: undefined,
    loading: false,
  });

  const requests = async () => {
    if (request) {
      setRequestData({ data: undefined, loading: true });
      const { data } = await request();
      setRequestData({ data, loading: false });
    }
  };
  useEffect(() => {
    requests();
  }, []);
  // 子项配置转换, 有请求优先使用请求来的数据
  const configs = transformConfig(RequestData.data || config);
  useImperativeHandle(ref, () => ({
    requests,
  }));
  return (
    <Spin spinning={RequestData.loading}>
      <SelectAntd {...rest}>
        {allowAll && <SelectAntd.Option value="">全部</SelectAntd.Option>}
        {configs.map(({ text, value, ...restChild }, index) => (
          <SelectAntd.Option key={value || index} value={value} {...restChild}>
            {text}
          </SelectAntd.Option>
        ))}
      </SelectAntd>
    </Spin>
  );
};
export default forwardRef(Select);
