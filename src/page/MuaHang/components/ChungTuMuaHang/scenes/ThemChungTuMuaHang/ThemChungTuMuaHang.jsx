import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, DatePicker } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import muahangService from '../../../../../../services/muahang.service';
import OrderTable from './OrderTable';
import OrderSummary from '../../../../../../component/orderSumary';
import OrderActions from '../../../../../../component/actionButton';
import moment from 'moment';

const { TabPane } = Tabs;

const dataSourceTest = [
  {
    key: '1',
    maHang: '1',
    tenHang: 'Product A',
    dvt: 'Kg',
    soLuong: 10,
    soLuongDaBan: 4,
    donGia: '1.200 ₫',
    thanhTien: '12.000 ₫',
    phanTramChietKhau: 0,
    tienChietKhau: '0 ₫',
    phanTramThueGTGT: 8,
    tienThueGTGT: '960 ₫',
  },
  // Add more data rows here if needed
];

const DonMuaHang = ({ disabled }) => {
  const [donmuahang, setDonmuahang] = useState(null);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    ngayHoachToan: moment(),
    ngayGiaoHang: moment(),
    hanThanhToan: moment(), // Initialize with today's date
  });
  const [productData, setProductData] = useState(dataSourceTest); // Using the fake API data
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  useEffect(() => {
    fetchDonMuahang(id);
  }, [id]);

  const fetchDonMuahang = async (id) => {
    try {
      const response = await muahangService.getDonMuaHang({ id });
      const data = response.data.result.data;
      setDonmuahang(data);
      setProductData(data.products || dataSourceTest); // Ensure it's an array
      setFormData({
        ngayHoachToan: moment(),
        ngayGiaoHang: moment(),
        hanThanhToan: moment(), // Initialize with today's date
      });
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  const handleSave = (row) => {
    const newData = [...productData];
    const index = newData.findIndex((item) => row.key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      setProductData(newData);
    } else {
      newData.push(row);
      setProductData(newData);
    }
  };

  if (!donmuahang) return <div>Loading...</div>;

  return (
    <div className="m-6">
        <h1 className='text-2xl font-bold'>Lập chứng từ mua hàng</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Phiếu Thu" key="1">
          <Form
            form={form}
            initialValues={{
              supplierAccountName: donmuahang?.supplier?.accountName,
              supplierAddress: donmuahang?.supplier?.address,
              purchasingOfficerName: donmuahang?.purchasingOfficer?.name,
              content: donmuahang?.content,
              ngayHoachToan: formData.ngayHoachToan,
              ngayGiaoHang: formData.ngayGiaoHang,
            }}
            className="mb-4"
            labelCol={{ flex: '150px' }}
            labelAlign="left"
            labelWrap
          >
            <div className="flex gap-24">
              <div className="w-1/2">
                <Form.Item
                  label="Tên khách hàng"
                  name="supplierAccountName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="supplierAddress"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Nhân viên mua hàng"
                  name="purchasingOfficerName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="content"
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </div>

              <div className="w-1/2">
                <Form.Item
                  label="Ngày hoạch toán"
                  name="ngayHoachToan"
                >
                  <DatePicker value={formData.ngayHoachToan} disabled />
                </Form.Item>

                <Form.Item
                  label="Ngày giao hàng"
                  name="ngayGiaoHang"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <DatePicker
                    value={formData.ngayGiaoHang}
                    onChange={(date) => setFormData({ ...formData, ngayGiaoHang: date })}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>

          <OrderTable dataSource={productData} handleSave={handleSave} />
          <OrderSummary products={productData} />
          <OrderActions disabled={disabled} />
        </TabPane>
        <TabPane tab="Hóa đơn" key="2">
          <Form
            form={form}
            initialValues={{
              supplierAccountName: donmuahang?.supplier?.accountName,
              supplierAddress: donmuahang?.supplier?.address,
              purchasingOfficerName: donmuahang?.purchasingOfficer?.name,
              content: donmuahang?.content,
              ngayHoachToan: formData.ngayHoachToan,
              hanThanhToan: formData.hanThanhToan,
            }}
            className="mb-4"
            labelCol={{ flex: '150px' }}
            labelAlign="left"
            labelWrap
          >
            <div className="flex gap-24">
              <div className="w-1/2">
                <Form.Item
                  label="Tên khách hàng"
                  name="supplierAccountName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="supplierAddress"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Nhân viên mua hàng"
                  name="purchasingOfficerName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="content"
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </div>

              <div className="w-1/2">
                <Form.Item
                  label="Ngày hoạch toán"
                  name="ngayHoachToan"
                >
                  <DatePicker value={formData.ngayHoachToan} disabled />
                </Form.Item>

                <Form.Item
                  label="Hạn thanh toán"
                  name="hanThanhToan"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <DatePicker
                    value={formData.hanThanhToan}
                    onChange={(date) => setFormData({ ...formData, hanThanhToan: date })}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>

          <OrderTable dataSource={productData} handleSave={handleSave} />
          <OrderSummary products={productData} />
          <OrderActions disabled={disabled} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DonMuaHang;
