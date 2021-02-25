import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import ContentEditable from 'react-contenteditable';
import { check } from '../../utils/cron';
import type { CronBaseProps } from '../../index';
import { MARK } from '../../constant';
import { constant } from '../../utils/cron/transform';
import getPrefixCls from '../../../_util/getPrefixCls';

export default ({ value, onChange, type, prefixCls: customizePrefixCls }: CronBaseProps) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const [activeStep, updateStep] = useState('');
  const [Error, setError] = useState('');
  useEffect(() => {
    const result = check(value);
    if (typeof result === 'object') {
      Object.entries(result).forEach(([keys, values]) => {
        if (!values) {
          setError(keys);
        }
      });
    }
    if (result === true) {
      setError('');
    }
  }, [value]);
  const page = (
    <div className={`${prefixCls}-pro`}>
      <div className={`${prefixCls}-frequency-input`}>
        {Object.entries(constant.frequency[type]).map(([keyFrequency], index) => {
          const contentEditable = React.createRef<HTMLPreElement>();
          let disabled = false;
          if (Error !== '') {
            disabled = true;
          }
          if (Error === keyFrequency) {
            disabled = false;
          }
          const onChangeInput = (e: any) => {
            const arr = value.split(' ');
            arr[index] = e.target.value;
            onChange(arr.join(' '));
          };
          return (
            <div
              key={keyFrequency}
              className={classnames(
                { [`${prefixCls}-active-step`]: activeStep === keyFrequency },
                { [`${prefixCls}-active-error`]: Error === keyFrequency },
              )}
            >
              <ContentEditable
                innerRef={contentEditable}
                html={value.split(' ')[index]} // innerHTML of the editable div
                className={`${prefixCls}-editable-content`}
                disabled={disabled} // use true to disable editing
                onChange={debounce(onChangeInput, 500)} // handle innerHTML change
              />
            </div>
          );
        })}
      </div>
      <div className={`${prefixCls}-desc-options`}>
        {Object.entries(constant.frequency[type]).map(([keyFrequency, valueFrequency]) => (
          <Tooltip
            key={keyFrequency}
            placement="bottom"
            overlayClassName={`${prefixCls}-desc-container`}
            visible={Error === keyFrequency}
            title={
              <ul>
                {MARK[type][keyFrequency].map(([left, right]) => (
                  <li key={`${left}${right}`}>
                    <span>{left}</span>
                    <div>{right}</div>
                  </li>
                ))}
              </ul>
            }
          >
            <div
              key={keyFrequency}
              className={classnames(
                { [`${prefixCls}-active-step-font`]: activeStep === keyFrequency },
                { [`${prefixCls}-active-error-font`]: Error === keyFrequency },
                `${prefixCls}-dec`,
              )}
              onClick={() => updateStep(keyFrequency)}
            >
              {valueFrequency}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
  return page;
};
