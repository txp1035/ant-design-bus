import React from 'react';
import { Form, Button } from 'antd';
import { CronExpression } from '@alipay/tech-ui';

const Demo = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="cron" label="Cron表达式">
          <CronExpression />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Demo;
