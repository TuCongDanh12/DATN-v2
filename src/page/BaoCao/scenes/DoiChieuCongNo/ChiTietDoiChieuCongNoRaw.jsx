import { useState, useRef, useEffect } from "react";
import { Table, Typography, Button, message } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import baoCaoService from "../../../../services/baoCao.service";
import moment from "moment";

const ChiTieuDoiChieuCongNoRaw = ({ reportData, values, hasButton = false, onClose, refreshTable }) => {
  const [doiChieuCongNo, setDoiChieuCongNo] = useState(reportData);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    setDoiChieuCongNo(reportData);
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

      pdf.save("bao-cao-doi-chieu-cong-no.pdf");
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await baoCaoService.postReportDCCN(values);
      message.success("Xác nhận thành công!");
      onClose();
      refreshTable();
    } catch (error) {
      message.error("Xác nhận thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Columns configuration
  const columns = [
    {
      title: "ID Chứng Từ",
      dataIndex: "chungTuId",
      key: "id",
    },
    {
      title: "Nợ Đã Trả",
      dataIndex: "collected",
      key: "collected",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Nợ Chưa Trả",
      dataIndex: "notCollected",
      key: "notCollected",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Nợ Trong Hạn",
      dataIndex: "inOfDate",
      key: "inOfDate",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Nợ Quá Hạn",
      dataIndex: "outOfDate",
      key: "outOfDate",
      render: (text) => text.toLocaleString(),
    },
  ];

  // Create the table data source with customer summaries
  const getDataSource = () => {
    if (!doiChieuCongNo?.reportDccnDetails) return [];

    let dataSource = [];

    doiChieuCongNo.reportDccnDetails.forEach((detail) => {
      const { customer, ctbans } = detail;
      let collectedTotal = 0;
      let notCollectedTotal = 0;
      let inOfDateTotal = 0;
      let outOfDateTotal = 0;

      // Loop through each sale document (ctban) for the customer
      const customerDetails = ctbans.map((ctbanDetail) => {
        collectedTotal += ctbanDetail.collected;
        notCollectedTotal += ctbanDetail.notCollected;
        inOfDateTotal += ctbanDetail.inOfDate;
        outOfDateTotal += ctbanDetail.outOfDate;

        return {
          key: ctbanDetail.ctban.id, // ID chứng từ lấy từ ctban.id
          chungTuId: ctbanDetail.ctban.id, // Sử dụng ctban.id làm ID
          collected: ctbanDetail.collected,
          notCollected: ctbanDetail.notCollected,
          inOfDate: ctbanDetail.inOfDate,
          outOfDate: ctbanDetail.outOfDate,
        };
      });

      dataSource = dataSource.concat(customerDetails);

      // Add customer summary row after looping through their documents
      if (customerDetails.length > 0) {
        dataSource.push({
          key: `summary-${customer.id}`,
           chungTuId: <strong>Khách hàng: {customer.id} - {customer.name}</strong>,
          collected: collectedTotal,
          notCollected: notCollectedTotal,
          inOfDate: inOfDateTotal,
          outOfDate: outOfDateTotal,
        });
      }
    });

    return dataSource;
  };

  return (
    <div>
      <div ref={reportRef}>
        <h2 className="text-xl font-bold mt-5" style={{ textAlign: "center" }}>
          {doiChieuCongNo?.name}
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography.Text strong>
            Thời gian: {moment(doiChieuCongNo?.startDate).format("DD/MM/YYYY")} -{" "}
            {moment(doiChieuCongNo?.endDate).format("DD/MM/YYYY")}
          </Typography.Text>
          <br />
          <Typography.Text>{doiChieuCongNo?.description}</Typography.Text>
        </div>
        <Table
          dataSource={getDataSource()}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="key"
          bordered
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button type="primary" onClick={handleConfirm} loading={loading}>
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default ChiTieuDoiChieuCongNoRaw;
