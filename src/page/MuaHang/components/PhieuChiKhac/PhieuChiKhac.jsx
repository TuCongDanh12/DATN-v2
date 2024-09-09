import { useState, useEffect } from "react";
import { Table, Button, Select, DatePicker, Space, Modal, message } from "antd";
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import ModalPhieuChiKhac from './ModalPhieuChiKhac'; // Import ModalPhieuChiKhac component
import muahangService from "../../../../services/muahang.service";

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const PhieuChiKhac = () => {
    const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const [listPhieuChiKhac, setListPhieuChiKhac] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDateRange, setSearchDateRange] = useState(null); // Đặt null để placeholder hiển thị
  const [searchType, setSearchType] = useState(undefined); // Đặt undefined để placeholder hiển thị
  const [searchIsTienMat, setSearchIsTienMat] = useState(undefined); // Đặt undefined để placeholder hiển thị
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái mở modal

  useEffect(() => {
    getListPhieuChiKhac();
  }, []);

  const getListPhieuChiKhac = async () => {
    try {
      const res = await muahangService.getListPhieuChiKhac();
      const listPhieuChiKhac = res?.data?.result?.data || [];
      setListPhieuChiKhac(listPhieuChiKhac);
      setFilteredData(listPhieuChiKhac); // Initialize filtered data with all data
    } catch (error) {
      console.error(error);
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1, // Số thứ tự
    },
    {
      title: "Ngày chi trả",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Loại chi trả",
      dataIndex: "type",
      key: "type",
      render: (type) => COST_TYPES[type] || "Chi phí khác", // Lấy nhãn từ COST_TYPES, nếu không có thì hiển thị 'Chi phí khác'
    },
    {
      title: "Loại tiền",
      dataIndex: "isTienMat",
      key: "isTienMat",
      render: (isTienMat) => (isTienMat ? "Tiền Mặt" : "Tiền Gửi"), // Hiển thị loại tiền dựa vào isTienMat
    },
    {
        title:"Số tiền",
        dataIndex:'money',
        key: "money",
        render:(money)=> VND.format(money)
    },
    {
      title: "Người Chi",
      dataIndex: ["accountant", "name"], // Lấy tên từ accountant.name
      key: "accountantName",
    },
    {
        title: "Ngân hàng",
        dataIndex: "bankAccount",
        key: "bankAccount",
        render: (bankAccount) =>
          bankAccount ? `${bankAccount.bankName} - ${bankAccount.accountName}` : "", // Hiển thị thông tin ngân hàng nếu có
    },
  ];

  // Function to handle filter changes
  const handleFilter = () => {
    let filtered = listPhieuChiKhac;

    // Lọc theo khoảng ngày, kiểm tra searchDateRange không null và có độ dài
    if (searchDateRange && searchDateRange.length === 2) {
      const [startDate, endDate] = searchDateRange;
      filtered = filtered.filter(item => {
        const paymentDate = moment(item.paymentDate, "YYYY-MM-DD");
        return paymentDate.isBetween(startDate, endDate, undefined, '[]');
      });
    }

    // Lọc theo loại chi trả
    if (searchType && searchType !== "ALL") {
      filtered = filtered.filter(item => item.type === searchType);
    }

    // Lọc theo loại tiền
    if (searchIsTienMat && searchIsTienMat !== "ALL") {
      filtered = filtered.filter(item => item.isTienMat.toString() === searchIsTienMat);
    }

    setFilteredData(filtered);
  };

  // Hàm mở và đóng modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý sau khi gửi phiếu chi thành công
  const handleSuccessSubmit = () => {
    message.success('Tạo phiếu chi thành công!');
    setIsModalVisible(false); // Đóng modal
    getListPhieuChiKhac(); // Cập nhật lại danh sách sau khi thêm mới
  };

  return (
    <div className='mt-5'>
      {/* Phần lọc ở trên bảng */}
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} // Placeholder tùy chỉnh
          value={searchDateRange} // Kiểm soát giá trị
          onChange={(dates) => setSearchDateRange(dates)} // Cập nhật ngày
          style={{ marginRight: 8 }}
        />
        <Select
          placeholder="Chọn loại chi trả"
          value={searchType} // Kiểm soát giá trị
          onChange={value => setSearchType(value)}
          style={{ width: 200 }}
        >
          <Option value="ALL">Tất cả</Option>
          {Object.keys(COST_TYPES).map(key => (
            <Option key={key} value={key}>
              {COST_TYPES[key]}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Chọn loại tiền"
          value={searchIsTienMat} // Kiểm soát giá trị
          onChange={value => setSearchIsTienMat(value)}
          style={{ width: 150 }}
        >
          <Option value="ALL">Tất cả</Option>
          <Option value="true">Tiền Mặt</Option>
          <Option value="false">Tiền Gửi</Option>
        </Select>
        <Button
          type="primary"
          onClick={handleFilter}
          icon={<SearchOutlined />}
        >
          Lọc
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal} // Mở modal khi nhấn nút
        >
          Thêm
        </Button>
      </Space>

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredData} // Dữ liệu đã được lọc
        columns={columns} // Cấu hình cột
        rowKey="id" // Khóa duy nhất của mỗi hàng
        pagination={{ pageSize: 10 }} // Phân trang, mỗi trang 10 hàng
      />

      {/* Modal hiển thị khi nhấn nút Thêm */}
      <Modal
        title="Thêm phiếu chi khác"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không hiển thị nút mặc định trong modal
        className='!w-[700px] !h-[500px]'
      >
        <ModalPhieuChiKhac onSuccess={handleSuccessSubmit} />
      </Modal>
    </div>
  );
};

export default PhieuChiKhac;
