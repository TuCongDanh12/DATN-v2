import { useState, useRef, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import congNoService from "../../../../../services/congNo.service";
import moment from "moment";

const ChiTietTongHopCongNo = ({ hasButton = true }) => {
  const [tongHopCongNo, setTongHopCongNo] = useState(null);
  const reportRef = useRef();
  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    getDetailNoPhaiTra();
  }, []);

  // Fetch report data
  const getDetailNoPhaiTra = async () => {
    try {
      const res = await congNoService.getReportTHCN(id);
      console.log("Chi tiết Nợ phải trả", res.data.result.data);
      setTongHopCongNo(res.data.result.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate totals for "Nợ Trong Hạn", "Nợ Quá Hạn", and "Đã Thanh Toán"
  const calculateTotals = () => {
    const totalInOfDate = tongHopCongNo?.reportThcnDetails?.reduce(
      (sum, record) => sum + record.inOfDate,
      0
    ) || 0;
    const totalOutOfDate = tongHopCongNo?.reportThcnDetails?.reduce(
      (sum, record) => sum + record.outOfDate,
      0
    ) || 0;
    const collectedTotal = tongHopCongNo?.reportThcnDetails?.reduce(
      (sum, record) => sum + record.collectedTotal,
      0
    ) || 0;
    return { totalInOfDate, totalOutOfDate, collectedTotal };
  };

  // Extract totals
  const { totalInOfDate, totalOutOfDate, collectedTotal } = calculateTotals();

  // Export table to PDF
  const handleExportPdf = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("bao-cao-tong-hop-cong-no.pdf");
    });
  };

  // Table columns definition
  const columns = [
    {
      title: "ID khách hàng",
      dataIndex: ["customer", "id"],
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["customer", "name"],
      key: "name",
    },
    {
      title: "Đã thanh toán",
      dataIndex: "collectedTotal",
      key: "collectedTotal",
      render: (value) => (value ? value.toLocaleString() : "0"),
    },
    {
      title: "Nợ Trong Hạn",
      dataIndex: "inOfDate",
      key: "inOfDate",
      render: (value) => (value ? value.toLocaleString() : "0"),
    },
    {
      title: "Nợ Quá Hạn",
      dataIndex: "outOfDate",
      key: "outOfDate",
      render: (value) => (value ? value.toLocaleString() : "0"),
    },
  ];

  return (
    <div>
      <div ref={reportRef}>
        <h2 className="text-xl font-bold mt-5" style={{ textAlign: "center" }}>
          {tongHopCongNo?.name}
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography.Text strong>
            Thời gian: {moment(tongHopCongNo?.startDate).format("DD/MM/YYYY")} -{" "}
            {moment(tongHopCongNo?.endDate).format("DD/MM/YYYY")}
          </Typography.Text>
          <br />
          <Typography.Text>{tongHopCongNo?.description}</Typography.Text>
        </div>
        <Table
          dataSource={tongHopCongNo?.reportThcnDetails || []}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>
                <Typography.Text strong>Tổng cộng</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>{collectedTotal.toLocaleString()}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>{totalInOfDate.toLocaleString()}</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>{totalOutOfDate.toLocaleString()}</Typography.Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>

      {hasButton && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button type="primary" onClick={handleExportPdf}>
            Xuất file PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChiTietTongHopCongNo;
