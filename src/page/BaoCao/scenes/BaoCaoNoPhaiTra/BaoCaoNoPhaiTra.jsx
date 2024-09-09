import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";
import { useNavigate } from "react-router-dom"; 
import baoCaoService from "../../../../services/baoCao.service";
import getColumns from './columns'; 
import ChiTietBaoCaoNoPhaiTraRaw from "./ChiTietBaoCaoNoPhaiTraRaw"; 

const { RangePicker } = DatePicker;

const BaoCaoNoPhaiTra = () => {
  const [reportNoPhaiTra, setListReportNoPhaiTra] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [newReportData, setNewReportData] = useState(null);
  const [values, setValues] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getListReportNoPhaiTra();
  }, []);

  const getListReportNoPhaiTra = async () => {
    try {
      const res = await baoCaoService.getReportNoPhaiTra();
      setListReportNoPhaiTra(res.data.result.data);
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

      const reportData = { name, description, startDate, endDate };
      setValues(reportData);

      const res = await baoCaoService.postReportNoPhaiTraRaw(reportData);
      setNewReportData(res.data.result.data);
      setIsDetailModalVisible(true);
      handleCancelModal();
      getListReportNoPhaiTra();
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
          Tạo báo cáo
        </Button>
      </div>

      <Table dataSource={reportNoPhaiTra} columns={getColumns(navigate)} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal title="Tạo báo cáo" visible={isModalVisible} onCancel={handleCancelModal} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreateReport}>
          <Form.Item
            name="rangePicker"
            label="Chọn khoảng thời gian"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc!",
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
                message: "Trường này là bắt buộc!",
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
                message: "Trường này là bắt buộc!",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {newReportData && (
        <Modal
          title="Chi tiết báo cáo"
          visible={isDetailModalVisible}
          onCancel={handleCancelDetailModal}
          footer={null}
          width={800}
        >
          <ChiTietBaoCaoNoPhaiTraRaw
            key={newReportData.id}
            reportData={newReportData}
            values={values}
            hasButton={false}
            onClose={handleCancelDetailModal}
            refreshTable={getListReportNoPhaiTra} // Truyền hàm refresh table để cập nhật lại dữ liệu
          />
        </Modal>
      )}
    </div>
  );
};

export default BaoCaoNoPhaiTra;
