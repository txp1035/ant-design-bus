import React, { useState, useRef, useEffect } from 'react';
import { Divider } from 'antd';
import { DownOutlined, UpOutlined, EllipsisOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import getPrefixCls from '../../../_util/getPrefixCls';

export interface ResultViewProps {
  result?: string[];
  desc?: string;
  loadMore: () => void;
  prefixCls?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, desc, loadMore, prefixCls: customizePrefixCls }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  const [fold, setFold] = useState(true);
  const [scrollCount, setScrollCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollCount > 0) {
      const top = ref.current.scrollHeight - ref.current.clientHeight;
      ref.current.scrollTop = top > 0 ? top : 0;
    }
  }, [scrollCount]);
  const isLongDec = desc.length > 100;
  return (
    <div className={`${prefixCls}-overview`} style={{ padding: fold ? '8px 0' : '16px 0' }}>
      <div
        // TODO: 一行水平垂直居中，多行从头开始
        className={classnames(`${prefixCls}-desc`, {
          [`${prefixCls}-desc-fold`]: fold,
          [`${prefixCls}-desc-no-fold`]: !fold && !isLongDec,
          [`${prefixCls}-desc-no-fold-long`]: !fold && isLongDec,
        })}
      >
        {desc}
      </div>
      <Divider type="vertical" style={{ height: 'initial', margin: '0 16px' }} />
      <div>
        {fold ? (
          <div className={`${prefixCls}-first-row`}>
            <span>{result && result[0]}</span>
            <DownOutlined style={{ cursor: 'pointer' }} onClick={() => setFold(!fold)} />
          </div>
        ) : (
          <div className={`${prefixCls}-result-list`}>
            <UpOutlined className={`${prefixCls}-upoutlined`} onClick={() => setFold(!fold)} />
            <div className={`${prefixCls}-content`}>
              <div ref={ref} className={`${prefixCls}-list`}>
                {' '}
                {result && result?.map((x) => <div key={x}>{x}</div>)}
              </div>
              {result && result.length > 1 && (
                <EllipsisOutlined
                  className={`${prefixCls}-ellipsis`}
                  onClick={() => {
                    setScrollCount(scrollCount + 1);
                    loadMore();
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;
