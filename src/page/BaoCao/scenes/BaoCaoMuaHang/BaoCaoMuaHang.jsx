import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, Button, Modal, Input, message, Flex } from "antd";
import { MdOutlineSearch } from "react-icons/md";
import baoCaoService from "../../../../services/baoCao.service";
import TableBaoCao from "./TableBaoCao";

const { RangePicker } = DatePicker;

const BaoCaoMuaHang = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await baoCaoService.getReportCPMH();
                setReports(response.data.result.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    const handleCreateReport = async (values) => {
        const { rangePicker, name, description } = values;
        const reportData = {
            startDate: rangePicker ? rangePicker[0].format("YYYY-MM-DD") : null,
            endDate: rangePicker ? rangePicker[1].format("YYYY-MM-DD") : null,
            name,
            description,
        };

        setLoading(true);

        try {
            const response = await baoCaoService.postReportCPMH(reportData);
            message.success("Tạo báo cáo thành công!");

            setIsModalVisible(false); // Đóng modal
            setReports([...reports, response.data.result.data]); // Cập nhật danh sách báo cáo với báo cáo mới
        } catch (error) {
            console.error("Error creating report:", error);
            message.error("Tạo báo cáo thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    return (
        <Flex vertical gap={30}>
            <div className={`px-[20px] w-full flex justify-between pb-7 bg-white py-7`}>
                <div className="flex gap-[5px] items-center">
                    <Form form={form} layout="inline">
                        <Form.Item
                            name="rangePicker"
                            className="w-[300px] !me-0"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <RangePicker />
                        </Form.Item>

                        <Button
                            className="!bg-[#FAFAFA] font-bold m-0 p-0 w-[32px] h-[32px] flex justify-center items-center rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md"
                            htmlType="submit"
                        >
                            <MdOutlineSearch size={20} color="#898989" />
                        </Button>
                    </Form>

                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Tạo báo cáo
                    </Button>
                </div>

                <Modal
                    title="Tạo báo cáo"
                    visible={isModalVisible}
                    onCancel={handleCancelModal}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleCreateReport}>
                        <Form.Item
                            name="rangePicker"
                            label="Chọn khoảng thời gian"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <RangePicker />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Tên báo cáo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Tạo báo cáo
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <TableBaoCao reports={reports} />
        </Flex>
    );
};

export default BaoCaoMuaHang;
