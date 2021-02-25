import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Button } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import Empty from './Empty';
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

const Frequency: React.FC<FrequencyProps> = ({
  value,
  onChange,
  type,
  prefixCls: customizePrefixCls,
  LinkCount,
}) => {
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
        .filter(([, values]) => !(values.isCommon || values.isAppoint))
        .map(([keys]) => keys);
      setItems([...frequencyKey]);
    } else {
      // 值变动后如果比items多就增加
      const frequencyKey = Object.entries(translationalValue)
        .filter(([keys, values]) => {
          if (Items.includes(keys)) {
            return false;
          }
          if (values.isCommon || values.isAppoint) {
            return false;
          }
          return true;
        })
        .map(([keys]) => keys);
      setItems([...Items, ...frequencyKey]);
    }
  }, [value]);

  const transformInValue = values => {
    const { list, ...rest } = values;
    if (list && list.length > 0) {
      let steps = '';
      const transformList = list.map(item => {
        if (typeof item === 'string') {
          return item;
        }
        if (item.step) {
          steps = item.step;
        }
        return `${item.start}-${item.end}`;
      });
      return {
        list: transformList,
        step: steps,
        ...rest,
      };
    }
    return values;
  };
  const transformOutValue = (values, types) => {
    const { list = [], step, ...rest } = values;
    let hasRage = false;
    if (list && list.length >= 0) {
      const transformList = list.map(item => {
        const reg = /([^!]+)-([^!]+)/;
        if (reg.test(item)) {
          hasRage = true;
          const start = reg.exec(item)[1];
          const end = reg.exec(item)[2];
          return {
            start,
            end,
            step,
          };
        }
        return item;
      });
      if (!hasRage && step) {
        const emun = Object.keys(constant[types].emum)
          .map(item => item)
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
    }
    return values;
  };
  const onChangeFrequency = (types, values) => {
    const frequencyValue = transformOutValue(values, types);
    const changedValue = { ...translationalValue, [types]: frequencyValue };
    const string = transform(changedValue);
    onChange(string);
  };
  const renderFrequency = frequencyKey => {
    if (frequencyKey === '') {
      return <Empty />;
    }
    const frequencyValue = translationalValue[frequencyKey];
    const options = {
      onChange: values => {
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
    if (frequencyKey === 'week') {
      return <Week {...options} />;
    }
    if (frequencyKey === 'day') {
      return <Day {...options} />;
    }
    return <Base {...options} />;
  };
  const canAdd = checkFrequency(Items, type);
  return (
    <>
      {Items.map((item, index) => (
        <Row key={item} className={`${prefixCls}-frequency-row`}>
          <Col className={classnames(`${prefixCls}-item`, `${prefixCls}-type`)}>
            <ClockCircleOutlined className={`${prefixCls}-clock`} />
            <Select
              value={item}
              onChange={values => {
                const arr = [...Items];
                const oldFrequency = arr[index];
                arr[index] = values;
                if (oldFrequency !== '') {
                  onChangeFrequency(item, { ...translationalValue, [oldFrequency]: {} });
                }
                setItems(arr);
              }}
              style={{ width: 80, marginRight: 12 }}
            >
              {Object.entries(constant.frequency[type]).map(([keys, values]) => {
                let disabled = Items.find(items => items === keys);
                if (type === 'quartz' || type === 'spring') {
                  if (Items.find(items => items === 'week') && keys === 'day') {
                    disabled = true;
                  }
                  if (Items.find(items => items === 'day') && keys === 'week') {
                    disabled = true;
                  }
                }
                return (
                  <Select.Option key={keys} disabled={disabled} value={keys}>
                    {values}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          {renderFrequency(item)}
          <Col
            className={classnames(`${prefixCls}-item`, `${prefixCls}-type`)}
            style={{ width: 'calc(100% - 654px)' }}
          >
            <DeleteOutlined
              className={`${prefixCls}-delete`}
              onClick={() => {
                const arr = [...Items];
                arr.splice(index, 1);
                onChangeFrequency(item, { ...translationalValue, [item]: {} });
                setItems(arr);
              }}
            />
          </Col>
        </Row>
      ))}
      <Button
        disabled={!canAdd}
        type="dashed"
        onClick={() => {
          setItems([...Items, '']);
        }}
        style={{ width: '100%' }}
      >
        <PlusOutlined /> 添加设置
      </Button>
    </>
  );
};
export default Frequency;
