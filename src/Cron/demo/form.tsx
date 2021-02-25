import React from 'react';
import { Form, Button } from 'antd';
import { Cron } from 'ant-design-bus';

export default () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  return (
    <div>
      <Form form={form} initialValues={{ cron: '* * 6-11 * * ? *' }} onFinish={onFinish}>
        <Form.Item name="cron" label="Cron表达式">
          <Cron />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

// export default Demo;
