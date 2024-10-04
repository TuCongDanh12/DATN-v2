import { Button } from "antd";

const getColumns = (navigate) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
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
      <span>
        {record.startDate} - {record.endDate}
      </span>
    ),
  },
  {
    title: "Hành Động",
    key: "action",
    render: (_, record) => (
      <Button  className='!text-[#ffff]'onClick={() => navigate(`/cong-no/doi-chieu-cong-no/${record.id}`)} type="link">
        Chi Tiết
      </Button>
    ),
  },
];

export default getColumns;
