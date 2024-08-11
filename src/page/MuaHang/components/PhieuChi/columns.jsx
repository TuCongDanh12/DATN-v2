import React from "react";
import { Space, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { VND } from "./../../../../utils/func";
const columns = (
  status,
  sortedInfo,
  filteredInfo,
  handleDropdownItemClick,
  items,
  navigate
) => [
  {
    title: "ID phiếu chi",
    dataIndex: "id",
    key: "id",
    render: (val, record) => (
      <span
        onClick={() => {
          navigate(`/ban-hang/thu-tien-theo-hoa-don/${record.type}/${val}`, {
            state: { id: val },
          });
        }}
        className={`cursor-pointer font-medium text-[#1DA1F2]`}
      >
        {val}
      </span>
    ),
    sorter: (a, b) => a.id - b.id,
    sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    ellipsis: true,
    width: "10%",
  },
  {
    title: "Loại",
    dataIndex: "type",
    key: "type",
    render: () => (status === "tienmat" ? "Tiền mặt" : "Tiền gửi"),
    onFilter: (value, record) => record.type.indexOf(value) === 0,
    filteredValue: filteredInfo.type || null,
    ellipsis: true,
  },
  {
    title: "Ngày hạch toán",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (val) => new Date(val).toLocaleDateString("vi-VN"),
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
  },
  {
    title: "Nhà cung cấp",
    dataIndex: "supplier",
    key: "supplier",
    render: (val) => val?.accountName || "Không có dữ liệu",
    ellipsis: true,
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
    ellipsis: true,
  },
  {
    title: "Tổng tiền",
    dataIndex: "chungTu",
    key: "tong",
    render: (chungTu) => {
      const total = chungTu.reduce((sum, item) => sum + item.money, 0);
      return VND.format(total);
    },
    sorter: (a, b) => {
      const totalA = a.chungTu.reduce((sum, item) => sum + item.money, 0);
      const totalB = b.chungTu.reduce((sum, item) => sum + item.money, 0);
      return totalA - totalB;
    },
    sortOrder: sortedInfo.columnKey === "tong" ? sortedInfo.order : null,
  },
  {
    title: "Chức năng",
    dataIndex: "chucnang",
    fixed: "right",
    width: "10%",
    render: (_, record) => (
      <Space size="middle">
        <Dropdown
          menu={{
            onClick: (e) => handleDropdownItemClick(e, record),
            items: items,
          }}
        >
          <Link
            to={
              status === "tienmat"
                ? `tienmat/${record.id}`
                : `tiengui/${record.id}`
            }
            state={{ id: record.id }}
            className="!text-black"
          >
            Xem
          </Link>
        </Dropdown>
      </Space>
    ),
  },
];

export default columns;
