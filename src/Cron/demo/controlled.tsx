import React, { useState } from 'react';
import { Cron } from 'ant-design-bus';

export default () => {
  const [Value, setValue] = useState('* * * * * ? *');
  return (
    <Cron
      value={Value}
      onChange={value => {
        setValue(value);
      }}
    />
  );
};
