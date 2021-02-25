import * as React from 'react';
import { mount } from 'enzyme';

import Cron from '../index';
import { setMockDate, resetMockDate } from './utils';

describe('default', () => {
  beforeEach(() => {
    setMockDate('2020-07-15T05:20:00.795');
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetMockDate();
    jest.useRealTimers();
  });

  it('day', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cron value="* * * 1,3-5,3-6/2 * ? *" onChange={onChange} />);
    /* ResultView组件测试 */
    // 展开详情
    const openDec = wrapper.find('.tech-cron-expression-first-row').find('.anticon-down');
    openDec.simulate('click');
    // 加载更多
    const loadMore = wrapper
      .find('.tech-cron-expression-result-list')
      .find('.tech-cron-expression-ellipsis')
      .find('svg');
    console.log('click', loadMore.props());
    loadMore.simulate('click');
    // 收回详情
    const closeDec = wrapper.find('.tech-cron-expression-result-list').find('.anticon-up');
    closeDec.simulate('click');
    /* 频率组件测试 */
    const body = wrapper.find('.ant-card-body');
    // console.log('body',body.length)
    // 删除第一个
    const item = body.find('.ant-row');
    console.log('item.length', item.length);
    // day测试
    // 获取指定下拉框
    const appointSelect = mount(
      body
        .find('Trigger')
        .at(1)
        .instance()
        .getComponent(),
    );
    // 选择上线的值
    const rageSelectLeft = mount(
      appointSelect
        .find('Trigger')
        .at(0)
        .instance()
        .getComponent(),
    );
    rageSelectLeft
      .find('.ant-select-item')
      .at(0)
      .simulate('click');
    // 选择下线的值
    const rageSelectRight = mount(
      appointSelect
        .find('Trigger')
        .at(1)
        .instance()
        .getComponent(),
    );

    rageSelectRight
      .find('.ant-select-item')
      .at(5)
      .simulate('click');
    // 点击添加
    appointSelect.find('a').simulate('click');
    // 选择2日
    appointSelect
      .find('.ant-select-item')
      .at(1)
      .simulate('click');
    // 选择最后一天
    // TODO: 点击单选失效
    const lastDay = item
      .at(0)
      .find('.ant-radio')
      .at(0);
    lastDay.simulate('click');

    // 选择周

    // 添加频率
    const add = body.find('button');
    add.simulate('click');

    /* 头部组件测试 */
    const head = wrapper.find('.ant-card-head');
    // 获取下拉框
    const dropdownWrapper = mount(
      head
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    // 切换专业模式
    dropdownWrapper
      .find('.ant-select-item')
      .at(1)
      .simulate('click');
    // link测试
    const shortcuts = head.find('a');
    // 切换每周五
    shortcuts.at(2).simulate('click');
    /* 专业模式组件测试 */
    // 点击频率
    const frequencyText = wrapper.find('.tech-cron-expression-dec');
    frequencyText.at(0).simulate('click');
    // 输入值
    const input = wrapper.find('.tech-cron-expression-editable-content');
    // TODO: 测试输入框无效、输入一个错误的值
    input.at(0).simulate('change', { target: { value: '100' } });
    // // 切换默认模式
    // mount(
    //   head
    //     .find('Trigger')
    //     .instance()
    //     .getComponent(),
    // ).find('.ant-select-item')
    //   .at(0)
    //   .simulate('click');

    wrapper.unmount();
  });
});

describe('static', () => {
  beforeEach(() => {
    setMockDate('2020-07-15T05:20:00.795');
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetMockDate();
    jest.useRealTimers();
  });

  it('week', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cron value="1,3-5,3-6/2 * * ? * 1,3-5,3-6/2 *" onChange={onChange} />);
    const body = wrapper.find('.ant-card-body');
    const item = body.find('.ant-row');
    mount(
      item
        .at(0)
        .find('Trigger')
        .at(1)
        .instance()
        .getComponent(),
    )
      .find('.ant-select-item')
      .at(4)
      .simulate('click');
    mount(
      item
        .at(0)
        .find('Trigger')
        .at(2)
        .instance()
        .getComponent(),
    )
      .find('.ant-select-item')
      .at(4)
      .simulate('click');
    mount(
      item
        .at(1)
        .find('Trigger')
        .at(3)
        .instance()
        .getComponent(),
    )
      .find('.ant-select-item')
      .at(4)
      .simulate('click');
    item
      .at(0)
      .find('.ant-checkbox')
      .at(0)
      .simulate('click');
    item
      .at(0)
      .find('.ant-checkbox')
      .at(1)
      .simulate('click');
    // 快照一致
    expect(wrapper).toMatchRenderedSnapshot();
    wrapper.unmount();
  });
  it('day L', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cron value="* * * L * ? *" onChange={onChange} />);
    // 快照一致
    expect(wrapper).toMatchRenderedSnapshot();
    wrapper.unmount();
  });
  it('week 1#2', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Cron value="* * * ? * 1#2 *" onChange={onChange} />);
    /* 频率组件测试 */
    const body = wrapper.find('.ant-card-body');
    mount(
      body
        .find('Trigger')
        .at(1)
        .instance()
        .getComponent(),
    )
      .find('.ant-select-item')
      .at(4)
      .simulate('click');
    mount(
      body
        .find('Trigger')
        .at(2)
        .instance()
        .getComponent(),
    )
      .find('.ant-select-item')
      .at(4)
      .simulate('click');
    // 快照一致
    expect(wrapper).toMatchRenderedSnapshot();
    wrapper.unmount();
  });
});
