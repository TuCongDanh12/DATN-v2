import { Link } from "react-router-dom";
import { Divider, Table, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
// import TableChungtu from './table-chungtu';
const items = [
  { key: "1", label: "Trả tiền" },
  { key: "2", label: "Xem" },
];
const columns = [
  {
    title: "Ngày hoạch toán",
    dataIndex: "ngayhoachtoan",
  },
  {
    title: "Số chứng từ",
    dataIndex: "sochungtu",
  },
  {
    title: "Số hóa đơn",
    dataIndex: "sohoadon",
  },
  {
    title: "Nhà cung cấp",
    dataIndex: "nhacungcap",
  },
  {
    title: "Tông tiền thanh toán",
    dataIndex: "tongtienthanhtoan",
  },
  {
    title: "TT thanh toán",
    dataIndex: "ttthanhtoan",
  },
  {
    title: "Chức năng",
    dataIndex: "chucnang",
    render: () => (
      <Space size="middle">
        <Dropdown menu={{ items }}>
          <Link to='id' className="!text-black">
            Trả tiền <DownOutlined />
          </Link>
        </Dropdown>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    ngayhoachtoan: "23/10/2023",
    sochungtu: 'NK00007',
    sohoadon: 455,
    nhacungcap: "Nguyễn Thị Hà",
    tongtienthanhtoan: 220,
    ttthanhtoan: 'Chưa thanh toán',
    chucnang: "Trả tiền",
  },
  {
    key: "2",
    ngayhoachtoan: "23/10/2023",
    sochungtu: 'NK00007',
    sohoadon: 455,
    nhacungcap: "Nguyễn Thị Hà",
    tongtienthanhtoan: 220,
    ttthanhtoan: 'Chưa thanh toán',
    chucnang: "Trả tiền",
  },
  {
    key: "3",
    ngayhoachtoan: "23/10/2023",
    sochungtu: 'NK00007',
    sohoadon: 455,
    nhacungcap: "Nguyễn Thị Hà",
    tongtienthanhtoan: 220,
    ttthanhtoan: 'Chưa thanh toán',
    chucnang: "Trả tiền",
  },
  {
    key: "4",
    ngayhoachtoan: "23/10/2023",
    sochungtu: 'NK00007',
    sohoadon: 455,
    nhacungcap: "Nguyễn Thị Hà",
    tongtienthanhtoan: 220,
    ttthanhtoan: 'Chưa thanh toán',
    chucnang: "Trả tiền",
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
};
function ListChungtu() {
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

export default ListChungtu;
