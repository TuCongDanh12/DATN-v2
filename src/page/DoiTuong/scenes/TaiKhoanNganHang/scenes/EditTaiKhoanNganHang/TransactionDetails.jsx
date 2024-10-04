// TransactionDetails.js
import React, { useEffect, useState } from "react";
import { Table, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import congNoService from "../../../../../../services/congNo.service";

const TransactionDetails = ({ bankAccountId }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (bankAccountId) {
      fetchTransactions(bankAccountId);
    }
  }, [bankAccountId]);

  const fetchTransactions = async (id) => {
    try {
      const response = await congNoService.getAllTransactionBank(id);
      console.log('Đối chiếu', response.data.result.data)
      setDataSource(response.data.result.data); // Adjust according to your response structure
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
      }));

      setDataSource(transactions);
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
      const excelEpoch = new Date(1899, 11, 30);
      const daysSinceEpoch = dateValue - 1;
      const date = new Date(excelEpoch.getTime() + daysSinceEpoch * 24 * 60 * 60 * 1000);
      return formatAsString(date);
    }

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      message.error(`Ngày không hợp lệ: ${dateValue}`);
      return null;
    }

    return formatAsString(date);
  };

  const formatAsString = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const postTransactions = async (transactions) => {
    const validTransactions = transactions.filter(tx => tx.date && tx.transactionNumber);
    if (validTransactions.length === 0) {
      message.error("Không có giao dịch hợp lệ để gửi.");
      return;
    }

    try {
      const values = { transactions: validTransactions };
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
        <span style={{ color: record.reconciled ? 'green' : 'red' }}>
          {record.reconciled ? 'Đã đối chiếu' : 'Chưa đối chiếu'}
        </span>
      ),
    },
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
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default TransactionDetails;
