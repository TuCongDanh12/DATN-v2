// TransactionDetails.js
import React, { useEffect, useState } from "react";
import { Table, Button, Upload, message, DatePicker, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom';
import congNoService from "../../../../../../services/congNo.service";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionDetails = ({ bankAccountId }) => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (bankAccountId) {
      fetchTransactions(bankAccountId);
    }
  }, [bankAccountId]);

  const fetchTransactions = async (id) => {
    try {
      const response = await congNoService.getAllTransactionBank(id);
      setDataSource(response.data.result.data);
      setFilteredData(response.data.result.data); // Cập nhật filteredData cùng với dataSource
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi lấy dữ liệu giao dịch.");
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const ab = e.target.result;
      const wb = XLSX.read(ab, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const transactions = data.slice(1).map((row) => ({
        date: formatDate(row[0]),
        transactionNumber: String(row[1] || ''),
        recipient: String(row[2] || ''),
        counterPartyAccount: String(row[3] || ''),
        counterPartyBank: String(row[4] || ''),
        debit: Number(row[5]) || 0,
        credit: Number(row[6]) || 0,
        description: String(row[7] || ''),
        bankAccountId: Number(row[8]) || null,
        // reconciled: Boolean(row[9]), // Giả định rằng trạng thái đã đối chiếu nằm ở cột 10
      }));

      setDataSource(transactions);
      setFilteredData(transactions); // Cập nhật filteredData
      postTransactions(transactions);
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevent the Upload component from auto-processing the file
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return null;
    }
  
    if (typeof dateValue === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const daysSinceEpoch = dateValue; 
      const date = new Date(excelEpoch.getTime() + (daysSinceEpoch - 2) * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000); 
      return formatAsString(date); // Trả về định dạng yyyy-mm-dd
    }
  
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.error(`Ngày không hợp lệ: ${dateValue}`);
      return null;
    }
  
    return formatAsString(date); // Trả về định dạng yyyy-mm-dd
  };
  
  

  const formatAsString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Định dạng yyyy-mm-dd
  };
  
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterData(dates, statusFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterData(dateRange, value);
  };

  const filterData = (dates, status) => {
    let filtered = [...dataSource];
  
    if (dates && dates.length === 2) {
      const [start, end] = dates.map(date => date.format('YYYY-MM-DD')); // Đảm bảo định dạng ngày đúng
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate >= new Date(start) && itemDate <= new Date(end);
      });
    }
  
    if (status) {
      filtered = filtered.filter(item => (status === 'reconciled' ? item.reconciled : !item.reconciled));
    }
  
    setFilteredData(filtered);
  };
  

  const postTransactions = async (transactions) => {
    const validTransactions = transactions.filter(tx => tx.date && tx.transactionNumber);
    if (validTransactions.length === 0) {
      message.error("Không có giao dịch hợp lệ để gửi.");
      return;
    }

    try {
      const values = { transactions: validTransactions };
      console.log('values', values);
      await congNoService.postTransaction(values);
      message.success("Dữ liệu đã được gửi thành công!");
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionNumber',
      key: 'transactionNumber',
    },
    {
      title: 'Người nhận',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Tài khoản đối tác',
      dataIndex: 'counterPartyAccount',
      key: 'counterPartyAccount',
    },
    {
      title: 'Ngân hàng đối tác',
      dataIndex: 'counterPartyBank',
      key: 'counterPartyBank',
    },
    {
      title: 'Giao dịch chi',
      dataIndex: 'debit',
      key: 'debit',
    },
    {
      title: 'Giao dịch thu',
      dataIndex: 'credit',
      key: 'credit',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <span>
          <span style={{ color: record.reconciled ? 'green' : 'red' }}>
            {record.reconciled ? 'Đã đối chiếu' : 'Chưa đối chiếu'}
          </span>
          {record.reconciled && (
            <>
              {record.phieuChi ? (
                <Link to={`/mua-hang/phieu-chi/tiengui/${record.phieuChi.id}`} style={{ marginLeft: '8px' }}>
                  <Button type="link" className="!bg-[#ffff]">Xem</Button>
                </Link>
              ) : (
                record.phieuChiKhac && (
                  <Link to={`/mua-hang/phieu-chi-khac`} style={{ marginLeft: '8px' }}>
                    <Button type="link" className="!bg-[#ffff]">Xem</Button>
                  </Link>
                )
              )}
            </>
          )}
        </span>
      ),
    }
  ];

  return (
    <div>
      <Upload 
        accept=".xlsx, .xls"
        beforeUpload={handleFileUpload}
        showUploadList={false}
      >
        <Button className='my-5' icon={<UploadOutlined />}>Tải lên file Excel</Button>
      </Upload>

      <RangePicker onChange={handleDateRangeChange} style={{ marginBottom: 16 }} />
      <Select 
        placeholder="Lọc theo trạng thái"
        onChange={handleStatusChange}
        style={{ marginBottom: 16, width: 200 }}
      >
        <Option value={null}>Tất cả</Option>
        <Option value="reconciled">Đã đối chiếu</Option>
        <Option value="notReconciled">Chưa đối chiếu</Option>
      </Select>

      <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default TransactionDetails;
