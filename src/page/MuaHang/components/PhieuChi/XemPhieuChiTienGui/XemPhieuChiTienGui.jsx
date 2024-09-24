import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Button, Select, Table, Typography } from "antd";
import muahangService from "../../../../../services/muahang.service";
import dayjs from "dayjs";
import { VND } from "../../../../../utils/func";

const { Text } = Typography;

const XemPhieuChiTienGui = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const [phieuchi, setPhieuchi] = useState(null);
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true); // Set fields to be disabled by default

  useEffect(() => {
    fetchPhieuChi();
  }, []);

  const fetchPhieuChi = async () => {
    try {
      const response = await muahangService.getPhieuChiTienGui(id);
      const data = response.data.result.data;
      setPhieuchi(data);
      console.log('phieuchi', data);
      form.setFieldsValue({
        bankAccountId: data.bankAccount?.id || '',
        nameCustomer: data.supplier?.name || '',
        address: data.supplier?.address || '',
        accountNumber: data.supplier?.accountNumber || '',
        bankName: data.supplier?.bankName || '',
        branch: data.supplier?.branch || '',
        accountName: data.supplier?.accountName || '',
        receiver: data.receiver || '',
        purchasingOfficerId: data.purchasingOfficer?.id || '',
        content: data.content || '',
        createdAt: dayjs(data.createdAt),
        receiveDate: dayjs(data.paymentDate),
      });
    } catch (error) {
      console.log("There was an error fetching data!", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Số tiền",
      dataIndex: "money",
      key: "money",
      render: (money) => VND.format(money),
    },
  ];

  const listChungtumua = phieuchi?.chungTu || [];
  const totalFinalValue = listChungtumua.reduce((acc, item) => acc + item.money, 0);

  return (
    <div className="m-6">
      <h1 className="font-bold text-[32px] mb-4">Phiếu chi tiền gửi {id}</h1>
      <Form
        form={form}
        className="mb-4"
        labelCol={{ flex: "150px" }}
        labelAlign="left"
        labelWrap
        disabled={disabled} // Apply disabled state globally
      >
        <div className="flex justify-center gap-[100px]">
          <div className="w-[50%]">
            <Form.Item
              label="Tài khoản thanh toán"
              name="bankAccountId"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Select disabled placeholder="Chọn tài khoản thanh toán">
                {phieuchi?.bankAccount && (
                  <Select.Option key={phieuchi.bankAccount.id} value={phieuchi.bankAccount.id}>
                    {`${phieuchi.bankAccount.bankName} - ${phieuchi.bankAccount.accountName}`}
                  </Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="Nhà cung cấp"
              name="nameCustomer"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Số tài khoản"
              name="accountNumber"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Tên ngân hàng"
              name="bankName"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>
          </div>
          <div className="w-[50%]">
            <Form.Item
              label="Chi nhánh"
              name="branch"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Chủ tài khoản"
              name="accountName"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Nhân viên thực hiện"
              name="purchasingOfficerId"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Select disabled placeholder="Chọn nhân viên">
                {phieuchi?.purchasingOfficer && (
                  <Select.Option key={phieuchi.purchasingOfficer.id} value={phieuchi.purchasingOfficer.id}>
                    {phieuchi.purchasingOfficer.name}
                  </Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Ngày hạch toán"
              name="createdAt"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <DatePicker className="!w-full" disabled format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label="Ngày chi trả"
              name="receiveDate"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <DatePicker className="!w-full" disabled format="DD-MM-YYYY" />
            </Form.Item>
          </div>
        </div>

        <div>
          <Table
            rowClassName={() => "editable-row"}
            bordered
            columns={columns}
            pagination={false}
            dataSource={listChungtumua}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={1} className="font-bold">
                  Tổng
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text className="font-bold">
                    {VND.format(totalFinalValue)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>

       
      </Form>
      <div className="w-full flex justify-end mt-6 mb-0">
          <Button
            className="!bg-[#FF7742] font-bold text-white"
            type="link"
            onClick={() => navigate(-1)}
          >
            Thoát
          </Button>
        </div>
    </div>
  );
};

export default XemPhieuChiTienGui;
