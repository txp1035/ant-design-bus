import * as React from 'react';
import { mount } from 'enzyme';
import Cron from '../index';
import { setMockDate, resetMockDate } from './utils';

describe('all actions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setMockDate('2020-07-15T05:20:00.795');
  });

  afterEach(() => {
    jest.useRealTimers();
    resetMockDate();
  });
  const className = 'tech';
  // head base baseDay
  it('head', () => {
    // 加载整个组件
    const wrapper = mount(<Cron value="1,3-5,3-6/2 * * 1,3-5,3-6/2 * ? *" />);
    const head = wrapper.find('.ant-card-head');
    // 获取下拉框
    const dropdownWrapper = mount(head.find('Trigger').instance().getComponent());
    // 切换专业模式
    dropdownWrapper.find('.ant-select-item').at(1).simulate('click');
    // link测试
    const shortcuts = head.find('a');
    // 切换每周五
    shortcuts.at(2).simulate('click');
    wrapper.unmount();
  });
  // ResultView and 1#2
  it('ResultView', () => {
    // 加载整个组件
    const wrapper = mount(<Cron value="* * * ? * 1#2 *" />);
    /* ResultView组件测试 */
    // 展开详情
    const openDec = wrapper.find(`.${className}-cron-expression-overview`).find('.anticon-down');
    openDec.simulate('click');
    // 加载更多
    const loadMore = wrapper.find(`.${className}-cron-expression-result-list`).find(`.${className}-cron-expression-ellipsis`).find('svg');
    loadMore.simulate('click');
    // 收回详情
    const closeDec = wrapper.find(`.${className}-cron-expression-result-list`).find('.anticon-up');
    closeDec.simulate('click');
    wrapper.unmount();
  });
  // pro模式和暂不支持调度解析
  it('pro', () => {
    const onChange = jest.fn();
    // 加载整个组件
    const wrapper = mount(<Cron mode="pro" value="* * * L * ? *" onChange={onChange} />);
    // 点击频率
    const frequencyText = wrapper.find(`.${className}-cron-expression-dec`);
    frequencyText.at(0).simulate('click');
    // 输入值
    const input = wrapper.find(`.${className}-cron-expression-pro-input`).find('input');
    input.at(1).simulate('change', { target: { value: '100' } });
    input.at(1).simulate('blur');
    input.at(1).simulate('focus');
    wrapper.update(); // 强制进行组件更新
    wrapper.unmount();
  });

  it('frequency base', () => {
    const onChange = jest.fn();
    // 加载整个组件
    const wrapper = mount(<Cron value="* * * * * ? *" onChange={onChange} />);
    // 新增频率
    const add = wrapper.find('.ant-card-body').find('button');
    add.simulate('click');
    // 频率切换
    const frequency = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(0);
    const dropdownWrapper = mount(frequency.instance().getComponent());
    dropdownWrapper.find('.ant-select-item').at(2).simulate('click');
    // 步长切换
    const step = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(1);
    const stepWrapper = mount(step.instance().getComponent());
    stepWrapper.find('.ant-select-item').at(1).simulate('click');
    // 选择指定
    const appointSelect = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(2);
    const appointSelectWrapper = mount(appointSelect.instance().getComponent());
    appointSelectWrapper.find('.ant-select-item').at(2).simulate('click');
    // 选择区间
    mount(appointSelectWrapper.find('Trigger').at(0).instance().getComponent()).find('.ant-select-item').at(0).simulate('click');
    mount(appointSelectWrapper.find('Trigger').at(1).instance().getComponent()).find('.ant-select-item').at(3).simulate('click');
    appointSelectWrapper.find('a').simulate('click');
    // 选中步长
    wrapper
      .find('.ant-checkbox-input')
      .at(0)
      .simulate('change', { target: { checked: true } });
    // 取消选中步长
    wrapper
      .find('.ant-checkbox-input')
      .at(0)
      .simulate('change', { target: { checked: false } });
    // 选中指定
    wrapper
      .find('.ant-checkbox-input')
      .at(1)
      .simulate('change', { target: { checked: true } });
    // 取消选中指定
    wrapper
      .find('.ant-checkbox-input')
      .at(1)
      .simulate('change', { target: { checked: false } });
    // 新增至第二个频率才能删除频率
    wrapper.find('.ant-card-body').find('button').simulate('click');
    const deletes = wrapper.find('.ant-card-body').find(`.${className}-cron-expression-delete`).find('span').at(1);
    deletes.simulate('click');
    wrapper.unmount();
  });
  it('frequency day', () => {
    const onChange = jest.fn();
    // 加载整个组件
    const wrapper = mount(<Cron value="* * * 1 * ? *" onChange={onChange} />);
    // 选择指定
    const appointSelect = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(1);
    const appointSelectWrapper = mount(appointSelect.instance().getComponent());
    appointSelectWrapper.find('.ant-select-item').at(2).simulate('click');
    // 选中最后一天
    wrapper.find(`.ant-radio-input`).at(0).simulate('change');
    // 选中指定
    wrapper.find(`.ant-radio-input`).at(1).simulate('change');
    wrapper.unmount();
  });
  it('frequency week', () => {
    const onChange = jest.fn();
    // 加载整个组件
    const wrapper = mount(<Cron value="* * * ? * 1 *" onChange={onChange} />);
    // 选择指定
    const appointSelect = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(3);
    const appointSelectWrapper = mount(appointSelect.instance().getComponent());
    appointSelectWrapper.find('.ant-select-item').at(2).simulate('click');
    // 选中第几周的周几
    wrapper.find(`.ant-radio-input`).at(0).simulate('change');
    // 选择第几周
    const weekSelect = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(1);
    const weekSelectWrapper = mount(weekSelect.instance().getComponent());
    weekSelectWrapper.find('.ant-select-item').at(2).simulate('click');
    // 选择星期几
    const rankingSelect = wrapper.find(`.${className}-cron-expression-frequency-row`).find('Trigger').at(2);
    const rankingSelectWrapper = mount(rankingSelect.instance().getComponent());
    rankingSelectWrapper.find('.ant-select-item').at(2).simulate('click');
    // 选中指定
    wrapper.find(`.ant-radio-input`).at(1).simulate('change');

    wrapper.unmount();
  });
});
