import { Button } from "antd";
import moment from "moment"; // Import moment để định dạng ngày

const getColumns = (navigate) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    key: "time",
    render: (text, record) => 
      `${moment(record.startDate).format('DD/MM/YYYY')} - ${moment(record.endDate).format('DD/MM/YYYY')}`, // Định dạng thời gian dd/mm/yyyy
  },
  {
    title: "Hành động",
    key: "action",
    render: (text, record) => (
      <Button
        type="primary"
        onClick={() => navigate(`/bao-cao/bao-cao-chi-phi/${record.id}`)} // Điều hướng tới link khi nhấn
      >
        Xem chi tiết
      </Button>
    ),
  },
];

export default getColumns;
