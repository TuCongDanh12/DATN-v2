import React, { useState, useEffect } from 'react';
import { Tabs, Table, Select, Card, notification } from 'antd';
import doiTuongService from '../../../../services/doiTuong.service';

const { TabPane } = Tabs;
const { Option } = Select;

const NhanVien = () => {
  const [accountants, setAccountants] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [purchasingOfficers, setPurchasingOfficers] = useState([]);
  const [warehouseKeepers, setWarehouseKeepers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchSalespersons = async () => {
    try {
      const response = await doiTuongService.getListSalesperson();
      setSalespersons(response.data.result.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy danh sách nhân viên bán hàng.',
      });
    }
  };

  const fetchPurchasingOfficers = async () => {
    try {
      const response = await doiTuongService.getListPurchasingOfficer();
      setPurchasingOfficers(response.data.result.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy danh sách nhân viên mua hàng.',
      });
    }
  };

  const fetchWarehouseKeepers = async () => {
    try {
      const response = await doiTuongService.getListWarehouseKeeper();
      setWarehouseKeepers(response.data.result.data);
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể lấy danh sách người giữ kho.',
      });
    }
  };

  useEffect(() => {
    fetchAccountants();
    fetchSalespersons();
    fetchPurchasingOfficers();
    fetchWarehouseKeepers();
  }, []);

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      notification.success({
        message: 'Thành công',
        description: 'ID đã được sao chép!',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể sao chép ID.',
      });
    }
  };

  const accountantColumns = [
    { title: 'Mã nhân viên', dataIndex: 'id', key: 'id', render: (text) => (
      <span onClick={() => handleCopyId(text)} style={{ cursor: 'pointer', color: 'blue' }}>{text}</span>
    ) },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
  ];

  const salespersonColumns = [
    { title: 'Mã nhân viên', dataIndex: 'id', key: 'id', render: (text) => (
      <span onClick={() => handleCopyId(text)} style={{ cursor: 'pointer', color: 'blue' }}>{text}</span>
    ) },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
  ];

  const purchasingOfficerColumns = [
    { title: 'Mã nhân viên', dataIndex: 'id', key: 'id', render: (text) => (
      <span onClick={() => handleCopyId(text)} style={{ cursor: 'pointer', color: 'blue' }}>{text}</span>
    ) },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
  ];

  const warehouseKeeperColumns = [
    { title: 'Mã nhân viên', dataIndex: 'id', key: 'id', render: (text) => (
      <span onClick={() => handleCopyId(text)} style={{ cursor: 'pointer', color: 'blue' }}>{text}</span>
    ) },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
  ];

  return (
    <div className="p-8">
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Kế toán" key="1">
          <Card>
            <Table
              columns={accountantColumns}
              dataSource={accountants}
              rowKey="id"
            />
          </Card>
        </TabPane>
        <TabPane tab="Nhân viên mua hàng" key="2">
          <Card>
            <Table
              columns={purchasingOfficerColumns}
              dataSource={purchasingOfficers}
              rowKey="id"
            />
          </Card>
        </TabPane>
        <TabPane tab="Nhân viên bán hàng" key="3">
          <Card>
            <Table
              columns={salespersonColumns}
              dataSource={salespersons}
              rowKey="id"
            />
          </Card>
        </TabPane>
        <TabPane tab="Người giữ kho" key="4">
          <Card>
            <Table
              columns={warehouseKeeperColumns}
              dataSource={warehouseKeepers}
              rowKey="id"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default NhanVien;
