## Cron

### 基本例子

 <code src="./demo/uncontrolled.tsx" />

### 受控用法

 <code src="./demo/controlled.tsx" />

### 表单用法

 <code src="./demo/form.tsx" />

## 使用

1、受控、非受控

### 功能简述

- 卡片头
  - 标题：用于卡片头部左测显示
  - 快捷方式：用于快速设置常用 cron 表达式。只支持 3 个快捷方式。点击快捷方式卡片内容会有相应联动。
  - 模式选择框：用于进行 UI 模式和专业模式切换。切换模式重置值。
- 卡片类容
  - 设置值区块
    - 默认模式：有 UI 供用户操作,不设定
      - 秒、分、小时、月：支持步长选择（指定时间不存在段时间时禁用）、指定时间选择（单值和区间值）
      - 日（月维度）：支持选择本月最后一天、指定时间选择（单值和区间值）
      - 日（周维度）：支持选择第几周的周几、指定时间选择（单值和区间值）
    - 专业模式：直接输入 cron 表达式
      - 详情见附录一
  - 显示区块
    - 值显示：显示 cron 值和对应的中文
    - 例子显示：显示调度例子

#### 附录一

规则类型：linux（标准类型）、spring（Java 库）、quartz（Java 库）

| 字段 | 允许值 | 允许特殊字符 | 备注 |
| --- | --- | --- | --- |
| 秒 | 0–59 | \* , - / | linux 标准实现不支持此字段 |
| 分 | 0–59 | \* , - / |  |
| 小时 | 0–23 | \* , - / |  |
| 日 | 1–31 | \* , - / ? L W | ?LW 只有 Java 库实现了 |
| 月 | 1–12 or JAN–DEC | \* , - / |  |
| 周 | 0–6（linux）1-7（java） or SUN–SAT | \* , - / ? L # | ?L#只有 Java 库实现了 ，组件对外输出 SUN–SAT |
| 年 | 1970–2099（未测试） | \* , - / | 只有 quartz 支持此字段 |

### 参数

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | cron 组件内容 | string | --- | --- |
| defaultValue | cron 组件默认内容 | string | --- | --- |
| disabled | 是否禁用状态 | boolean | false | --- |
| title | 设置默认标题 | string\|reactNode | '频度设置’ | --- |
| shortcuts | 快捷方式（只支持 3 个快捷方式） | { value: string; text: string }[] | --- | --- |
| type | 设置默认规则类型 | 'linux'\|'spring'\|'quartz' | 'spring' | --- |
| mode | 设置默认模式 | 'default'\|'pro' | 'default' | --- |
| onChange | cron 组件内容变化时的回调 | function(value:string) | --- | --- |
