import { Button } from "antd";

const getColumns = (navigate) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Tên Báo Cáo",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mô Tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Thời Gian",
    dataIndex: "startDate",
    key: "startDate",
    render: (text, record) => (
      <span>{`${record.startDate} - ${record.endDate}`}</span>
    ),
  },
  {
    title: "Hành Động",
    key: "action",
    render: (text, record) => (
      <Button
        type="link"
        className="!text-[#FFFFFF]"
        onClick={() => navigate(`/cong-no/tong-hop-cong-no/${record.id}`)}
      >
        Xem Chi Tiết
      </Button>
    ),
  },
];

export default getColumns;
