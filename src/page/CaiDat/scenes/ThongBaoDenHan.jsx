import React, { useState, useEffect } from 'react';
import { notification, Card, Typography, Button, Form, InputNumber, Modal } from 'antd';
import authService from '../../../services/auth.service'; // Đảm bảo đường dẫn chính xác đến service của bạn

const { Title, Text } = Typography;

const ThongBaoDenHan = () => {
  const [infoCompany, setInfoCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Hàm để lấy thông tin từ API
  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      const data = res.data.result.data;
      setInfoCompany(data);
      form.setFieldsValue({ // Đặt giá trị mặc định cho form
        firstAnnounce: data.firstAnnounce,
        secondAnnounce: data.secondAnnounce,
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy thông tin công ty.',
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (values) => {
    try {
      await authService.updateProfile({ values });
      notification.success({
        message: 'Thành công',
        description: 'Thông tin đã được cập nhật thành công.',
      });
      setIsEditing(false);
      fetchProfile(); // Cập nhật lại thông tin sau khi lưu
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật thông tin.',
      });
    }
  };

  if (!infoCompany) {
    return <div>Đang tải...</div>; // Hoặc có thể thay thế bằng spinner, tùy thuộc vào thiết kế của bạn
  }

  const { firstAnnounce, secondAnnounce } = infoCompany;

  return (
    <div className="p-8">
      <Title level={2}>Thông Báo đến hạn</Title>
      <Card>
        <div>
          <Text strong>Thông báo lần 1:</Text> Trước <strong>{firstAnnounce}</strong> ngày
        </div>
        <div>
          <Text strong>Thông báo lần 2:</Text> Trước <strong>{secondAnnounce}</strong> ngày
        </div>
        <Button type="primary" onClick={handleEditClick} style={{ marginTop: 16 }}>
          Chỉnh sửa
        </Button>
      </Card>

      <Modal
        title="Chỉnh sửa thông báo đến hạn"
        visible={isEditing}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="firstAnnounce"
            label="Thông báo lần 1 (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="secondAnnounce"
            label="Thông báo lần 2 (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ThongBaoDenHan;
