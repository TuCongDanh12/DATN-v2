import React from 'react';
import { Space, Dropdown, Tag, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const PAYMENT_STATUS = {
  NOT_PAID: 'NOT_PAID',
  BEING_PAID: 'BEING_PAID',
  PAID: 'PAID',
};

const paymentStatusColors = {
  NOT_PAID: 'red',
  BEING_PAID: 'yellow',
  PAID: 'green',
};

const paymentStatusLabels = {
  NOT_PAID: 'Chưa trả',
  BEING_PAID: 'Đang trả 1 phần',
  PAID: 'Đã trả',
};

const handleMenuClick = (e, record, navigate) => {
  if (e.key === "xem") {
    navigate(`/mua-hang/chung-tu-mua-hang/xem/${record.id}`, { state: { id: record.id } });
  } else if (e.key === "thu-tien") {
    navigate(`/mua-hang/chung-tu-mua-hang/thu-tien/${record.id}`, { state: { id: record.id } });
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getColumns = (navigate) => [
  {
    title: "ID chứng từ",
    dataIndex: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Ngày hoạch toán",
    dataIndex: "createdAt",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    render: (text) => new Date(text).toLocaleDateString('vi-VN'),
  },
  {
    title: "Nhà cung cấp",
    render: (_, record) => record?.donMuaHang?.supplier?.accountName
  },
  {
    title: "Tổng",
    dataIndex: "finalValue",
    render: (text) => formatCurrency(text),
    sorter: (a, b) => a.finalValue - b.finalValue,
  },
  {
    title: "Đã trả",
    dataIndex: "paidValue",
    render: (text) => formatCurrency(text),
    sorter: (a, b) => a.paidValue - b.paidValue,
  },
  {
    title: "Tình trạng hóa đơn",
    dataIndex: "paymentStatus",
    render: (text) => (
      <Tag color={paymentStatusColors[text]}>
        {paymentStatusLabels[text]}
      </Tag>
    ),
    filters: Object.keys(PAYMENT_STATUS).map(key => ({ text: paymentStatusLabels[PAYMENT_STATUS[key]], value: PAYMENT_STATUS[key] })),
    onFilter: (value, record) => record.paymentStatus === value,
  },
  {
    title: "Chức năng",
    dataIndex: "chucnang",
    width: "15%",
    render: (_, record) => {
      const menu = (
        <Menu onClick={(e) => handleMenuClick(e, record, navigate)}>
          <Menu.Item key="xem">
            Xem
          </Menu.Item>
          {record.paymentStatus !== PAYMENT_STATUS.PAID && (
            <Menu.Item key="thu-tien">
              Thu tiền
            </Menu.Item>
          )}
        </Menu>
      );

      return (
        <Space size={0} className='!text-black'>
          <Button
            type="link"
            className='!text-black'
            onClick={() => navigate(`/mua-hang/chung-tu-mua-hang/xem/${record.id}`, { state: { id: record.id } })}
          >
            Xem
          </Button>
          <Dropdown overlay={menu} trigger={['hover']}>
            <Button className='!text-black' type="link" icon={<DownOutlined />} />
          </Dropdown>
        </Space>
      );
    },
  },
];

export default getColumns;
