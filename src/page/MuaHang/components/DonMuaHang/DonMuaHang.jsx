import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { DatePicker, Button, Modal, Form, Input, message as msg, notification } from "antd";
import { SiMicrosoftexcel } from 'react-icons/si';
import { TfiReload } from 'react-icons/tfi';
import { MdOutlineSearch } from 'react-icons/md';
import DonMuaHangTable from './table'; // Import từ file DonMuaHangTable.js
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const DonMuaHang = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [open, setOpen] = useState(false);
  const [importResults, setImportResults] = useState({ success: 0, fail: 0, failRecords: [] });
  const [dataSelected, setDataSelected] = useState({});
  
  const [paginationPram, setPaginationParam] = useState({
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
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const rows = data.slice(1).map((row, index) => ({ id: index + 1, ...row }));
      setExcelData(rows);
      validateExcelData(rows);
    };
    reader.readAsBinaryString(file);
  };

  const validateExcelData = async (data) => {
    let failRecords = [];
    let success = true;

    for (const [index, row] of data.entries()) {
      const formattedData = {
        ngayMua: formatExcelDate(row[0]), // Assuming 'Ngày mua' is in the first column
        hanGiaoHang: formatExcelDate(row[1]), // Assuming 'Hạn giao hàng' is in the second column
        content: row[2], // Assuming 'Nội dung' is in the third column
        deliveryStatus: mapDeliveryStatus(row[3]), // Assuming 'Trạng thái vận chuyển' is in the fourth column
        documentStatus: mapDocumentStatus(row[4]), // Assuming 'Trạng thái chứng từ' is in the fifth column
        purchasingOfficerId: row[5], // Assuming 'purchasingOfficerId' is in the sixth column
        supplierId: row[6] // Assuming 'supplierId' is in the seventh column
      };

      try {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/don-mua-hang/validate`, formattedData);
      } catch (error) {
        success = false;
        failRecords.push(index + 2); // Record positions are 1-based, add 2 for header row and 0-based index
        break; // Stop processing further records
      }
    }

    if (success) {
      processExcelData(data);
    } else {
      setImportResults({ success: 0, fail: failRecords.length, failRecords });
      setResultModalOpen(true);
    }
  };

  const processExcelData = async (data) => {
    let successCount = 0;
    let failCount = 0;
    let failRecords = [];

    for (const [index, row] of data.entries()) {
      const formattedData = {
        ngayMua: formatExcelDate(row[0]), // Assuming 'Ngày mua' is in the first column
        hanGiaoHang: formatExcelDate(row[1]), // Assuming 'Hạn giao hàng' is in the second column
        content: row[2], // Assuming 'Nội dung' is in the third column
        deliveryStatus: mapDeliveryStatus(row[3]), // Assuming 'Trạng thái vận chuyển' is in the fourth column
        documentStatus: mapDocumentStatus(row[4]), // Assuming 'Trạng thái chứng từ' is in the fifth column
        purchasingOfficerId: row[5], // Assuming 'purchasingOfficerId' is in the sixth column
        supplierId: row[6] // Assuming 'supplierId' is in the seventh column
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/don-mua-hang`, formattedData);
        if (response.status === 201) {
          successCount++;
        } else {
          failCount++;
          failRecords.push(index + 2); // Record positions are 1-based, add 2 for header row and 0-based index
        }
      } catch (error) {
        console.error('Error processing Excel data:', error);
        failCount++;
        failRecords.push(index + 2); // Record positions are 1-based, add 2 for header row and 0-based index
      }
    }

    setImportResults({ success: successCount, fail: failCount, failRecords });
    setResultModalOpen(true);
    handleReload();
  };

  const formatExcelDate = (excelDate) => {
    if (typeof excelDate === 'number') {
      const date = moment(new Date((excelDate - (25567 + 1)) * 86400 * 1000));
      return date.isValid() ? date.format('YYYY-MM-DD') : null;
    } else if (typeof excelDate === 'string') {
      const date = moment(excelDate, 'MM/DD/YYYY');
      return date.isValid() ? date.format('YYYY-MM-DD') : null;
    } else {
      return null;
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
        </div>
      </div>

      <DonMuaHangTable 
        navigate={navigate} 
        setDataSelected={setDataSelected} 
        setOpen={setOpen} 
        paginationPram={paginationPram} 
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
