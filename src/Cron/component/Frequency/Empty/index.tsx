import React from 'react';
import getPrefixCls from '../../../../_util/getPrefixCls';

const Empty: React.FC<any> = ({ prefixCls: customizePrefixCls }) => {
  const prefixCls = getPrefixCls('cron-expression', customizePrefixCls);
  return (
    <>
      <span className={`${prefixCls}-empty-step`}>- -</span>
      <span className={`${prefixCls}-empty-appoint`}>- -</span>
    </>
  );
};

export default Empty;
