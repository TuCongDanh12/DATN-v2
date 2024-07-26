import React from 'react';
import { Table } from 'antd';

const calculateTotal = (count, price, discountRate, discount) => {
  const totalProductValue = count * price;
  const discountedValue = totalProductValue * (1 - discountRate / 100);
  const finalValue = discountedValue;
  return finalValue < 0 ? 0 : finalValue;
};

const OrderTable = ({ data, discountRate, discount }) => {
  const dataSource = data.map((item, index) => ({
    key: index + 1,
    maHang: item.id,
    tenHang: item.product.name,
    dvt: item.product.unit,
    soLuong: item.count,
    soLuongDaBan: item.delivered,
    donGia: `${item.price.toLocaleString('vi-VN')} ₫`,
    thanhTien: `${(item.price * item.count).toLocaleString('vi-VN')} ₫`,
    phanTramChietKhau: discountRate,
    tienChietKhau: `${(item.count * item.price * discountRate / 100).toLocaleString('vi-VN')} ₫`,
    total: calculateTotal(item.count, item.price, discountRate, discount),
  }));

  const columns = [
    {
      title: 'Mã hàng',
      dataIndex: 'maHang',
      key: 'maHang',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'tenHang',
      key: 'tenHang',
    },
    {
      title: 'ĐVT',
      dataIndex: 'dvt',
      key: 'dvt',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    // {
    //   title: 'Số lượng đã nhận',
    //   dataIndex: 'soLuongDaBan',
    //   key: 'soLuongDaBan',
    // },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
    },
    {
      title: '% chiết khấu',
      dataIndex: 'phanTramChietKhau',
      key: 'phanTramChietKhau',
    },
    {
      title: 'Tiền chiết khấu',
      dataIndex: 'tienChietKhau',
      key: 'tienChietKhau',
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
    />
  );
};

export default OrderTable;
