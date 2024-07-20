import React from 'react';
import { Space, Dropdown, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";

const PAYMENT_STATUS = {
  NOT_PAID: 'NOT_PAID',
  BEING_PAID: 'BEING_PAID',
  PAID: 'PAID',
};

const DELIVERY_STATUS = {
  NOT_DELIVERED: 'NOT_DELIVERED',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
};

const DOCUMENT_STATUS = {
  UNDOCUMENTED: 'UNDOCUMENTED',
  DOCUMENTING: 'DOCUMENTING',
  DOCUMENTED: 'DOCUMENTED',
};

const paymentStatusColors = {
  NOT_PAID: 'red',
  BEING_PAID: 'yellow',
  PAID: 'green',
};

const deliveryStatusColors = {
  NOT_DELIVERED: 'red',
  DELIVERING: 'yellow',
  DELIVERED: 'green',
};

const documentStatusColors = {
  UNDOCUMENTED: 'red',
  DOCUMENTING: 'yellow',
  DOCUMENTED: 'green',
};

const paymentStatusLabels = {
  NOT_PAID: 'Chưa trả',
  BEING_PAID: 'Đang trả 1 phần',
  PAID: 'Đã trả',
};

const deliveryStatusLabels = {
  NOT_DELIVERED: 'Chưa giao',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Đã giao',
};

const documentStatusLabels = {
  UNDOCUMENTED: 'Chưa lập chứng từ',
  DOCUMENTING: 'Đang lập',
  DOCUMENTED: 'Đã lập',
};

const handleDropdownItemClick = (e, record, navigate, setDataSelected, setOpen) => {
  if (e.key === "xoa") {
    setDataSelected(record);
    setOpen(true);
  } else if (e.key === "lap-chung-tu") {
    navigate(`/mua-hang/chung-tu-mua-hang/them/${record.id}`, { state: { id: record.id } });
  } else {
    navigate(`${e.key}/${record.id}`, { state: { id: record.id } });
  }
};

const getColumns = (navigate, setDataSelected, setOpen) => [
  {
    title: "Id đơn hàng",
    dataIndex: "id",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Ngày mua",
    dataIndex: "ngayMua",
    sorter: (a, b) => new Date(a.ngayMua) - new Date(b.ngayMua),
  },
  {
    title: "Hạn giao hàng",
    dataIndex: "hanGiaoHang",
    sorter: (a, b) => new Date(a.hanGiaoHang) - new Date(b.hanGiaoHang),
  },
  {
    title: "Tên khách hàng",
    dataIndex: ["supplier", "name"], // Access nested property
    sorter: (a, b) => a.supplier.name.localeCompare(b.supplier.name),
  },
  {
    title: "Trạng thái vận chuyển",
    dataIndex: "deliveryStatus",
    render: (text) => (
      <Tag color={deliveryStatusColors[text]}>
        {deliveryStatusLabels[text]}
      </Tag>
    ),
    filters: Object.keys(DELIVERY_STATUS).map(key => ({ text: deliveryStatusLabels[DELIVERY_STATUS[key]], value: DELIVERY_STATUS[key] })),
    onFilter: (value, record) => record.deliveryStatus === value,
  },
  {
    title: "Trạng thái chứng từ",
    dataIndex: "documentStatus",
    render: (text) => (
      <Tag color={documentStatusColors[text]}>
        {documentStatusLabels[text]}
      </Tag>
    ),
    filters: Object.keys(DOCUMENT_STATUS).map(key => ({ text: documentStatusLabels[DOCUMENT_STATUS[key]], value: DOCUMENT_STATUS[key] })),
    onFilter: (value, record) => record.documentStatus === value,
  },
  {
    title: "Chức năng",
    dataIndex: "chucnang",
    width: "10%",
    render: (_, record) => {
      const menuItems = [
        { key: "xem", label: (<span className="!text-black">Xem</span>) }
      ];
      
      if (record.documentStatus === DOCUMENT_STATUS.UNDOCUMENTED) {
        menuItems.push(
          { key: "lap-chung-tu", label: (<span className="!text-black">Lập chứng từ</span>) }
        );
      }
      
      return (
        <Space size="middle">
          <Dropdown
            menu={{
              onClick: (e) => handleDropdownItemClick(e, record, navigate, setDataSelected, setOpen),
              items: menuItems,
            }}
          >
            <span className="!text-black cursor-pointer">
              Xem <DownOutlined />
            </span>
          </Dropdown>
        </Space>
      );
    },
  },
];

export default getColumns;
