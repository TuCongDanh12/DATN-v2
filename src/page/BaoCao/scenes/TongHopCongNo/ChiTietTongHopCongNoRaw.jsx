import { useState, useRef, useEffect } from "react";
import { Table, Typography, Button, message } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import congNoService from "../../../../services/congNo.service";
import moment from "moment";

const ChiTietTongHopCongNoRaw = ({ reportData, values, hasButton = false, onClose, refreshTable }) => {
  const [tongHopCongNo, setTongHopCongNo] = useState(reportData);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    setTongHopCongNo(reportData);
  }, [reportData]);

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

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await congNoService.postReportTHCN(values);
      message.success("Xác nhận thành công!");
      onClose();
      refreshTable();
    } catch (error) {
      message.error("Xác nhận thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // const expandedRowRender = (record) => {
  //   const columns = [
  //     { title: "ID Đơn Bán", dataIndex: ["ctban", "id"], key: "id" },
  //     { title: "Nội dung", dataIndex: ["ctban", "content"], key: "content" },
  //     { title: "Giá trị đơn hàng", dataIndex: ["ctban", "finalValue"], key: "finalValue", render: (value) => value.toLocaleString() },
  //     { title: "Số tiền chưa thu", dataIndex: "notCollected", key: "notCollected", render: (value) => value.toLocaleString() },
  //     { title: "Trạng thái thanh toán", dataIndex: ["ctban", "paymentStatus"], key: "paymentStatus" },
  //     { title: "Hạn thanh toán", dataIndex: ["ctban", "paymentTerm"], key: "paymentTerm", render: (date) => moment(date).format('DD/MM/YYYY') },
  //   ];
  //   return <Table columns={columns} dataSource={record.ctbans} pagination={false} rowKey="ctban.id" />;
  // };

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
      title: "Tổng Công Nợ",
      dataIndex: "notCollectedTotal",
      key: "notCollectedTotal",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Nợ Trong Hạn",
      dataIndex: "inOfDate",
      key: "inOfDate",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Nợ Quá Hạn",
      dataIndex: "outOfDate",
      key: "outOfDate",
      render: (value) => value.toLocaleString(),
    },
  ];
  // Function to calculate totals
  const calculateTotals = () => {
    const totalInOfDate = tongHopCongNo?.reportThcnDetails?.reduce(
      (sum, record) => sum + record.inOfDate,
      0
    );
    const totalOutOfDate = tongHopCongNo?.reportThcnDetails?.reduce(
      (sum, record) => sum + record.outOfDate,
      0
    );
    return { totalInOfDate, totalOutOfDate };
  };

  // Get totals for Nợ Trong Hạn and Nợ Quá Hạn
  const { totalInOfDate, totalOutOfDate } = calculateTotals();
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
          rowKey={record => record.customer.id}
          // expandedRowRender={expandedRowRender}
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>
                <Typography.Text strong>Tổng cộng</Typography.Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Typography.Text strong>{(totalInOfDate+totalOutOfDate).toLocaleString()}</Typography.Text>
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

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button type="primary" onClick={handleConfirm} loading={loading}>
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default ChiTietTongHopCongNoRaw;
