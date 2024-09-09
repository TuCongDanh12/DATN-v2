import { useState, useRef, useEffect } from "react";
import { Table, Typography, Button, message } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import baoCaoService from "../../../../services/baoCao.service";
import moment from "moment";

const ChiTietBaoCaoNoPhaiTraRaw = ({ reportData, values, hasButton = false, onClose, refreshTable }) => {
  const [noPhaiTra, setNoPhaiTra] = useState(reportData);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    setNoPhaiTra(reportData);
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

      pdf.save("bao-cao-mua-hang.pdf");
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await baoCaoService.postReportNoPhaiTra(values);
      message.success("Xác nhận thành công!");
      onClose(); // Đóng modal sau khi xác nhận thành công
      refreshTable(); // Gọi hàm refreshTable để cập nhật lại bảng
    } catch (error) {
      message.error("Xác nhận thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID Chứng Từ Mua",
      dataIndex: "ctmuaId",
      key: "ctmuaId",
      render: (text, record) => {
        if (String(text).startsWith("Nhà cung cấp")) {
          return <strong>{text}</strong>;
        }
        return text;
      },
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
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

  const getDataSource = () => {
    if (!noPhaiTra?.reportNoPhaiTraDetails) return [];

    let dataSource = [];
    noPhaiTra.reportNoPhaiTraDetails.forEach((detail) => {
      const { supplier, reportNoPhaiTraSupplierDetails } = detail;
      let total = 0;
      let inOfDate = 0;
      let outOfDate = 0;

      const supplierDetails = reportNoPhaiTraSupplierDetails
        .filter((supplierDetail) => supplierDetail.total - supplierDetail.paid > 0)
        .map((supplierDetail) => {
          total += supplierDetail.total;
          inOfDate += supplierDetail.inOfDate;
          outOfDate += supplierDetail.outOfDate;

          return {
            key: supplierDetail.id,
            ctmuaId: supplierDetail.ctmua.id,
            total: supplierDetail.total,
            inOfDate: supplierDetail.inOfDate,
            outOfDate: supplierDetail.outOfDate,
          };
        });

      dataSource = dataSource.concat(supplierDetails);

      if (supplierDetails.length > 0) {
        dataSource.push({
          key: `summary-${supplier.id}`,
          ctmuaId: `Nhà cung cấp: ${supplier.id} - ${supplier.name}`,
          total: total,
          inOfDate: inOfDate,
          outOfDate: outOfDate,
        });
      }
    });

    return dataSource;
  };

  return (
    <div>
      <div ref={reportRef}>
        <h2 className="text-xl font-bold mt-5" style={{ textAlign: "center" }}>
          {noPhaiTra?.name}
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography.Text strong>
            Thời gian: {moment(noPhaiTra?.startDate).format("DD/MM/YYYY")} -{" "}
            {moment(noPhaiTra?.endDate).format("DD/MM/YYYY")}
          </Typography.Text>
          <br />
          <Typography.Text>{noPhaiTra?.description}</Typography.Text>
        </div>
        <Table
          dataSource={getDataSource()}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="key"
          bordered
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

export default ChiTietBaoCaoNoPhaiTraRaw;
