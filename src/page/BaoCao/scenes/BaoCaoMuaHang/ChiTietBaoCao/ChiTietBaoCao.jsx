import React, { useState, useEffect, useRef } from "react";
import { Table, Typography, Button, message } from "antd";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import baoCaoService from "../../../../../services/baoCao.service";
import CompanyInfo from "../../../../../component/HeaderCompany";
import DirectorSignature from "../../../../../component/Sign";

const { Title } = Typography;

const ChiTietBaoCaoMuaHang = () => {
    const { id } = useParams(); // Lấy id từ URL
    const reportRef = useRef(); // Tạo ref để tham chiếu đến phần cần xuất PDF

    const [dataSource, setDataSource] = useState([]);
    const [reportDetails, setReportDetails] = useState(null);

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const response = await baoCaoService.getDetailReportCPMH(id);
                const report = response.data.result.data;
                setReportDetails(report);

                // Chuẩn bị dữ liệu cho bảng
                const calculatedDataSource = report.reportCpmhDetails.flatMap((detail) =>
                    detail.reportCpmhProductDetails.map((productDetail, index) => ({
                        key: `${detail.id}-${index}`,
                        productName: index === 0 ? detail.product.name : null,
                        rowSpan: index === 0 ? detail.reportCpmhProductDetails.length : 0,
                        ...productDetail,
                    }))
                );
                setDataSource(calculatedDataSource);

            } catch (error) {
                message.error("Không thể tải chi tiết báo cáo, vui lòng thử lại.");
            }
        };

        fetchReportDetails();
    }, [id]);

    // Tính tổng của các cột chiết khấu và tổng giá trị mua
    const totalDiscount = dataSource.reduce((sum, record) => sum + (record.discountValue || 0), 0);
    const totalPurchaseValue = dataSource.reduce((sum, record) => sum + (record.totalValue || 0), 0);

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: "Tên hàng",
            dataIndex: "productName",
            key: "productName",
            render: (text, record) => {
                return {
                    children: text ? `${text} (${record.rowSpan})` : null,
                    props: {
                        rowSpan: record.rowSpan, // Sử dụng rowSpan từ dữ liệu đã tính toán
                    },
                };
            },
        },
        {
            title: "Mã nhà cung cấp",
            dataIndex: "supplier.name",
            key: "supplier.name",
            render: (_, record) => record.supplier?.name || 'N/A',
        },
        {
            title: "Tên nhà cung cấp",
            dataIndex: "supplier.representative",
            key: "supplier.representative",
            render: (_, record) => record.supplier?.representative || 'N/A',
        },
//         {
//             title: "ĐVT",
//             dataIndex: "unit",
//             key: "unit",
//             render: (_, record) => {
//                 console.log(record); // Kiểm tra cấu trúc của record
//                 return record.product ? record.product.unit : 'N/A';
//             },
//         }
// ,        
        
        {
            title: "Số lượng mua",
            dataIndex: "count",
            key: "count",
        },
        {
            title: "Chiết khấu",
            dataIndex: "discountValue",
            key: "discountValue",
            render: (text) => `${(text || 0).toLocaleString()} VND`,
        },
        {
            title: "Tổng giá trị mua",
            dataIndex: "totalValue",
            key: "totalValue",
            render: (text) => `${(text || 0).toLocaleString()} VND`,
        },
    ];

    // Hàm xử lý xuất PDF
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

    return (
        <div  className='mx-5 my-5'>
            <div ref={reportRef}>
                <CompanyInfo/>
                <Title className="mt-5" level={2} style={{ textAlign: "center" }}>
                    {reportDetails?.name || "Chi Tiết Báo Cáo Mua Hàng"}
                </Title>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Typography.Text strong>
                        Thời gian: {reportDetails?.startDate} - {reportDetails?.endDate}
                    </Typography.Text>
                    <br />
                    <Typography.Text>
                        {reportDetails?.description}
                    </Typography.Text>
                </div>
                {dataSource.length > 0 && (
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        pagination={false}
                        style={{ marginTop: "20px" }}
                        className='mx-5'
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={4}>
                                    <Typography.Text strong>Tổng cộng</Typography.Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <Typography.Text strong>{`${totalDiscount.toLocaleString()} VND`}</Typography.Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Typography.Text strong>{`${totalPurchaseValue.toLocaleString()} VND`}</Typography.Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                )}
                <DirectorSignature/>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Button type="primary" onClick={handleExportPdf}>
                    Xuất file PDF
                </Button>
            </div>
        </div>
    );
};

export default ChiTietBaoCaoMuaHang;
