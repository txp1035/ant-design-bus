import React from 'react';
import { Table } from 'antd';

export interface ProTable {
  className: string;
}

export default ({ className }: ProTable) => {
  const columns = [
    {
      title: '1',
      dataIndex: '1',
    },
    {
      title: '2',
      dataIndex: '2',
    },
  ];
  return (
    <Table
      className={className}
      dataSource={[
        { 1: 1, 2: 2 },
        { 1: 1, 2: 2 },
      ]}
      columns={columns}
    />
  );
};
