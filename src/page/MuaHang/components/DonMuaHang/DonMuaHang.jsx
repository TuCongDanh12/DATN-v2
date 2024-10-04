import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { DatePicker, Button, Modal, Form, Input, message as msg, notification } from "antd";
import { SiMicrosoftexcel } from 'react-icons/si';
import { TfiReload } from 'react-icons/tfi';
import { MdOutlineSearch } from 'react-icons/md';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import axios from 'axios';
import moment from 'moment';
import DonMuaHangTable from './table'; // Đảm bảo rằng bạn đã tạo và import thành phần này
import authService from '../../../../services/auth.service';
import authHeader from '../../../../services/auth-header';
const { RangePicker } = DatePicker;

const DonMuaHang = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [importResults, setImportResults] = useState({ success: 0, fail: 0, failRecords: [] });
  const [dataSelected, setDataSelected] = useState({});
  const [open, setOpen] = useState(false); // Thêm trạng thái này để quản lý việc mở/đóng modal
  
  const [paginationParam, setPaginationParam] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    sorts: 'id%3AASC',
  });
  const [searchParams, setSearchParams] = useState({
    dateRange: [],
    keyword: '',
  });

  const [messageApi, contextHolderMes] = msg.useMessage();
  const [api, contextHolder] = notification.useNotification();

  const DownloadFile = async () => {
    try {
      const res = await authService.downloadFile(); // Không cần truyền responseType ở đây vì nó đã được thêm ở hàm trên
  
      // Kiểm tra xem phản hồi có phải là blob không
      console.log(res);
  
      // Tạo Blob từ dữ liệu phản hồi
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type cho file Excel
      });
  
      // Tạo URL tạm thời từ Blob
      const downloadUrl = window.URL.createObjectURL(blob);
  
      // Tạo thẻ a để tải xuống file
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'file.xlsx'); // Đặt tên cho file
      document.body.appendChild(link);
      link.click();
  
      // Dọn dẹp URL tạm thời sau khi tải xong
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      // Xử lý lỗi
      console.error('Error downloading the file', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      keyword: value,
    }));
    setPaginationParam(prev => ({
      ...prev,
      current: 1,
    }));
  };

  const debouncedSearchChange = useCallback(debounce(handleSearchChange, 300), []);

  const handleReload = () => {
    setPaginationParam(prev => ({
      ...prev,
      current: 1,
    }));
    messageApi.open({
      key: 'updatable',
      type: 'loading',
      content: 'Loading...',
    });
    form.resetFields();
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setSearchParams(prev => ({
      ...prev,
      dateRange: dateStrings,
    }));
    setPaginationParam(prev => ({
      ...prev,
      current: 1,
    }));
  };

  const readUploadFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
      // Kiểm tra tên các sheet
      console.log('Sheet Names:', workbook.SheetNames);
  
      const sheetTongQuan = workbook.Sheets['tổng quan'];
      const sheetSanpham = workbook.Sheets['sản phẩm'];
  
      // Kiểm tra nếu sheet tồn tại
      if (!sheetTongQuan || !sheetSanpham) {
        console.error('Tên sheet không chính xác hoặc sheet không tồn tại.');
        return;
      }
  
      const dataTongQuan = XLSX.utils.sheet_to_json(sheetTongQuan, { header: 1 });
      const dataKhachHang = XLSX.utils.sheet_to_json(sheetSanpham, { header: 1 });
  
      console.log('Sheet Tổng quan:', dataTongQuan);
      console.log('Sheet sản phẩm:', dataKhachHang);
  
      // Kiểm tra nếu dữ liệu bị rỗng
      if (dataTongQuan.length === 0 || dataKhachHang.length === 0) {
        console.error('Dữ liệu sheet bị rỗng.');
        return;
      }
  
      // Hàm xử lý định dạng ngày
      const parseExcelDate = (excelDate) => {
        if (typeof excelDate === 'number') {
          const date = moment(new Date((excelDate - (25567 + 1)) * 86400 * 1000));
          return date.isValid() ? date.format('YYYY-MM-DD') : null;
        } else if (typeof excelDate === 'string') {
          const date = moment(excelDate, ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']);
          return date.isValid() ? date.format('YYYY-MM-DD') : null;
        } else {
          return null;
        }
      };
  
      // Lấy dữ liệu từ sheet tổng quan
      const parsedDataTongQuan = {
        purchasingDate: parseExcelDate(dataTongQuan[1][1]),
        deliveryStatus: mapDeliveryStatus(dataTongQuan[1][2]),
        documentStatus: mapDocumentStatus(dataTongQuan[1][3]),
        paymentStatus: mapPaymentStatus(dataTongQuan[1][4]),
        deliveryTerm:parseExcelDate(dataTongQuan[1][0]),
        content: dataTongQuan[1][5],
        purchasingOfficerId: Number(dataTongQuan[1][6]),
        supplierId: Number(dataTongQuan[1][7]),
      };
  
      // Lấy dữ liệu từ sheet khách hàng
      const discount = dataKhachHang[0][1]; // Giảm giá
      const discountRate = dataKhachHang[1][1]; // Chiết khấu(%)
      const products = dataKhachHang.slice(5)
      .filter(row => row[0] !== null && row[0] !== undefined) // Filter out rows where productId is null or undefined
      .map(row => ({
        productId: Number(row[0]),
        count: Number(row[2]),
        price: Number(row[3]),
      }));
  
      // Kiểm tra dữ liệu sản phẩm
      console.log('Parsed Products:', products);
  
      const combinedData = {
        ...parsedDataTongQuan,
        discount: discount || 0,
        discountRate: (discountRate) || 0,
        products: products,
      };
  
      console.log('Combined Data', combinedData);
  
      processExcelData(combinedData);
    };
    reader.readAsBinaryString(file);
  };

  const processExcelData = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/don-mua-hang`, data, {headers:authHeader()});
      if (response.status === 201) {
        messageApi.success("Đăng đơn mua hàng thành công!");
        window.location.reload()
      }
    } catch (error) {
      messageApi.error("Đăng đơn mua hàng thất bại!");
      console.error('Error processing Excel data:', error);
    }
  };

  const mapDeliveryStatus = (status) => {
    switch (status) {
      case 'Chưa giao':
        return 'NOT_DELIVERED';
      case 'Đang giao':
        return 'DELIVERING';
      case 'Đã giao':
        return 'DELIVERED';
      default:
        return 'NOT_DELIVERED';
    }
  };

  const mapDocumentStatus = (status) => {
    switch (status) {
      case 'Chưa lập':
        return 'UNDOCUMENTED';
      case 'Đang lập':
        return 'DOCUMENTING';
      case 'Đã lập':
        return 'DOCUMENTED';
      default:
        return 'UNDOCUMENTED';
    }
  };

  const mapPaymentStatus = (status) => {
    switch (status) {
      case 'Chưa thanh toán':
        return 'NOT_PAID';
      case 'Đã thanh toán':
        return 'PAID';
      default:
        return 'NOT_PAID';
    }
  };

  return (
    <div className='m-4'>
      <div className='px-[20px] w-full flex justify-between py-7 bg-white'>
        <div className='flex gap-[5px] items-center'>
          <RangePicker onChange={handleDateRangeChange} />
          <Form form={form} layout='inline'>
            <Form.Item name='keyword' className='w-[300px] !me-0'>
              <Input className='rounded-tr-none rounded-br-none' placeholder="Tìm kiếm tên khách hàng" onChange={debouncedSearchChange} />
            </Form.Item>
            <Button className='!bg-[#FAFAFA] font-bold m-0 p-0 w-[32px] h-[32px] flex justify-center items-center rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md' htmlType="submit">
              <MdOutlineSearch size={20} color='#898989' />
            </Button>
          </Form>
          {contextHolderMes}
          {contextHolder}
          <label htmlFor="upload-photo">
            <SiMicrosoftexcel
              title="Nhập file excel"
              size={30}
              className="p-2 bg-white border border-black cursor-pointer"
            />
          </label>
          <input
            type="file"
            id="upload-photo"
            style={{ display: 'none' }}
            accept=".xlsx, .xls"
            onChange={readUploadFile}
          />
          <TfiReload title="Cập nhật dữ liệu" size={30} className='p-2 bg-white border border-black cursor-pointer' onClick={handleReload} />
          <Button onClick={DownloadFile}>Tải về file mẫu</Button>
        </div>
      </div>

      <DonMuaHangTable 
        navigate={navigate} 
        setDataSelected={setDataSelected} 
        setOpen={setOpen} 
        paginationParam={paginationParam} 
        setPaginationParam={setPaginationParam}
        searchParams={searchParams}
      />

      <Modal
        title="Import thất bại"
        centered
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setResultModalOpen(false)}>
            OK
          </Button>
        ]}
      >
        {importResults.fail > 0 && (
          <p>Vui lòng kiểm tra lại hàng thứ: {Number(importResults.failRecords.join(', '))+1}</p>
        )}
      </Modal>
    </div>
  );
};

export default DonMuaHang;
