import React, { useState, useEffect } from 'react';
import { Tabs, Table, Select, Card, Typography, notification, Button, Form, Input, Modal, Checkbox } from 'antd';
import doiTuongService from '../../../services/doiTuong.service';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const ThemNhanVien = () => {
  const [accountants, setAccountants] = useState([]);
  const [otherEmployees, setOtherEmployees] = useState([]);
  const [selectedType, setSelectedType] = useState('salesperson'); // Giá trị mặc định là 'salesperson'
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAccountantModalVisible, setIsAccountantModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [accountantForm] = Form.useForm();

  // Hàm để lấy danh sách kế toán
  const fetchAccountants = async () => {
    try {
      const response = await doiTuongService.getListAccountant();
      setAccountants(response.data.result.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy danh sách kế toán.',
      });
    }
  };

  // Hàm để lấy danh sách nhân viên khác
  const fetchOtherEmployees = async () => {
    setLoading(true);
    try {
      let response;
      switch (selectedType) {
        case 'salesperson':
          response = await doiTuongService.getListSalesperson();
          break;
        case 'purcharsing_Officer':
          response = await doiTuongService.getListPurchasingOfficer();
          break;
        case 'warehouse_Keep':
          response = await doiTuongService.getListWarehouseKeeper();
          break;
        default:
          response = { data: { result: { data: [] } } }; // Đặt giá trị mặc định
          break;
      }
      setOtherEmployees(response.data.result.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy danh sách nhân viên.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, []);

  useEffect(() => {
    fetchOtherEmployees();
  }, [selectedType]);

  const handleAddEmployee = async (values) => {
    try {
      await doiTuongService.postEmployee({
        ...values,
        role: selectedType.toUpperCase(), // Chuyển đổi loại nhân viên thành uppercase
      });
      notification.success({
        message: 'Thành công',
        description: 'Nhân viên đã được thêm thành công.',
      });
      setIsModalVisible(false);
      form.resetFields();
      fetchOtherEmployees(); // Cập nhật danh sách nhân viên sau khi thêm mới
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm nhân viên.',
      });
    }
  };

  const handleAddAccountant = async (values) => {
    try {
      await doiTuongService.postAccountant({...values, isAdmin: false});
      notification.success({
        message: 'Thành công',
        description: 'Kế toán đã được thêm thành công.',
      });
      setIsAccountantModalVisible(false);
      accountantForm.resetFields();
      fetchAccountants(); // Cập nhật danh sách kế toán sau khi thêm mới
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm kế toán.',
      });
    }
  };

  const accountantColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  ];

  const otherEmployeeColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  ];

  return (
    <div className="p-8">
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Kế toán" key="1">
          <div className="flex items-center mb-4">
            <Button type="primary" onClick={() => setIsAccountantModalVisible(true)}>
              Thêm Kế Toán
            </Button>
          </div>
          <Card>
            <Table
              columns={accountantColumns}
              dataSource={accountants}
              rowKey="id"
            />
          </Card>
        </TabPane>
        <TabPane tab="Nhân viên khác" key="2">
          <div className="flex items-center mb-4">
            <Select
              value={selectedType}
              style={{ width: 200, marginRight: 16 }}
              onChange={(value) => setSelectedType(value)}
            >
              <Option value="salesperson">Nhân viên bán hàng</Option>
              <Option value="purcharsing_Officer">Nhân viên mua hàng</Option>
              <Option value="warehouse_Keep">Người giữ kho</Option>
            </Select>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Thêm nhân viên
            </Button>
          </div>
          <Card>
            <Table
              columns={otherEmployeeColumns}
              dataSource={otherEmployees}
              rowKey="id"
              loading={loading}
            />
          </Card>
        </TabPane>
      </Tabs>
      <Modal
        title="Thêm Nhân Viên"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEmployee}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>
          {/* Lưu ý: Không cần thêm trường role vào form vì nó được xác định từ selectedType */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm Nhân Viên
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm Kế Toán"
        visible={isAccountantModalVisible}
        onCancel={() => setIsAccountantModalVisible(false)}
        footer={null}
      >
        <Form
          form={accountantForm}
          layout="vertical"
          onFinish={handleAddAccountant}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên kế toán' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>
          {/* <Form.Item
            name="isAdmin"
            label="Quyền Admin"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Admin</Checkbox>
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm Kế Toán
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ThemNhanVien;
