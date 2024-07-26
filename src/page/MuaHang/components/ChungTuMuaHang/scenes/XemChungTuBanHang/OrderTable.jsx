import React from 'react';
import { Table } from 'antd';

const OrderTable = ({ dataSource, discountRate, editable }) => {
    console.log('Data source', dataSource?.productOfCtmua)
  const columns = [
    {
        title: 'Mã hàng',
        dataIndex: ['product', 'id'],
        key: 'product.id',
        render: (_, record) => record.product.id,
      },
      {
        title: 'Tên hàng',
        dataIndex: ['product', 'name'],
        key: 'product.name',
        render: (_, record) => record.product.name,
      },
      {
        title: 'ĐVT',
        dataIndex: ['product', 'unit'],
        key: 'product.unit',
        render: (_, record) => record.product.unit,
      },
      {
        title: 'Số lượng',
        dataIndex: 'count',
        key: 'count',
        render: (_, record) => record.count,
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => `${record.price.toLocaleString('vi-VN')} ₫`,
      },
      {
        title: 'Thành tiền',
        key: 'totalPrice',
        render: (_, record) => `${(record.count * record.price).toLocaleString('vi-VN')} ₫`,
      },

    // {
    //   title: '% chiết khấu',
    //   dataIndex: 'discountRate',
    //   key: 'discountRate',
    //   render: () => discountRate,
    // },
    // {
    //   title: 'Tiền chiết khấu',
    //   dataIndex: 'tienChietKhau',
    //   key: 'tienChietKhau',
    //   render: (_, record) => calculateAmount(record).tienChietKhau.toLocaleString('vi-VN'),
    // },
    // {
    //   title: 'Tổng cộng',
    //   dataIndex: 'total',
    //   key: 'total',
    //   render: (_, record) => calculateAmount(record).total.toLocaleString('vi-VN'),
    // },
  ];

  return (
    <Table
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource?.productOfCtmua.map(item => ({ ...item, key: item.id }))}
      columns={columns}
      pagination={false}
    />
  );
};

export default OrderTable;
