---
title: CronExpression 定时任务
debug: true
nav:
  title: 组件
  path: /components
---

Linux 系统支持的时间表达式，通过这个生成器，您可以生成任务调度的 Cron 表达式，如 3,16 \* \* \* \* ?。

## 何时使用

为用户提供设定周期性任务调度时间的能力，通常被用在系统的自动化维护或者管理。

### 功能区简述

- 卡片头
  - 标题：用于卡片头部左测显示
  - 快捷方式：用于快速设置常用 cron 表达式。只支持 3 个快捷方式。点击快捷方式卡片内容会有相应联动。
  - 模式选择框：用于进行默认模式（UI 模式）和专业模式切换。切换模式重置值。
- 卡片类容
  - 设置值区块
    - 默认模式：有 UI 供用户操作,不设定
      - 秒、分、小时、月：支持步长选择（默认最大范围，如：每 2 秒就是 0 到 59 秒每 2 秒执行）、指定时间选择（单值和区间值）
      - 日（月维度）：支持选择本月最后一天、指定时间选择（单值和区间值）
      - 日（周维度）：支持选择第几周的周几、指定时间选择（单值和区间值）
      - cron 表达式默认模式默认值为 linux:0-59/1 \* \* \* _ spring:0-59/1 _ \* \* _ ? quartz:0-59/1 _ \* \* \* ?
      - 每次添加设置会添加未添加设置的最顶部的频率，且添加的频率初始值为最大范围值/1
      - 最大范围/1 和 * 是在解析值是等同的，区别在于*不会显示在 UI 上，最大范围/1 会显示。
    - 专业模式：直接输入 cron 表达式
      - 点击输入框下方频率会让对应频率的字符串高亮且获得焦点
      - 输入错误的字符串会标红且进行提示改频率输入框运行的范围
      - 详情见附录一
  - 显示区块
    - 值显示：显示 cron 值和对应的中文
    - 例子显示：显示调度例子

#### 附录一

规则类型：linux（标准类型）、spring（Java 库）、quartz（Java 库）

| 字段 | 允许值                             | 允许特殊字符   | 备注                                         |
| ---- | ---------------------------------- | -------------- | -------------------------------------------- |
| 秒   | 0–59                               | \* , - /       | linux 标准实现不支持此字段                   |
| 分   | 0–59                               | \* , - /       |                                              |
| 小时 | 0–23                               | \* , - /       |                                              |
| 日   | 1–31                               | \* , - / ? L W | ?LW 只有 Java 库实现了                       |
| 月   | 1–12 or JAN–DEC                    | \* , - /       |                                              |
| 周   | 0–6（linux）1-7（java） or SUN–SAT | \* , - / ? L # | ?L#只有 Java 库实现了 ，组件对外输出 SUN–SAT |
| 年   | 1970–2099                          | \* , - /       | 只有 quartz 支持此字段                       |

## 代码演示

### 基本例子

<code src="./demos/uncontrolled.tsx" />

### 受控使用

<code src="./demos/controlled.tsx" />

### 表单中使用(Quartz 模式【七段式】)

<code src="./demos/form.tsx" />

### 表单中使用(Spring 模式【六段式】)

<code src="./demos/spring.tsx" />

### 表单中使用(Linux 模式【五段式】)

<code src="./demos/linux.tsx" />

## API 参数

| 参数         | 说明                            | 类型                              | 默认值     |
| ------------ | ------------------------------- | --------------------------------- | ---------- |
| value        | cron 组件内容                   | string                            | ---        |
| defaultValue | cron 组件默认内容               | string                            | ---        |
| title        | 设置默认标题                    | string\|reactNode                 | '频度设置’ |
| shortcuts    | 快捷方式（只支持 3 个快捷方式） | { value: string; text: string }[] | ---        |
| type         | 设置默认规则类型                | 'linux'\|'spring'\|'quartz'       | 'quartz'   |
| mode         | 设置默认模式                    | 'default'\|'pro'                  | 'default'  |
| onChange     | cron 组件内容变化时的回调       | function(value:string)            | ---        |

## Contributors(2)

Ordered by date of first contribution

<!-- 此栏目在构建时会自动更新，请勿手动修改，详见 package.json 中的 contributor script -->

<ul>
  <li>
    <a target="_blank" href="https://work.alibaba-inc.com/work/u/196634">
      <img
        style="vertical-align: middle"
        width="20"
        src="https://work.alibaba-inc.com/photo/196634.40x40.xz.jpg"
      >
      @珩灵&nbsp;
    </a>
    <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=vgv2797">
      <img
        style="vertical-align: middle"
        width="20"
        src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"
      >
      &nbsp;珩(héng)灵
    </a>
  </li>
  <li>
    <a target="_blank" href="https://work.alibaba-inc.com/work/u/WB639142">
      <img
        style="vertical-align: middle"
        width="20"
        src="https://work.alibaba-inc.com/photo/WB639142.40x40.xz.jpg"
      >
      @唐小平&nbsp;
    </a>
    <a target="_blank" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=shawdanon">
      <img
        style="vertical-align: middle"
        width="20"
        src="https://img.alicdn.com/tfs/TB18HtyiyqAXuNjy1XdXXaYcVXa-24-24.svg"
      >
      &nbsp;唐小平
    </a>
  </li>
</ul>

---
