import React, { useState, useEffect } from 'react';
import { Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import getPrefixCls from '../../../../_util/getPrefixCls';
import { arrToObj } from '../../../utils/cron/utils';

const { Option } = Select;

export type AppointDataSource = Record<string, string>;

export interface AppointProps {
  dataSource: AppointDataSource;
  list: null | string[];
  onChange: (data: any) => void;
  width?: number;
  LinkCount: number;
  disabled?: boolean;
  prefixCls?: string;
}

const disabledRange = ({ limitTop, limitBottom }: any) => {
  if (limitTop === null || limitBottom === null) {
    return false;
  }
  // 区间选择应该至少2个跨度，1个跨度和单选没区别无意义
  return Number(limitBottom) - Number(limitTop) <= 1;
};

const AppointSelect: React.FC<AppointProps> = ({
  dataSource = {},
  list,
  onChange,
  width,
  LinkCount,
  disabled = false,
  prefixCls: customizePrefixCls,
}) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const filterList = (list && list.filter((x: string) => x.indexOf('-') !== -1)) || [];
  const defaultItems = { ...dataSource, ...arrToObj(filterList) };
  const [items, setItems] = useState(defaultItems);
  useEffect(() => {
    // 如果通过连接变动更新下拉列表
    setItems(defaultItems);
  }, [LinkCount]);
  const [name, setItemsName] = useState({
    limitTop: null,
    limitBottom: null,
  });
  // 增加区间item
  const addItem = () => {
    const { limitTop, limitBottom } = name;
    if (limitTop && limitBottom) {
      setItems({
        ...items,
        [`${limitTop}-${limitBottom}`]: `${dataSource[limitTop || '']}到${
          dataSource[limitBottom || '']
        }`,
      });
      setItemsName({
        limitTop: null,
        limitBottom: null,
      });
    }
    // TODO: 区间点击添加不能添加的时候要不要加个提示
  };
  // 动态改变输入框区间值,并增加到Item上
  const handleNameChange = (e, type: 'limitTop' | 'limitBottom') => {
    setItemsName({
      ...name,
      [type]: e,
    });
  };
  // 处理select事件穿透问题
  const [open, setOpen] = useState(false);
  let lock: NodeJS.Timeout | null = null;
  const lockClose = () => {
    if (lock) {
      clearTimeout(lock);
    }
    lock = setTimeout(() => {
      lock = null;
    }, 100);
  };
  return (
    <>
      指定
      <Select
        disabled={disabled}
        value={list}
        placeholder="请选择"
        onDropdownVisibleChange={openValue => {
          if (!lock) {
            setOpen(openValue);
          }
        }}
        open={open}
        className={`${prefixCls}-input`}
        style={{
          width: width || 264,
          height: 32,
          overflow: 'auto',
        }}
        mode="multiple"
        onChange={val => {
          onChange(val);
        }}
        dropdownStyle={
          width
            ? {
                minWidth: 268,
              }
            : {}
        }
        dropdownRender={menu => (
          <div onMouseDown={lockClose} onMouseUp={lockClose}>
            {menu}
            <Divider
              style={{
                margin: '4px 0',
              }}
            />
            <div
              style={{
                padding: 8,
              }}
            >
              <span
                style={{
                  paddingRight: 8,
                }}
              >
                区间
              </span>
              <Select
                showSearch
                value={name && name.limitTop}
                style={{
                  height: '30px',
                  width: 70,
                  marginRight: 4,
                }}
                onSelect={(e: any) => {
                  handleNameChange(e, 'limitTop');
                }}
                // onBlur={(e:any) => { e.preventDefault() }}
              >
                {Object.entries({
                  ...dataSource,
                }).map(([keys, values]) => (
                  <Option
                    disabled={disabledRange({
                      limitTop: keys,
                      limitBottom: name && name.limitBottom,
                    })}
                    key={keys}
                    value={keys}
                  >
                    {values}
                  </Option>
                ))}
              </Select>
              ~
              <Select
                showSearch
                value={name && name.limitBottom}
                style={{
                  height: '30px',
                  width: 70,
                  marginLeft: 4,
                }}
                onSelect={(e: any) => {
                  handleNameChange(e, 'limitBottom');
                }}
              >
                {Object.entries({
                  ...dataSource,
                }).map(([keys, values]) => (
                  <Option
                    disabled={disabledRange({
                      limitTop: name && name.limitTop,
                      limitBottom: keys,
                    })}
                    key={keys}
                    value={keys}
                  >
                    {values}
                  </Option>
                ))}
              </Select>
              <a
                style={{
                  display: 'inline-block',
                  paddingLeft: 8,
                  cursor: 'pointer',
                }}
                onClick={addItem}
              >
                <PlusOutlined /> 添加
              </a>
            </div>
          </div>
        )}
      >
        {Object.entries(items).map(([keys, values]) => (
          <Option key={keys} value={keys}>
            {values}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default AppointSelect;
