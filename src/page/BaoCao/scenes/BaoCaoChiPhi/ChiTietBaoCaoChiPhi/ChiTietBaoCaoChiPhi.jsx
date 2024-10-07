import { useState, useEffect, useRef } from "react";
import { Table, Typography, Button } from "antd";
import { useParams } from "react-router-dom";
import baoCaoService from "../../../../../services/baoCao.service";
import moment from "moment";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CompanyInfo from "../../../../../component/HeaderCompany";
import DirectorSignature from "../../../../../component/Sign";

const ChiTietBaoCaoChiPhi = ({ hasButton = true }) => {
  const [chiPhi, setChiPhi] = useState({});
  const { id } = useParams();
  const reportRef = useRef();

  useEffect(() => {
    getDetailChiPhi();
  }, []);

  const getDetailChiPhi = async () => {
    try {
      const res = await baoCaoService.getDetailChiPhi(id);
      setChiPhi(res.data.result.data);
    } catch (error) {
      console.error(error);
    }
  };

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

      pdf.save("bao-cao-chi-phi.pdf");
    });
  };

  // Định dạng tiền tệ VND
  const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  // Tạo dữ liệu tổng hợp
  const summaryData = [
    { label: "Doanh thu", value: chiPhi?.revenue },
    { label: "Giảm trừ doanh thu", value: chiPhi?.revenueDeduction },
    { label: "Doanh thu thuần", value: chiPhi?.netRevenue },
    { label: "Chi phí hàng hóa", value: chiPhi?.goodsCost },
    { label: "Lợi nhuận gộp", value: chiPhi?.grossProfit },
    { label: "Chi phí tài chính", value: chiPhi?.financeExpense },
    { label: "Chi phí bán hàng", value: chiPhi?.sellingExpense },
    { label: "Chi phí quản lý", value: chiPhi?.managementExpense },
    { label: "Lợi nhuận hoạt động", value: chiPhi?.operatingProfit },
    { label: "Lợi nhuận trước thuế", value: chiPhi?.profitBeforeTax },
    { label: "Thuế thu nhập doanh nghiệp", value: chiPhi?.corporateIncomeTax },
    { label: "Lợi nhuận sau thuế", value: chiPhi?.profitAfterTax },
  ];

  return (
    <div  className='mx-5 my-5'>
      <div ref={reportRef}>
        <CompanyInfo/>
        <h2 className="text-xl font-bold mt-5" style={{ textAlign: "center" }}>
          {chiPhi?.name}
        </h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Typography.Text strong>
            Thời gian: {moment(chiPhi?.startDate).format('DD/MM/YYYY')} -{" "}
            {moment(chiPhi?.endDate).format('DD/MM/YYYY')}
          </Typography.Text>
          <br />
          <Typography.Text>{chiPhi?.description}</Typography.Text>
        </div>

        {/* Hiển thị dữ liệu tổng hợp bằng bảng */}
        <Table
          dataSource={summaryData.map((item, index) => ({
            key: index,
            label: item.label,
            value: Math.abs(item.value), // Chuyển giá trị thành dương
            isNegative: item.value < 0, // Kiểm tra xem giá trị có âm không
          }))}
          columns={[
            { title: "Thông tin", dataIndex: "label", key: "label" },
            { 
              title: "Giá trị", 
              dataIndex: "value", 
              key: "value",
              render: (text, record) => (
                <span style={{ color: record.isNegative ? 'red' : 'inherit' }}>
                  {VND.format(text)}
                </span>
              )
            },
          ]}
          className="mx-5"
          pagination={false}
          rowKey="key"
          bordered
        />
        <DirectorSignature/>
      </div>

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

export default ChiTietBaoCaoChiPhi;
