import { defineConfig } from 'dumi';
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'ant-design-bus',
  },
  // alias: {
  //   '@alipay/tech-ui': resolve('src/index.ts'),
  // },
  // title: 'ant-design-bus',
  // // more config: https://d.umijs.org/config
  // base: '/ant-design-bus',
  // publicPath: '/ant-design-bus/',
  // favicon:
  //   'https://avatars3.githubusercontent.com/u/9554297?s=460&u=51c26b8f7a561ce08486dacbc745a3e3fc51e75d&v=4',
  // logo: 'https://avatars3.githubusercontent.com/u/9554297?s=460&u=51c26b8f7a561ce08486dacbc745a3e3fc51e75d&v=4',
});
