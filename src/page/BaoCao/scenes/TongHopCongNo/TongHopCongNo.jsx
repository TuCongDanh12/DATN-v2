import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import { useNavigate } from "react-router-dom"; 
import congNoService from "../../../../services/congNo.service";
import doiTuongService from "../../../../services/doiTuong.service"; // API lấy danh sách khách hàng
import getColumns from './columns'; 
import ChiTietTongHopCongNoRaw from "./ChiTietTongHopCongNoRaw"; 

const { RangePicker } = DatePicker;
const { Option } = Select;

const TongHopCongNo = () => {
  const [reportList, setReportList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [newReportData, setNewReportData] = useState(null);
  const [values, setValues] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getListReportTHCN();
    getListCustomers();
  }, []);

  const getListReportTHCN = async () => {
    try {
      const res = await congNoService.getListReportTHCN();
      setReportList(res.data.result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getListCustomers = async () => {
    try {
      const res = await doiTuongService.getListCustomer();
      setCustomers(res.data.result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedCustomers([]); // Reset danh sách khách hàng được chọn
  };

  const handleCreateReport = async (values) => {
    try {
      setLoading(true);
      const { rangePicker, name, description } = values;
      const startDate = rangePicker[0].format("YYYY-MM-DD");
      const endDate = rangePicker[1].format("YYYY-MM-DD");

      const reportData = { 
        name, 
        description, 
        startDate, 
        endDate, 
        customerIds: selectedCustomers.length > 0 ? selectedCustomers : [] 
      };
      setValues(reportData);

      const res = await congNoService.postReportTHCNRaw(reportData);
      setNewReportData(res.data.result.data);
      setIsDetailModalVisible(true);
      handleCancelModal();
      getListReportTHCN();
    } catch (error) {
      message.error("Tạo báo cáo thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDetailModal = () => {
    setIsDetailModalVisible(false);
  };

  return (
    <div>
      <div className="mt-5 ml-5" style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={showModal}>
          Tạo Báo Cáo Tổng Hợp Công Nợ
        </Button>
      </div>

      <Table dataSource={reportList} columns={getColumns(navigate)} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title="Tạo Báo Cáo Tổng Hợp Công Nợ"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateReport}>
          <Form.Item 
            name="name" 
            label="Tên Báo Cáo" 
            rules={[{ required: true, message: "Vui lòng nhập tên báo cáo" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            name="description" 
            label="Mô Tả"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item 
            name="rangePicker" 
            label="Thời Gian" 
            rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian" }]}
          >
            <RangePicker />
          </Form.Item>

          <Form.Item label="Chọn Khách Hàng">
            <Select
              mode="multiple"
              placeholder="Chọn khách hàng"
              onChange={setSelectedCustomers}
              allowClear
            >
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo Báo Cáo
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi Tiết Báo Cáo Tổng Hợp Công Nợ"
        visible={isDetailModalVisible}
        onCancel={handleCancelDetailModal}
        footer={null}
        width={1000}
      >
        {newReportData && (
          <ChiTietTongHopCongNoRaw
            reportData={newReportData}
            values={values}
            hasButton={false}
            onClose={handleCancelDetailModal}
            refreshTable={getListReportTHCN}
          />
        )}
      </Modal>
    </div>
  );
};

export default TongHopCongNo;
