import React from 'react';
import { Table } from 'antd';

const dataSource = [
  {
    key: '1',
    maHang: '1',
    tenHang: 'Product A',
    dvt: 'Kg',
    soLuong: 10,
    soLuongDaBan: 4,
    donGia: '1.200 ₫',
    thanhTien: '12.000 ₫',
    phanTramChietKhau: 0,
    tienChietKhau: '0 ₫',
    phanTramThueGTGT: 8,
    tienThueGTGT: '960 ₫',
  },
  // Add more data rows here if needed
];

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
  {
    title: 'Số lượng đã bán',
    dataIndex: 'soLuongDaBan',
    key: 'soLuongDaBan',
  },
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
    title: '% thuế GTGT',
    dataIndex: 'phanTramThueGTGT',
    key: 'phanTramThueGTGT',
  },
  {
    title: 'Tiền thuế GTGT',
    dataIndex: 'tienThueGTGT',
    key: 'tienThueGTGT',
  },
];

const OrderTable = () => {
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
