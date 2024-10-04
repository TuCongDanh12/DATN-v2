import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message, Select } from "antd";
import { useNavigate } from "react-router-dom"; 
import baoCaoService from "../../../../services/baoCao.service";
import doiTuongService from "../../../../services/doiTuong.service"; // API lấy danh sách khách hàng
import getColumns from './columns'; 
import ChiTietDoiChieuCongNoRaw from "./ChiTietDoiChieuCongNoRaw"; 

const { RangePicker } = DatePicker;
const { Option } = Select;

const DoiChieuCongNo = () => {
  const [reportDCCN, setListReportDCCN] = useState([]);
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
    getListReportDCCN();
    getListCustomers()
  }, []);

  const getListReportDCCN = async () => {
    try {
      const res = await baoCaoService.getReportDCCN();
      setListReportDCCN(res.data.result.data);
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
  };

  const handleCreateReport = async (values) => {
    try {
      setLoading(true);
      const { rangePicker, name, description } = values;
      const startDate = rangePicker[0].format("YYYY-MM-DD");
      const endDate = rangePicker[1].format("YYYY-MM-DD");

      const reportData = { name, description, startDate, endDate, customerIds: selectedCustomers };
      setValues(reportData);

      const res = await baoCaoService.postReportDCCNRaw(reportData);
      setNewReportData(res.data.result.data);
      setIsDetailModalVisible(true);
      handleCancelModal();
      getListReportDCCN();
    } catch (error) {
      message.error("Tạo báo cáo thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDetailModal = () => {
    setIsDetailModalVisible(false);
    setNewReportData(null);
  };

  const refreshTable = () => {
    getListReportDCCN();
  };

  const columns = getColumns(navigate);

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Tạo Báo Cáo Mới
      </Button>

      <Table dataSource={reportDCCN} columns={columns} rowKey="id" />

      <Modal
        title="Tạo Báo Cáo Đối Chiếu Công Nợ"
        visible={isModalVisible}
        onCancel={handleCancelModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateReport}
        >
          <Form.Item name="name" label="Tên Báo Cáo" rules={[{ required: true, message: "Vui lòng nhập tên báo cáo" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô Tả">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="rangePicker" label="Thời Gian" rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian" }]}>
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
        title="Chi Tiết Báo Cáo"
        visible={isDetailModalVisible}
        onCancel={handleCancelDetailModal}
        footer={null}
        width="80%"
      >
        {newReportData && (
          <ChiTietDoiChieuCongNoRaw
            reportData={newReportData}
            values={values}
            hasButton
            onClose={handleCancelDetailModal}
            refreshTable={refreshTable}
          />
        )}
      </Modal>
    </div>
  );
};

export default DoiChieuCongNo;
