import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Flex,
  Table,
  Button,
  Select,
  DatePicker,
  Typography,
  message, // Import message
} from "antd";
import { VND } from "../../../../../../utils/func";
import { useNavigate, useParams } from "react-router-dom";
import useColumns from "./columns";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import muahangService from "../../../../../../services/muahang.service";
import doiTuongService from "../../../../../../services/doiTuong.service";
import { FaCommentsDollar } from "react-icons/fa";
dayjs.extend(customParseFormat);

const { Text } = Typography;

const ThemTraTien = ({ disabled = false }) => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [sortedInfo, setSortedInfo] = useState({});
  const [paymentValues, setPaymentValues] = useState({}); 
  const [listChungtumua, setListChungtumua] = useState([]);
  const [listpurchasing, getListpurchasing] = useState([]);
  const [listBankAccount, getListBankAccount] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handlePaymentChange = (id, value) => {
    setPaymentValues((prev) => ({ ...prev, [id]: value }));
  };

  const columns = useColumns(sortedInfo, handlePaymentChange);

  useEffect(() => {
    fetchListChungTuMua();
    fetchListPurchasing();
    fetchListBankAccount();
  }, []);

  useEffect(() => {
    if (listChungtumua.length > 0) {
      const supplier = listChungtumua[0]?.donMuaHang?.supplier;
      // console.log("Nhà cung cấp",supplier)

      form.setFieldsValue({
        nameCustomer: supplier?.accountName,
        address: supplier?.address,
        createdAt: dayjs(),
        receiveDate: dayjs(),
        bankName: supplier?.bankName,
        branch: supplier?.branch,
        accountName: supplier?.accountName,
        content: `Chi trả cho nhà cung cấp ${supplier?.accountName}`,
        accountNumber: supplier?.accountNumber,
        receiver:'Người nhận',
      });
    }
  }, [listChungtumua]);

  const fetchListPurchasing = async () => {
    try {
      const response = await doiTuongService.getListPurchasingOfficer();
      const data = response.data.result.data;
      getListpurchasing(data);
    } catch (error) {
      console.log("There was an error!", error);
    }
  };

  const fetchListBankAccount = async () => {
    try {
      const response = await doiTuongService.getListBankAccount();
      const data = response.data.result.data;
      getListBankAccount(data);
    } catch (error) {
      console.log("There was an error!", error);
    }
  };

  const fetchListChungTuMua = async () => {
    try {
      const response = await muahangService.getListChungTuMua();
      const data = response.data.result.data;
      const filteredData = data.filter(
        (item) =>
          item.donMuaHang?.supplier?.id == id &&
          (item.paymentStatus === "BEING_PAID" ||
            item.paymentStatus === "NOT_PAID") &&
          item.finalValue > 0
      );
      setListChungtumua(filteredData);
    } catch (error) {
      console.log("There was an error!", error);
    }
  };

  const onChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const calculateTotals = () => {
    let totalFinalValue = 0;
    let totalChuaChi = 0;
    let totalSoThanhToan = 0;

    listChungtumua.forEach(({ finalValue, paidValue, id }) => {
      const chuaChi = finalValue - paidValue;
      totalFinalValue += finalValue;
      totalChuaChi += chuaChi;
      totalSoThanhToan += paymentValues[id] || 0;
    });

    return { totalFinalValue, totalChuaChi, totalSoThanhToan };
  };

  const { totalFinalValue, totalChuaChi, totalSoThanhToan } = calculateTotals();

  const onFinish = async (values) => {
    setLoading(true);
    const supplierId = listChungtumua[0]?.donMuaHang?.supplier?.id;

    const paymentDate = values.receiveDate
      ? dayjs(values.receiveDate).format('YYYY-MM-DD')
      : null;

    const chungTu = listChungtumua.map((item) => ({
      money: paymentValues[item.id] || 0,
      content: "Nội dung",
      ctmuaId: item.id,
    }));

    const resultObject = {
      paymentDate,
      content: values.content,
      receiver: values?.receiver || 'Người nhận', // lấy giá trị receiver từ form
      supplierId,
      purchasingOfficerId: values.purchasingOfficerId,
      bankAccountId: values.bankAccountId, // Điều này sẽ chỉ cần thiết cho phương thức "TRANSFER"
      chungTu,
    };

    try {
        if (values.paymentMethod === "TRANSFER") {
            await muahangService.postPhieuChiTienGui(resultObject);
        } else if (values.paymentMethod === "CASH") {
            // console.log(resultObject)
            await muahangService.postPhieuChiTienMat(resultObject);
        }
        message.success("Tạo thành công"); // Hiển thị thông báo thành công
        navigate(-1); // Điều hướng sau khi thành công
    } catch (error) {
        console.log("There was an error!", error);
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="m-6">
      <h1 className="font-bold text-[32px] mb-4">
        Phiếu chi tiền{" "}
        {Form.useWatch("paymentMethod", form) === "CASH" ? "mặt" : "gửi"}
      </h1>
      <Form
        form={form}
        className="mb-4"
        labelCol={{ flex: "150px" }}
        labelAlign="left"
        labelWrap
        onFinish={onFinish}
      >
        <Flex gap={100} justify="center" className="w-[100%]">
          <Flex vertical gap={5} className="w-[50%]">
           
              <>
                <Form.Item
                  label="Tài khoản thanh toán"
                  name="bankAccountId"
                  rules={[
                    { required: true, message: "Trường này là bắt buộc!" },
                  ]}
                >
                  <Select disabled={disabled} placeholder="Chọn tài khoản thanh toán">
                    {listBankAccount.map((account) => (
                      <Select.Option
                        key={account.id}
                        value={account.id}
                      >{`${account.bankName} - ${account.accountName}`}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
          
            <Form.Item
              label="Nhà cung cấp"
              name="nameCustomer"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              label="Phương thức thanh toán"
              name="paymentMethod"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Select disabled={disabled}>
                <Select.Option value="CASH">Tiền mặt</Select.Option>
                <Select.Option value="TRANSFER">Tiền gửi</Select.Option>
              </Select>
            </Form.Item>
            {Form.useWatch("paymentMethod", form) === "TRANSFER" && (
              <>
                <Form.Item
                  label="Số tài khoản"
                  name="accountNumber"
                  rules={[
                    { required: true, message: "Trường này là bắt buộc!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Tên ngân hàng"
                  name="bankName"
                  rules={[
                    { required: true, message: "Trường này là bắt buộc!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </>
            )}
            {Form.useWatch("paymentMethod", form) === "CASH" && (
              <Form.Item
                label="Người nhận"
                name="receiver"
                rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
              >
                <Input disabled={disabled} placeholder="Nhập người nhận" />
              </Form.Item>
            )}
          </Flex>
          <Flex vertical gap={5} className="w-[50%]">
            {Form.useWatch("paymentMethod", form) === "TRANSFER" && (
              <>
                {/* <Form.Item
                  label="Chi nhánh"
                  name="branch"
                  rules={[
                    { required: true, message: "Trường này là bắt buộc!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item> */}
                <Form.Item
                  label="Chủ tài khoản"
                  name="accountName"
                  rules={[
                    { required: true, message: "Trường này là bắt buộc!" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </>
            )}
            <Form.Item
              label="Nhân viên thực hiện"
              name="purchasingOfficerId"
              rules={[
                { required: true, message: "Trường này là bắt buộc!" },
              ]}
            >
              <Select disabled={disabled} placeholder="Chọn nhân viên">
                {listpurchasing.map((officer) => (
                  <Select.Option key={officer.id} value={officer.id}>
                    {officer.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <Input disabled={disabled} />
            </Form.Item>
            <Form.Item
              label="Ngày hạch toán"
              name="createdAt"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <DatePicker className="!w-full" disabled={true} />
            </Form.Item>
            <Form.Item
              label="Ngày chi trả"
              name="receiveDate"
              rules={[{ required: true, message: "Trường này là bắt buộc!" }]}
            >
              <DatePicker className="!w-full" disabled={disabled} />
            </Form.Item>
          </Flex>
        </Flex>
        <div>
          <Table
            rowClassName={() => "editable-row"}
            bordered
            columns={columns}
            onChange={onChange}
            pagination={false}
            dataSource={listChungtumua}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={3} className="font-bold">
                  Tổng
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text className="font-bold">
                    {VND.format(totalFinalValue)}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text className="font-bold">{VND.format(totalChuaChi)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text className="font-bold">
                    {VND.format(totalSoThanhToan)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
        <div className="flex justify-end">
          <div className="w-[300px] my-8">
            {/* Có thể thêm phần tổng cộng tại đây nếu cần */}
          </div>
        </div>
        {disabled ? (
          <div className="w-full flex justify-end mt-6 mb-0">
            <Button
              className="!bg-[#FF7742] font-bold text-white"
              type="link"
              onClick={() => navigate(-1)}
            >
              Thoát
            </Button>
          </div>
        ) : (
          <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
            <Button
              className="!bg-[#FF7742] font-bold text-white mr-2"
              htmlType="reset"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button
              className="!bg-[#67CDBB] font-bold text-white"
              htmlType="submit"
              loading={loading} // Hiển thị spinner khi đang tải
            >
              Xác nhận
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default ThemTraTien;
