import React from 'react'
import Header from '../../component/Header/Header';
import { Outlet } from 'react-router-dom';
import { Tabs } from 'antd';

const items = [
  {
    key: '1',
    label: 'Tab 1',
    children: 'Content of Tab Pane 1',
  },
  {
    key: '2',
    label: 'Tab 2',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: 'Tab 3',
    children: 'Content of Tab Pane 3',
  },
];

const onChange = (key) => {
  console.log(key);
};

const DoiTuong = () => {
  const titlez = "Đối tượng";
  const process = [
    {
      url: 'nhom-nha-cung-cap',
      content: "Nhóm nhà cung cấp"
    },
    {
      url: 'nha-cung-cap',
      content: "Nhà cung cấp"
    },
    {
      url: 'nhom-khach-hang',
      content: "Nhóm khách hàng"
    },
    {
      url: 'khach-hang',
      content: "Khách hàng"
    },
    {
      url: 'nhom-san-pham',
      content: "Nhóm sản phẩm"
    },
    {
      url: 'san-pham',
      content: "Sản phẩm"
    },
    {
      url: 'tai-khoan-ngan-hang',
      content: "Tài khoản ngân hàng"
    },
    // {
    //   url: 'tai-chinh',
    //   content: "Tài chính"
    // },
  ]
  return (
    <div>
      <Header title="Bán hàng" titlez={titlez} process={process} />
      <Outlet />
    </div>)
}

export default DoiTuong