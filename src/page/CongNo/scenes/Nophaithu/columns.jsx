import React from "react";
import { Space, Dropdown, Tag, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const PAYMENT_STATUS = {
  NOT_PAID: "NOT_PAID",
  BEING_PAID: "BEING_PAID",
  PAID: "PAID",
};

const paymentStatusColors = {
  NOT_PAID: "red",
  BEING_PAID: "yellow",
  PAID: "green",
};

const paymentStatusLabels = {
  NOT_PAID: "Chưa trả",
  BEING_PAID: "Đang trả 1 phần",
  PAID: "Đã trả",
};

const handleMenuClick = (e, record, navigate) => {
  if (e.key === "xem") {
    navigate(`/mua-hang/chung-tu-mua-hang/xem/${record.id}`, {
      state: { id: record.id },
    });
  } else if (e.key === "tra-tien") {
    navigate(
      `/mua-hang/chung-tu-mua-hang/tra-tien/${record.donMuaHang.supplier.id}`,
      { state: { id: record.donMuaHang.supplier.id } }
    );
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const calculateDebt = (record) => {
  const totalValue = record.finalValue;
  const paidValue = record.paidValue;
  const debt = totalValue - paidValue;
  return debt > 0 ? debt : 0;
};

const getColumns = (navigate) => [
  {
    title: "ID chứng từ",
    dataIndex: "id",
    sorter: (a, b) => a.id - b.id,
  },
  // {
  //   title: "Ngày hoạch toán",
  //   dataIndex: "createdAt",
  //   // sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  //   render: (text) => new Date(text).toLocaleDateString("vi-VN"),
  // },
  {
    title: "Hạn thanh toán",
    dataIndex: "paymentTerm",
    sorter: (a, b) => new Date(a.paymentTerm) - new Date(b.paymentTerm),
    render: (text) => new Date(text).toLocaleDateString("vi-VN"),
  },
  {
    title: "Khách hàng",
    render: (_, record) => record?.donBanHang?.customer?.name,
  },
  {
    title: "Tổng",
    dataIndex: "finalValue",
    render: (text) => formatCurrency(text),
    sorter: (a, b) => a.finalValue - b.finalValue,
  },
  {
    title: "Đã thu",
    dataIndex: "paidValue",
    render: (text) => formatCurrency(text),
    sorter: (a, b) => a.paidValue - b.paidValue,
  },
  {
    title: "Nợ trong hạn",
    dataIndex: "debtInDue",
    render: (_, record) => {
      const currentDate = new Date();
      const paymentTerm = new Date(record.paymentTerm);
      const debt = calculateDebt(record);
      return paymentTerm >= currentDate ? formatCurrency(debt) : formatCurrency(0);
    },
  },
  {
    title: "Nợ quá hạn",
    dataIndex: "overdueDebt",
    render: (_, record) => {
      const currentDate = new Date();
      const paymentTerm = new Date(record.paymentTerm);
      const debt = calculateDebt(record);
      return paymentTerm < currentDate ? formatCurrency(debt) : formatCurrency(0);
    },
  },

  {
    title: "Chức năng",
    dataIndex: "chucnang",
    width: "15%",
    render: (_, record) => {
      const menu = (
        <Menu onClick={(e) => handleMenuClick(e, record, navigate)}>
          <Menu.Item key="xem">Xem</Menu.Item>
          {record.paymentStatus !== PAYMENT_STATUS.PAID && (
            <Menu.Item key="tra-tien">Trả tiền</Menu.Item>
          )}
        </Menu>
      );

      return (
        <Space size={0} className="!text-black">
          <Button
            type="link"
            className="!text-black"
            onClick={() =>
              navigate(`/ban-hang/chung-tu-ban-hang/xem/${record.id}`, {
                state: { id: record.id },
              })
            }
          >
            Xem
          </Button>
          {/* <Dropdown overlay={menu} trigger={["hover"]}>
            <Button
              className="!text-black"
              type="link"
              icon={<DownOutlined />}
            >
              Thao tác <DownOutlined />
            </Button>
          </Dropdown> */}
        </Space>
      );
    },
  },
];

export default getColumns;
