import { Link } from "react-router-dom";
import { Divider, Table,Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
// import TableChungtu from './table-chungtu';

const columns = [
  {
    title: "Ngày trả tiền",
    dataIndex: "ngaytratien",
  },
  {
    title: "Số chứng từ",
    dataIndex: "sochungtu",
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
    title: "Chức năng",
    dataIndex: "chucnang",
    render: () => (
      <Space size="middle">
        
          <Link href="#" className="!text-black">
            Trả tiền <DownOutlined />
          </Link>

      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    ngaytratien: "23/10/2023",
    sochungtu: 'NK00007',
    sohoadon: 455,
    nhacungcap: "Nguyễn Thị Hà",
    tongtienthanhtoan: 220,
    ttthanhtoan: 'Chưa thanh toán',
    chucnang: "Trả tiền",
  },
  {
    key: "2",
    ngaytratien: "23/10/2023",
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
function TablePhieuChi() {
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

export default TablePhieuChi;
