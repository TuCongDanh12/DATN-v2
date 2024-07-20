import { Link } from "react-router-dom";
import { Divider, Table, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
const items = [
  { key: "1", label: "Lập chứng từ" },
  { key: "2", label: "Xem" },
];
const columns = [
  {
    title: "Ngày đơn hàng",
    dataIndex: "ngaydonhang",
  },
  {
    title: "Số đơn hàng",
    dataIndex: "sodonhang",
  },
  {
    title: "Gía trị đơn hàng",
    dataIndex: "giatridonhang",
  },
  {
    title: "Tình trạng",
    dataIndex: "tinhtrang",
  },
  {
    title: "Giá trị đã thực hiện",
    dataIndex: "giatridathuchien",
  },
  {
    title: "Chức năng",
    dataIndex: "chucnang",
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }}>
          <Link to='/mua-hang/chung-tu-mua-hang/id' className="!text-black">
            Lập chứng từ <DownOutlined />
          </Link>
        </Dropdown>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    ngaydonhang: "23/10/2023",
    sodonhang: 32,
    giatridonhang: 100,
    tinhtrang: "Chưa thực hiện",
    giatridathuchien: 0,
    chucnang: "Lập chứng từ",
  },
  {
    key: "2",
    ngaydonhang: "23/10/2023",
    sodonhang: 32,
    giatridonhang: 100,
    tinhtrang: "Chưa thực hiện",
    giatridathuchien: 0,
    chucnang: "Lập chứng từ",
  },
  {
    key: "3",
    ngaydonhang: "23/10/2023",
    sodonhang: 32,
    giatridonhang: 100,
    tinhtrang: "Chưa thực hiện",
    giatridathuchien: 0,
    chucnang: "Lập chứng từ",
  },
  {
    key: "4",
    ngaydonhang: "23/10/2023",
    sodonhang: 32,
    giatridonhang: 100,
    tinhtrang: "Chưa thực hiện",
    giatridathuchien: 0,
    chucnang: "Lập chứng từ",
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    //console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
};

function TableMuahang() {
  return (
    <div>
      <Divider />

      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}

export default TableMuahang;
