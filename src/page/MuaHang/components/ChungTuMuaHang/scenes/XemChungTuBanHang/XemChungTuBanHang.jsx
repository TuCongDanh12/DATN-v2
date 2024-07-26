import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, DatePicker, Select } from 'antd';
import { useParams } from 'react-router-dom';
import muahangService from '../../../../../../services/muahang.service';
import OrderTable from './OrderTable';
import OrderSummary from './OrderSummary';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const XemChungTuMua = ({ disabled = true }) => {
  const [chungtumua, setChungtumua] = useState(null);
  const [form] = Form.useForm();
  const [productData, setProductData] = useState([]);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    fetchChungTuMua(id);
  }, [id]);

  const fetchChungTuMua = async (id) => {
    try {
      const response = await muahangService.getChungTuMua({ id });
      const data = response.data.result.data;
      console.log('Chứng từ mua hàng', data);
      console.log('San pham',data.productOfCtmua)
      setChungtumua(data);
      setProductData(
        data.productOfCtmua?.map(item => ({
          ...item,
          key: item.id,
          originalCount: item.count,
        })) || []
      );
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  if (!chungtumua) return <div>Loading...</div>;

  return (
    <div className="m-6">
      <h1 className="text-2xl font-bold">Xem chứng từ mua hàng {id}</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Phiếu Nhập" key="1">
          <Form
            form={form}
            initialValues={{
              supplierAccountName: chungtumua?.donMuaHang?.supplier?.accountName,
              supplierAddress: chungtumua?.donMuaHang?.supplier?.address,
              content: chungtumua?.content,
              warehouseKeeperId:chungtumua?.warehouseKeeper?.name,
              shipper:chungtumua?.shipper,
              ngayGiaoHang:moment(chungtumua?.deliveryDate),
              hanThanhToan:moment(chungtumua?.paymentTerm),
              ngayHoachToan:moment(chungtumua?.createdAt)
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

                {/* <Form.Item
                  label="Nhân viên mua hàng"
                  name="purchasingOfficerName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled value={chungtumua?.donMuahang?.purchasingOfficer?.name} />
                </Form.Item> */}

                <Form.Item
                  label="Nội dung"
                  name="content"
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Người quản kho"
                  name="warehouseKeeperId"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled value={chungtumua?.warehouseKeeper?.name} />
                </Form.Item>
              </div>

              <div className="w-1/2">
                <Form.Item
                  label="Ngày hoạch toán"
                  name="ngayHoachToan"
                >
                  <DatePicker
                    className="w-full"
                    value={moment(chungtumua.createdAt)}
                    disabled
                  />
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
                    className="w-full"
                    value={moment(chungtumua.deliveryDate)}
                    disabled
                  />
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
                    className="w-full"
                    value={moment(chungtumua.paymentTerm)}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  label="Shipper"
                  name="shipper"
                >
                  <Input disabled value={chungtumua.shipper} />
                </Form.Item>
              </div>
            </div>
          </Form>

          <OrderTable

            dataSource={chungtumua}
            handleSave={() => {}}
            editable={false} // Pass editable prop
          />
            <OrderSummary
            totalDiscountValue={chungtumua?.totalDiscountValue}
            totalProductValue={chungtumua?.totalProductValue}
            />
        </TabPane>
        <TabPane tab="Hóa đơn" key="2">
          <Form
            form={form}
            initialValues={{
              supplierAccountName: chungtumua?.donMuahang?.supplier?.accountName,
              supplierAddress: chungtumua?.donMuahang?.supplier?.address,
              content: chungtumua?.content,
              discount: chungtumua?.donMuaHang?.discount,
              discountRate: chungtumua?.donMuaHang?.discountRate,
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

                {/* <Form.Item
                  label="Nhân viên mua hàng"
                  name="purchasingOfficerName"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled value={chungtumua?.donMuahang?.purchasingOfficer?.name} />
                </Form.Item> */}

                <Form.Item
                  label="Nội dung"
                  name="content"
                >
                  <Input disabled />
                </Form.Item>
              </div>

              <div className="w-1/2">
                <Form.Item
                  label="Ngày hoạch toán"
                  name="ngayHoachToan"
                >
                  <DatePicker
                    className="w-full"
                    value={moment(chungtumua.createdAt)}
                    disabled
                  />
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
                    className="w-full"
                    value={moment(chungtumua.paymentTerm)}
                    disabled
                  />
                </Form.Item>
                
                <Form.Item
                  label="Triết khấu"
                  name="discountRate"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled  />
                </Form.Item>

                <Form.Item
                  label="Giảm giá"
                  name="discount"
                  rules={[
                    {
                      required: true,
                      message: 'Trường này là bắt buộc!',
                    },
                  ]}
                >
                  <Input disabled  />
                </Form.Item>
              </div>
            </div>
          </Form>

          <OrderTable
            discount={chungtumua.discount}
            discountRate={chungtumua.discountRate}
            dataSource={chungtumua}
            handleSave={() => {}}
            editable={false} // Pass editable prop
          />
          <OrderSummary
            totalDiscountValue={chungtumua?.totalDiscountValue}
            totalProductValue={chungtumua?.totalProductValue
            }

          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default XemChungTuMua;
