// EditTaiKhoanNganHang.js
import React, { useEffect } from "react";
import { Form, Input, Button, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doiTuongSelector, getBankAccount, updateBankAccount } from "../../../../../../store/features/doiTuongSilce";
import TransactionDetails from './TransactionDetails';

const { TabPane } = Tabs;

const EditTaiKhoanNganHang = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { bankAccountData } = useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getBankAccount({ id: params.id }));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (bankAccountData) {
      form.setFieldsValue({ ...bankAccountData });
    }
  }, [bankAccountData, form]);

  const onFinish = (values) => {
    const dataConvert = { ...values, id: bankAccountData.id };
    dispatch(updateBankAccount({ values: dataConvert }));
    navigate(-1);
  };

  return (
    <div className="m-6">
      <h1 className="font-bold text-[32px] mb-8">
        Tài khoản ngân hàng {bankAccountData.name}
      </h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin ngân hàng" key="1">
          <Form
            form={form}
            className="mb-4"
            labelCol={{ flex: "150px" }}
            labelAlign="left"
            labelWrap
            onFinish={onFinish}
          >
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%' }}>
              <div style={{ width: '50%' }}>
                <Form.Item
                  label="Số tài khoản"
                  name="accountNumber"
                  rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
                <Form.Item
                  label="Tên ngân hàng"
                  name="bankName"
                  rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
                <Form.Item
                  label="Chi nhánh"
                  name="branch"
                  rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </div>
              <div style={{ width: '50%' }}>
                <Form.Item
                  label="Chủ tài khoản"
                  name="accountName"
                  rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                  <Input disabled={disabled} />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
              <Button
                className='!bg-[#FF7742] font-bold text-white'
                type='link'
                onClick={() => navigate(-1)}
              >
                Thoát
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Chi tiết các giao dịch" key="2">
          <TransactionDetails bankAccountId={bankAccountData.id} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EditTaiKhoanNganHang;
