import React, { useState } from 'react';
import { CronExpression } from '@alipay/tech-ui';

export default () => {
  const [Value, setValue] = useState('0-59/1 * * * * ? *');
  return (
    <CronExpression
      value={Value}
      onChange={(value) => {
        setValue(value);
      }}
    />
  );
};
