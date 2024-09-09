import { useState, useEffect, useRef } from "react";
import { Table, Typography, Button } from "antd";
import { useParams } from "react-router-dom";
import baoCaoService from "../../../../../services/baoCao.service";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ChiTietBaoCaoNoPhaiTra = ({ hasButton = true }) => {
  const [noPhaiTra, setNoPhaiTra] = useState([]);
  const { id } = useParams(); // Lấy id từ URL
  const reportRef = useRef(); // Tham chiếu đến phần tử cần xuất PDF

  useEffect(() => {
    getDetailNoPhaiTra();
  }, []);

  const getDetailNoPhaiTra = async () => {
    try {
      const res = await baoCaoService.getDetailReportNoPhaiTra(id);
      console.log("Chi tiết Nợ phải trả", res.data.result.data);
      setNoPhaiTra(res.data.result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPdf = () => {
    const input = reportRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; // Chiều rộng của ảnh trong PDF
      const pageHeight = 295; // Chiều cao của một trang PDF
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

  // Cột cho bảng
  const columns = [
    {
      title: "ID Chứng Từ Mua",
      dataIndex: "ctmuaId",
      key: "ctmuaId",
      render: (text, record) => {
        // Kiểm tra nếu là hàng tổng kết (ctmuaId bắt đầu với "Nhà cung cấp")
        if (String(text).startsWith("Nhà cung cấp")) {
          return <strong>{text}</strong>; // In đậm Nhà cung cấp
        }
        return text;
      },
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (value) => value.toLocaleString(), // Hiển thị số tiền có dấu phân cách
    },
    {
      title: "Nợ Trong Hạn",
      dataIndex: "inOfDate",
      key: "inOfDate",
      render: (value) => value.toLocaleString(), // Hiển thị số tiền có dấu phân cách
    },
    {
      title: "Nợ Quá Hạn",
      dataIndex: "outOfDate",
      key: "outOfDate",
      render: (value) => value.toLocaleString(), // Hiển thị số tiền có dấu phân cách
    },
  ];

  // Hàm xử lý dữ liệu để tạo bảng
  const getDataSource = () => {
    if (!noPhaiTra.reportNoPhaiTraDetails) return [];

    // Lặp qua từng nhà cung cấp và lọc các hàng có total - paid > 0
    let dataSource = [];
    noPhaiTra.reportNoPhaiTraDetails.forEach((detail) => {
      const { supplier, reportNoPhaiTraSupplierDetails } = detail;
      let total = 0;
      let inOfDate = 0;
      let outOfDate = 0;

      // Lọc và tạo dữ liệu cho bảng
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

      // Thêm hàng chi tiết của từng nhà cung cấp
      dataSource = dataSource.concat(supplierDetails);

      // Thêm hàng tổng kết cho nhà cung cấp
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
      {/* Phần cần xuất PDF */}
      <div ref={reportRef}>
        <h2 className="text-xl font-bold mt-5" style={{ textAlign: "center" }}>
          {noPhaiTra.name}
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography.Text strong>
            {/* Sử dụng moment để định dạng ngày */}
            Thời gian: {moment(noPhaiTra?.startDate).format('DD/MM/YYYY')} -{" "}
            {moment(noPhaiTra?.endDate).format('DD/MM/YYYY')}
          </Typography.Text>
          <br />
          <Typography.Text>{noPhaiTra?.description}</Typography.Text>
        </div>
        <Table
          dataSource={getDataSource()}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey="key" // Sử dụng key duy nhất
          bordered
        />
      </div>

      {/* Chỉ hiển thị nút nếu hasButton là true */}
      {hasButton && (
        <div className='mr-5' style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button type="primary" onClick={handleExportPdf}>
            Xuất file PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChiTietBaoCaoNoPhaiTra;
