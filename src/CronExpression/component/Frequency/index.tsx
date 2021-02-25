import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Button } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import Base from './Base';
import Day from './Day';
import Week from './Week';
import type { CronBaseProps } from '../../index';
import { checkFrequency } from '../../utils';
import transform, { constant } from '../../utils/cron/transform';
import getPrefixCls from '../../../_util/getPrefixCls';

export interface FrequencyProps extends CronBaseProps {
  LinkCount: number;
}

// 互斥
export const mutex = (Items, type, keys) => {
  if (type === 'quartz' || type === 'spring') {
    if (Items.find((items) => items === 'week') && keys === 'day') {
      return true;
    }
    if (Items.find((items) => items === 'day') && keys === 'week') {
      return true;
    }
  }
  return false;
};
// 转换输入的值
export const transformInValue = (values) => {
  const { list = [], ...rest } = values;
  let steps = '';
  const transformList = list
    .filter((item) => {
      if (item && item.step) {
        steps = item.step;
        return false;
      }
      return true;
    })
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      return `${item.start}-${item.end}`;
    });
  return {
    list: transformList,
    step: steps,
    ...rest,
  };
};
// 转换输出的值
export const transformOutValue = (values, types) => {
  const { list = [], step, ...rest } = values;
  const transformList = list.map((item) => {
    const reg = /([^!]+)-([^!]+)/;
    if (reg.test(item)) {
      const start = reg.exec(item)[1];
      const end = reg.exec(item)[2];
      return {
        start,
        end,
      };
    }
    return item;
  });
  if (step) {
    const emun = Object.keys(constant[types].emum)
      .map((item) => item)
      .sort((a, b) => Number(a) - Number(b));
    const start = emun[0];
    const end = emun[emun.length - 1];
    transformList.push({
      start,
      end,
      step,
    });
  }
  return {
    list: transformList,
    ...rest,
  };
};
// 输出的值转换为字符串
export const getTransformString = (types, values, translationalValue) => {
  const frequencyValue = transformOutValue(values, types);
  const changedValue = { ...translationalValue, [types]: frequencyValue };
  const string = transform(changedValue);
  return string;
};

// 重置值
const restStr = (frequencyType: string, cronObj: object, uiArr: string[]) => {
  // cronObj和uiArr对比，uiArr中有的值保持不变，其他值重置为*
  // uiArr 中拿到最小的频率，重置值过程中如果有频率比uiArr最小频率还小重置为0
  // 权重
  const weight = {
    second: 1,
    minute: 2,
    hour: 3,
    day: 4,
    moth: 5,
    week: 4,
    year: 6,
  };
  // 找到uiArr中权重最低的频率
  const uiArrForNumber = uiArr.map((item) => ({ key: item, weight: weight[item] }));
  // 从小到大排序
  uiArrForNumber.sort((a, b) => a.weight - b.weight);
  // 拿到最小的频率
  const minFrequency = uiArrForNumber.shift().key;
  const common = {
    isCommon: true,
    list: undefined,
  };
  const zero = {
    isCommon: false,
    list: ['0'],
  };
  const newCronObj = {};
  Object.entries(cronObj).forEach(([key, value]) => {
    // 其他频率重置
    newCronObj[key] = common;
    // 比最小频率还小的频率为0
    if (weight[key] < weight[minFrequency]) {
      newCronObj[key] = zero;
    }
    // ui上的频率保持不变
    if (uiArr.includes(key)) {
      newCronObj[key] = value;
    }
  });
  const string = getTransformString(frequencyType, { step: '1' }, newCronObj);
  return string;
};

const Frequency: React.FC<FrequencyProps> = ({ value, onChange, type, prefixCls: customizePrefixCls, LinkCount }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const [Items, setItems] = useState([]);
  const translationalValue: object = transform(value);
  let isLink = false;
  useEffect(() => {
    isLink = true;
  }, [LinkCount]);
  useEffect(() => {
    if (isLink) {
      // 通过link点击重置ui
      const frequencyKey = Object.entries(translationalValue)
        .filter(([, values]) => {
          //* 和?不显示
          if (values.isCommon || values.isAppoint) {
            return false;
          }
          // 指定为0不显示
          if (
            values.isCommon === false &&
            'list' in values &&
            typeof values.list === 'object' &&
            values.list.length === 1 &&
            values.list[0] === '0'
          ) {
            return false;
          }
          return true;
        })
        .map(([keys]) => keys);
      setItems([...frequencyKey]);
    }
  }, [value]);
  const onChangeFrequency = (types, values) => {
    const string = getTransformString(types, values, translationalValue);
    onChange(string);
  };
  const renderFrequency = (frequencyKey) => {
    const frequencyValue = translationalValue[frequencyKey];
    const options = {
      onChange: (values) => {
        onChangeFrequency(frequencyKey, values);
      },
      value: transformInValue(frequencyValue),
      dataSource: {
        stepData: constant[frequencyKey].stepEmum,
        appointData: constant[frequencyKey].emum,
        unit: constant.frequency[type][frequencyKey],
      },
      LinkCount,
    };
    if (frequencyKey === 'week' && type !== 'linux') {
      return <Week {...options} />;
    }
    if (frequencyKey === 'day' && type !== 'linux') {
      return <Day {...options} />;
    }
    return <Base {...options} />;
  };
  const canAdd = checkFrequency(Items, type);
  return (
    <div className={`${prefixCls}-frequency`}>
      {Items.map((item, index) => (
        <Row key={item} className={`${prefixCls}-frequency-row`}>
          <Col className={classnames(`${prefixCls}-item`, `${prefixCls}-type`)}>
            <ClockCircleOutlined className={`${prefixCls}-clock`} />
            <Select
              value={item}
              onChange={(values) => {
                const arr = [...Items];
                arr[index] = values;
                const string = restStr(values, translationalValue, arr);
                onChange(string);
                setItems(arr);
              }}
              style={{ width: 80, marginRight: 12 }}
            >
              {Object.entries(constant.frequency[type]).map(([keys, values]) => {
                const disabled = Items.find((items) => items === keys) || mutex(Items, type, keys);
                return (
                  <Select.Option key={keys} disabled={disabled} value={keys}>
                    {values}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          {renderFrequency(item)}
          <Col className={classnames(`${prefixCls}-item`, `${prefixCls}-type`)} style={{ width: 'calc(100% - 654px)' }}>
            {Items.length > 1 && (
              <DeleteOutlined
                className={`${prefixCls}-delete`}
                onClick={() => {
                  const arr = [...Items];
                  arr.splice(index, 1);
                  onChangeFrequency(item, { ...translationalValue, [item]: {} });
                  setItems(arr);
                }}
              />
            )}
          </Col>
        </Row>
      ))}
      <Button
        disabled={!canAdd}
        type="dashed"
        onClick={() => {
          const arr = Object.keys(constant.frequency[type]).filter((item) => {
            if (mutex(Items, type, item)) {
              return false;
            }
            return !Items.find((items) => item === items);
          });
          const newArr = [...Items, arr[0]];
          const string = restStr(arr[0], translationalValue, newArr);
          onChange(string);
          setItems(newArr);
        }}
        style={{ width: '100%' }}
      >
        <PlusOutlined /> 添加设置
      </Button>
    </div>
  );
};
export default Frequency;
