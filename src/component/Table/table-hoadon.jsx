
import { Divider, Table } from "antd";

const columns = [
  {
    title: "Mã hàng",
    dataIndex: "mahang",
  },
  {
    title: "Tên hàng",
    dataIndex: "tenhang",
  },
  {
    title: "Tk công nợ",
    dataIndex: "tkcongno",
  },
  {
    title: "Tk doanh thu",
    dataIndex: "tkdoanhthu",
  },
  {
    title: "ĐVT",
    dataIndex: "dvt",
  },
  {
    title: "Số lượng",
    dataIndex: "soluong",
  },
  {
    title: "Đơn giá",
    dataIndex: "dongia",
  },
  {
    title: "Thành tiền",
    dataIndex: "dvt",
  },
  {
    title: "% thuế GTGT",
    dataIndex: "phantramthuegtgt",
  },
  {
    title: "Tiền thuế GTGT",
    dataIndex: "tienthuegtgt",
  },
 
];
const data = [
  {
    key: "1",
    mahang: "VT00001",
    tenhang: 'Bàn phím',
    tkcongno:131,
    tkdoanhthu:6111,
    dvt:'Cái',
    dongia:2200000,
    thanhtien:220000000,
    phantramthuegtgt:10,
    tienthuegtgt:22000000,
    
  },
  {
    key: "2",
    mahang: "VT00001",
    tenhang: 'Bàn phím',
    tkcongno:131,
    tkdoanhthu:6111,
    dvt:'Cái',
    dongia:2200000,
    thanhtien:220000000,
    phantramthuegtgt:10,
    tienthuegtgt:22000000,
    
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

function Tablehoadon() {
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

export default Tablehoadon
