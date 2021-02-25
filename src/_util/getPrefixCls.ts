const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
  const prefixCls = 'antdbus';

  if (customizePrefixCls) return customizePrefixCls;

  return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;
};

export default getPrefixCls;
