import React, { useState } from "react";
import { Table, Typography, Button, message } from "antd";
import baoCaoService from "../../../../services/baoCao.service"; // Đảm bảo import đúng đường dẫn

const { Title } = Typography;

const TaoBaoCao = ({ reportData }) => {
    const [loading, setLoading] = useState(false);

    // Hàm xử lý tạo báo cáo
    const handleCreateReport = async () => {
        setLoading(true);
        const values = {
            startDate: reportData.createReportCpmhDto.startDate,
            endDate: reportData.createReportCpmhDto.endDate,
            name: reportData.createReportCpmhDto.name,
            description: reportData.createReportCpmhDto.description,
        };

        try {
            const response = await baoCaoService.postReportCPMH(values);
            message.success("Tạo báo cáo thành công!");
            console.log("Báo cáo đã được tạo:", response.data); // Xử lý dữ liệu trả về nếu cần thiết
        } catch (error) {
            console.error("Error creating report:", error);
            message.error("Tạo báo cáo thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Title level={2} style={{ textAlign: "center" }}>
                {reportData.createReportCpmhDto.name}
            </Title>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Typography.Text strong>
                    Mô tả: {reportData.createReportCpmhDto.description}
                </Typography.Text>
                <br />
                <Typography.Text strong>
                    Thời gian: {reportData.createReportCpmhDto.startDate} - {reportData.createReportCpmhDto.endDate}
                </Typography.Text>
            </div>

            <Table
                columns={[
                    {
                        title: "Tên sản phẩm",
                        dataIndex: "productName",
                        key: "productName",
                    },
                    {
                        title: "ĐVT",
                        dataIndex: "unit",
                        key: "unit",
                    },
                    {
                        title: "Số lượng mua",
                        dataIndex: "quantityPurchased",
                        key: "quantityPurchased",
                    },
                    {
                        title: "Nhà cung cấp",
                        dataIndex: "supplierName",
                        key: "supplierName",
                    },
                    {
                        title: "Chiết khấu",
                        dataIndex: "discount",
                        key: "discount",
                        render: (text) => `${(text || 0).toLocaleString()} VND`,
                    },
                    {
                        title: "Tổng giá trị mua",
                        dataIndex: "totalPurchaseValue",
                        key: "totalPurchaseValue",
                        render: (text) => `${(text || 0).toLocaleString()} VND`,
                    },
                ]}
                dataSource={reportData.reportCpmhDetail.map((detail, index) => ({
                    key: index + 1,
                    productName: detail.product.name,
                    unit: detail.product.unit,
                    quantityPurchased: detail.count,
                    discount: detail.discountValue,
                    totalPurchaseValue: detail.totalValue,
                    supplierName: detail.reportCpmhProductDetails.map((supplierDetail) => supplierDetail.supplier.name).join(", "),
                }))}
                bordered
                pagination={false}
                summary={() => {
                    const totalDiscount = reportData.reportCpmhDetail.reduce((sum, detail) => sum + (detail.discountValue || 0), 0);
                    const totalPurchaseValue = reportData.reportCpmhDetail.reduce((sum, detail) => sum + (detail.totalValue || 0), 0);
                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4} >
                                <Typography.Text strong>
                                    Tổng cộng
                                </Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>
                                <Typography.Text strong>
                                    {`${totalDiscount.toLocaleString()} VND`}
                                </Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                <Typography.Text strong>
                                    {`${totalPurchaseValue.toLocaleString()} VND`}
                                </Typography.Text>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    );
                }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button
                    type="primary"
                    onClick={handleCreateReport}
                    loading={loading}
                >
                    Tạo báo cáo
                </Button>
            </div>
        </div>
    );
};

export default TaoBaoCao;
