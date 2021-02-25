## SelectConfig

基础使用:

```tsx
import React from 'react';
import { SelectConfig } from 'ant-design-bus';

export default () => {
  const config = [
    {
      text: '1',
      value: '1',
    },
    {
      text: '2',
      value: '3',
    },
  ];
  return <SelectConfig config={config} />;
};
```

对象参数使用:

```tsx
import React from 'react';
import { SelectConfig } from 'ant-design-bus';

export default () => {
  const config = {
    1: 1,
    2: 2,
  };
  return <SelectConfig config={config} />;
};
```

## 说明

### 支持全部选项

### 支持两种子选项配置格式

对象式

`{value:text}`

value 为下拉框的 value 值，text 为下拉框的显示值

`{value:{text:'',...rest}}`

value 为下拉框的 value 值，text 为下拉框的显示值，rest 为下拉框 options 的属性

数组式

`[{value:'',text:'',...rest}]`

value 为下拉框的 value 值，text 为下拉框的显示值，rest 为下拉框 options 的属性

### 支持请求获取数据
