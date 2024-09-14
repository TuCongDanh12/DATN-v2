import React, { useState, useEffect } from 'react';
import { Card, Typography, Col, Row, Button, Form, Input, Modal, notification } from 'antd';
import authService from '../../../services/auth.service';
import 'antd/dist/reset.css'; // Đảm bảo bạn đã import CSS của Ant Design

const { Title } = Typography;

const ThongTinCongTy = () => {
    const [infoCompany, setInfoCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const getInfoCompany = async () => {
            try {
                const res = await authService.getProfile();
                setInfoCompany(res.data.result.data);
                form.setFieldsValue(res.data.result.data); // Set initial form values
            } catch (error) {
                console.error(error);
            }
        };
        getInfoCompany();
    }, [form]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            await authService.updateProfile({ values });
            setInfoCompany(values);
            setIsEditing(false);
            notification.success({
                message: 'Cập nhật thành công',
                description: 'Thông tin công ty đã được cập nhật thành công.',
            });
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Cập nhật thất bại',
                description: 'Đã xảy ra lỗi khi cập nhật thông tin công ty. Vui lòng thử lại.',
            });
        }
    };

    if (!infoCompany) return <div>Loading...</div>;

    return (
        <div className="p-8">
            <Title level={2} className="mb-6">Thông Tin Công Ty</Title>
            <Card>
                <div className="flex flex-col mb-4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Tên Công Ty:</div>
                                <div className="w-3/4">{infoCompany.companyName}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Mã Số Thuế:</div>
                                <div className="w-3/4">{infoCompany.companyTaxCode}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Địa Chỉ:</div>
                                <div className="w-3/4">{infoCompany.companyAddress}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Điện Thoại:</div>
                                <div className="w-3/4">{infoCompany.companyPhone}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Email:</div>
                                <div className="w-3/4">{infoCompany.companyEmail}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="flex items-center mb-4">
                                <div className="w-1/4 font-semibold">Người Đại Diện:</div>
                                <div className="w-3/4">{infoCompany.companyRepresentative}</div>
                            </div>
                        </Col>
                    </Row>
                    <Button type="primary" className='max-w-[200px]' onClick={handleEdit}>Chỉnh sửa</Button>
                </div>
            </Card>

            {/* Modal Chỉnh sửa */}
            <Modal
                title="Chỉnh sửa thông tin công ty"
                visible={isEditing}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="companyName"
                        label="Tên Công Ty"
                        rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyTaxCode"
                        label="Mã Số Thuế"
                        rules={[{ required: true, message: 'Vui lòng nhập mã số thuế!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyAddress"
                        label="Địa Chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyPhone"
                        label="Điện Thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyEmail"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="companyRepresentative"
                        label="Người Đại Diện"
                        rules={[{ required: true, message: 'Vui lòng nhập người đại diện!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThongTinCongTy;
