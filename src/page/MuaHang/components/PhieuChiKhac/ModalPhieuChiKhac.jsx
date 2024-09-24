import { Flex, Input, Select, DatePicker, Button, InputNumber, message } from "antd";
import doiTuongService from "../../../../services/doiTuong.service";
import { useState, useEffect } from "react";
import moment from 'moment'; // Import moment để làm việc với DatePicker
import muahangService from "../../../../services/muahang.service";

// Các loại chi phí
const COST_TYPES = {
  SALARY_COSTS: 'Chi phí lương',
  BONUS_COSTS: 'Chi phí thưởng',
  TAX_EXPENSES: 'Chi phí thuế',
  RENT_EXPENSES: 'Chi phí thuê nhà',
  MARKETING_EXPENSES: 'Chi phí marketing',
  UTILITY_COSTS: 'Chi phí tiện ích',
  LOGISTICS_COSTS: 'Chi phí logistics',
  ADMINISTRATIVE_COSTS: 'Chi phí hành chính',
  TRAINING_COSTS: 'Chi phí đào tạo',
  LEGAL_COSTS: 'Chi phí pháp lý',
  INSURANCE_COSTS: 'Chi phí bảo hiểm',
  DEPRECIATION_COSTS: 'Chi phí khấu hao',
  FINANCIAL_COSTS: 'Chi phí tài chính',
  RAD_COSTS: 'Chi phí R&D',
  OTHER_COSTS: 'Chi phí khác',
};

const ModalPhieuChiKhac = ({ onSuccess }) => {
  const [listAccountant, setListAccountant] = useState([]);
  const [listBankAccount, setListBankAccount] = useState([]);
  const [paymentType, setPaymentType] = useState('Tiền mặt'); // Trạng thái cho loại thanh toán
  const [selectedAccountant, setSelectedAccountant] = useState(null); // Trạng thái cho người chi
  const [paymentDate, setPaymentDate] = useState(null); // Ngày thanh toán
  const [amount, setAmount] = useState(null); // Số tiền
  const [content, setContent] = useState(''); // Nội dung
  const [selectedType, setSelectedType] = useState(null); // Loại chi phí
  const [selectedBank, setSelectedBank] = useState(null); // Ngân hàng
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchListAccountant();
    fetchListBankAccount();
  }, []);

  const fetchListAccountant = async () => {
    try {
      const res = await doiTuongService.getListAccountant();
      const listAccountant = res.data.result.data;
      setListAccountant(listAccountant);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListBankAccount = async () => {
    try {
      const res = await doiTuongService.getListBankAccount();
      const listBankAccount = res.data.result.data;
      setListBankAccount(listBankAccount);
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý khi chọn loại thanh toán
  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
  };

  // Xử lý khi chọn người chi
  const handleAccountantChange = (value) => {
    setSelectedAccountant(value);
  };

  // Xử lý khi chọn ngày thanh toán
  const handleDateChange = (date) => {
    setPaymentDate(date);
  };

  // Xử lý khi nhập số tiền
  const handleAmountChange = (value) => {
    setAmount(value);
  };

  // Xử lý khi chọn loại chi phí
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  // Xử lý khi chọn ngân hàng
  const handleBankChange = (value) => {
    setSelectedBank(value);
  };

  // Hàm xử lý khi nhấn nút "Hoàn tất"
  const handleSubmit = async () => {
    if (isSubmitting) return; // Ngăn chặn việc submit nhiều lần

    setIsSubmitting(true); // Đặt cờ là đang xử lý
    const formData = {
      paymentDate: paymentDate ? moment(paymentDate).format('YYYY-MM-DD') : null,
      content, // Nội dung thanh toán
      money: amount, // Số tiền
      type: selectedType, // Loại chi phí
      accountantId: listAccountant.find(accountant => accountant.name === selectedAccountant)?.id, // ID người chi
      isTienMat: paymentType === 'Tiền mặt', // Kiểm tra nếu thanh toán bằng Tiền mặt
      bankAccountId: paymentType === 'Tiền gửi' ? selectedBank : null, // Chỉ gửi bankAccountId nếu là Tiền gửi
    };

    try {
      const res = await muahangService.postPhieuChiKhac(formData);
      if (res && res.status === 201) {
        message.success('Tạo phiếu chi thành công!');
        onSuccess(); // Gọi callback để đóng modal và cập nhật bảng
      } else {
        message.error('Tạo phiếu chi thất bại!');
      }
    } catch (error) {
      message.error('Tạo phiếu chi thất bại!');
      console.error('Lỗi khi gửi dữ liệu:', error);
    } finally {
      setIsSubmitting(false); // Đặt lại cờ sau khi xử lý xong
    }
  };


  return (
    <div>
      <Flex gap={30} className='!w-full'>
        <Flex vertical gap={20} style={{ flex: 1 }}>
          {/* Ngày thanh toán */}
          <DatePicker 
            placeholder="Ngày thanh toán" 
            onChange={handleDateChange} 
            style={{ width: '100%' }} 
          />

          <Input 
            placeholder="Nội dung" 
            value={content}
            onChange={(e) => setContent(e.target.value)} // Cập nhật nội dung
          />

          {/* Số tiền */}
          <InputNumber 
            placeholder="Số tiền" 
            style={{ width: '100%' }} 
            min={0} 
            onChange={handleAmountChange} 
            value={amount} 
          />
        </Flex>

        <Flex vertical gap={20} style={{ flex: 1 }}>
          <Select 
            placeholder="Loại chi phí" 
            style={{ width: '100%' }}
            value={selectedType}
            onChange={handleTypeChange} // Cập nhật loại chi phí
          >
            {Object.entries(COST_TYPES).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Người chi"
            value={selectedAccountant}
            onChange={handleAccountantChange}
            style={{ width: '100%' }}
          >
            {listAccountant.map((accountant) => (
              <Select.Option key={accountant.id} value={accountant.name}>
                {accountant.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            value={paymentType}
            onChange={handlePaymentTypeChange}
            placeholder="Hình thức thanh toán"
            style={{ width: '100%' }}
          >
            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
            <Select.Option value="Tiền gửi">Tiền gửi</Select.Option>
          </Select>

          {/* Chỉ hiển thị ngân hàng khi thanh toán bằng Tiền gửi */}
          {paymentType === "Tiền gửi" && (
            <Select 
              placeholder="Chọn ngân hàng" 
              style={{ width: '100%' }}
              value={selectedBank}
              onChange={handleBankChange} // Cập nhật ngân hàng
            >
              {listBankAccount.map((bank) => (
                <Select.Option key={bank.id} value={bank.id}>
                  {`${bank.bankName} - ${bank.accountName}`}
                </Select.Option>
              ))}
            </Select>
          )}
        </Flex>
      </Flex>

      {/* Nút Hoàn tất */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button type="primary" onClick={handleSubmit}>
          Hoàn tất
        </Button>
      </div>
    </div>
  );
};

export default ModalPhieuChiKhac;
