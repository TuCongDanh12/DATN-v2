import { useState, useRef, useEffect } from "react";
import { Table, Typography, Button, message } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import baoCaoService from "../../../../../services/baoCao.service";
import moment from "moment";
import { useParams } from "react-router-dom";
import CompanyInfo from "../../../../../component/HeaderCompany";
import DirectorSignature from "../../../../../component/Sign";

const ChiTietDoiChieuCongNo = () => {
  const [doiChieuCongNo, setDoiChieuCongNo] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();
  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    getDetailNoPhaiTra()
  }, []);
  const getDetailNoPhaiTra = async () => {
    try {
      const res = await baoCaoService.getDetailReportDCCN(id);
      console.log("Chi tiết đối chiếu công nợ", res.data.result.data);
      setDoiChieuCongNo(res.data.result.data);
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

      pdf.save("bao-cao-doi-chieu-cong-no.pdf");
    });
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
    if (!doiChieuCongNo?.reportDccnDetails || !Array.isArray(doiChieuCongNo.reportDccnDetails)) {
        return []; // Return an empty array if reportDccnDetails is not available
    }

    let dataSource = [];

    doiChieuCongNo.reportDccnDetails.forEach((detail) => {
        const { customer, reportDccnCustomerDetails } = detail;

        // Check if ctbans is an array
        if (!Array.isArray(reportDccnCustomerDetails)) {
            console.warn(`ctbans is not an array for customer ${customer.id}`);
            return; // Skip this iteration if ctbans is not an array
        }

        let collectedTotal = 0;
        let notCollectedTotal = 0;
        let inOfDateTotal = 0;
        let outOfDateTotal = 0;

        // Loop through each sale document (ctban) for the customer
        const customerDetails = reportDccnCustomerDetails.map((ctbanDetail) => {
            collectedTotal += ctbanDetail.collected || 0; // Default to 0 if undefined
            notCollectedTotal += ctbanDetail.notCollected || 0;
            inOfDateTotal += ctbanDetail.inOfDate || 0;
            outOfDateTotal += ctbanDetail.outOfDate || 0;

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
    <div  className='mx-5 my-5'>
      <div ref={reportRef}>
        <CompanyInfo/>
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
          className="mx-5"
          dataSource={getDataSource()}
          columns={columns}
          pagination={false}
          rowKey="key"
          bordered
        />
        <DirectorSignature/>
      </div>

      <div className='mr-5' style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Button type="primary" onClick={handleExportPdf}>
            Xuất file PDF
          </Button>
        </div>
      {/* <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button type="primary" onClick={handleConfirm} loading={loading}>
          Xác nhận
        </Button>
      </div> */}
    </div>
  );
};

export default ChiTietDoiChieuCongNo;
