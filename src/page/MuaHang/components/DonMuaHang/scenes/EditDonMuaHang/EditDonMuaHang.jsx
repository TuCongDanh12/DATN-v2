import React, { useEffect, useState } from "react";
import { Flex, Form, Input } from 'antd';
import muahangService from "./../../../../../../services/muahang.service";
import { useParams, useNavigate } from "react-router-dom";
import OrderTable from "./table";
import OrderSummary from "../../../../../../component/orderSumary";
import OrderActions from "../../../../../../component/actionButton";

const DonMuaHang = ({ disabled }) => {
  const [donmuahang, setDonmuahang] = useState(null); // Initialize as null to handle loading state
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  useEffect(() => {
    console.log(params.id);
    fetchDonMuahang(params.id);
  }, [id]); // Run effect when `id` changes

  const fetchDonMuahang = async (id) => {
    try {
      const response = await muahangService.getDonMuaHang({ id });
      console.log("Don mua hang:", response.data.result.data);
      setDonmuahang(response.data.result.data);
    } catch (error) {
      console.log("There was an error!", error);
    }
  };

  if (!donmuahang) return <div>Loading...</div>;

  const productOfDonBanHangs = [
    // Dummy data for demonstration
    { thanhtien: 12000, tiencktm: 0, tienthuegtgt: 960 },
    // Add more products as needed
  ];

  return (
    <div className="m-6">
      <h1 className="font-bold text-[32px] mb-8">
        Đơn mua hàng {donmuahang?.id}
      </h1>
      <Form
        initialValues={{
          supplierAccountName: donmuahang?.supplier?.accountName,
          supplierAddress: donmuahang?.supplier?.address,
          purchasingOfficerName: donmuahang?.purchasingOfficer?.name,
          content: donmuahang?.content,
          ngayMua: donmuahang?.ngayMua,
          hanGiaoHang: donmuahang?.hanGiaoHang,
        }}
        className="mb-4"
        labelCol={{ flex: '150px' }}
        labelAlign="left"
        labelWrap
      >
        <Flex gap={100} justify="center" className="w-[100%] align-left">
          <Flex vertical gap={5} className="w-[50%]">
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
              <Input disabled={disabled} />
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
              <Input disabled={disabled} />
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
              <Input disabled={disabled} />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
            >
              <Input disabled={disabled} />
            </Form.Item>
          </Flex>

          <Flex vertical gap={5} className="w-[50%]">
            <Form.Item
              label="Ngày mua"
              name="ngayMua"
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc!',
                },
              ]}
            >
              <Input disabled={disabled} />
            </Form.Item>

            <Form.Item
              label="Hạn giao hàng"
              name="hanGiaoHang"
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc!',
                },
              ]}
            >
              <Input disabled={disabled} />
            </Form.Item>
          </Flex>
        </Flex>

        <div className="flex justify-start">
          <div className="min-w-[300px] mb-8">
            {donmuahang?.ctban?.length !== 0 && (
              <div className="flex">
                <p>Tham chiếu đến chứng từ bán hàng:</p>
                <p>
                  {donmuahang?.ctban?.map((ct) => (
                    <span
                      key={ct.id}
                      className="px-2 text-[#1DA1F2] font-medium cursor-pointer"
                      onClick={() =>
                        navigate(`/ban-hang/chung-tu-ban-hang/xem/${ct.id}`, {
                          state: { id: ct.id },
                        })
                      }
                    >
                      {ct.id}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      </Form>
      <OrderTable data={productOfDonBanHangs} />
      <OrderSummary products={productOfDonBanHangs} />
      <OrderActions disabled={disabled} />
    </div>
  );
};

export default DonMuaHang;
