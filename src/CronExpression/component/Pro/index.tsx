import React, { useState, useEffect, useRef, useLayoutEffect, forwardRef } from 'react';
import { Tooltip, Input } from 'antd';
import classnames from 'classnames';
import { check } from '../../utils/cron';
import type { CronBaseProps } from '../../index';
import { MARK } from '../../constant';
import { constant } from '../../utils/cron/transform';
import getPrefixCls from '../../../_util/getPrefixCls';

const disableInput = (Errors, keyFrequency) => {
  if (Errors === keyFrequency) {
    return false;
  }
  if (Errors !== '') {
    return true;
  }
  return false;
};

const WidthInput = forwardRef(({ value, prefixCls, onChange, disabled, className, onBlur, onFocus }: any, ref: any) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    setWidth(spanRef.current.scrollWidth);
  }, [value]);
  return (
    <div style={{ width }} className={`${prefixCls}-pro-input`}>
      <span ref={spanRef}>{value}</span>
      <Input onBlur={onBlur} onFocus={onFocus} ref={ref} value={value} className={className} onChange={onChange} disabled={disabled} />
    </div>
  );
});

export default ({ value, onChange, type, prefixCls: customizePrefixCls }: CronBaseProps) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const [activeStep, updateStep] = useState('');
  const [Error, setError] = useState('');
  const contentEditable = {
    second: useRef<HTMLDivElement>(null),
    minute: useRef<HTMLDivElement>(null),
    hour: useRef<HTMLDivElement>(null),
    day: useRef<HTMLDivElement>(null),
    moth: useRef<HTMLDivElement>(null),
    week: useRef<HTMLDivElement>(null),
    year: useRef<HTMLDivElement>(null),
  };
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
  const onChangeInput = (e: any, index) => {
    const arr = value.split(' ');
    arr[index] = e.target.value;
    onChange(arr.join(' '));
  };
  const page = (
    <div className={`${prefixCls}-pro`}>
      <div className={`${prefixCls}-frequency-input`}>
        {Object.entries(constant.frequency[type]).map(([keyFrequency], index) => {
          const disabled = disableInput(Error, keyFrequency);
          return (
            <WidthInput
              onBlur={() => {
                updateStep('');
              }}
              onFocus={() => {
                updateStep(keyFrequency);
              }}
              key={keyFrequency}
              prefixCls={prefixCls}
              ref={contentEditable[keyFrequency]}
              value={value.split(' ')[index]}
              className={classnames(
                { [`${prefixCls}-active-step`]: activeStep === keyFrequency },
                { [`${prefixCls}-active-error`]: Error === keyFrequency },
              )}
              disabled={disabled}
              onChange={(e) => {
                onChangeInput(e, index);
              }}
            />
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
              onClick={() => {
                if (Error === '') {
                  contentEditable[keyFrequency].current.focus();
                }
              }}
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
