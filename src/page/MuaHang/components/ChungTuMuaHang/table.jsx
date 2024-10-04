import React, { useEffect, useState } from 'react';
import { Table, message as msg, notification, Button } from "antd";
import muahangService from './../../../../services/muahang.service';
import getColumns from './columns'; // Import từ file columns.js
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';

const ChungTuMuaTable = ({ filter, dateRange, setDataSelected }) => {
  const navigate = useNavigate();
  const [listchungtumua, setListchungtumua] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginationParam, setPaginationParam] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchListChungtumua();
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    filterData();
  }, [filter, dateRange, listchungtumua]);

  const fetchListChungtumua = async (retries = 3, delay = 1000) => {
    try {
      const response = await muahangService.getListChungTuMua();
      if (Array.isArray(response.data.result.data)) {
        setListchungtumua(response.data.result.data);
        setFilteredData(response.data.result.data);
      }
      console.log('ListChungtuMua', response.data.result.data);
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        setTimeout(() => fetchListChungtumua(retries - 1, delay), delay);
      } else {
        console.error("There was an error!", error);
      }
    }
  };

  const filterData = () => {
    let data = listchungtumua;

    if (filter) {
      data = data.filter(item => 
        item.donMuaHang.supplier.accountName.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      data = data.filter(item => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      });
    }

    setFilteredData(data);
  };

  const rowClassName = (record) => {
    return record.documentStatus === 'UNDOCUMENTED' ? 'text-red-500 font-medium' : '';
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDataSelected(selectedRows);
    },
  };

  const handleTableChange = (pagination) => {
    setPaginationParam({
      ...paginationParam,
      current: pagination.current,
    });
  };

  const exportToExcel = () => {
    // Chuyển đổi dữ liệu từ filteredData sang dạng làm phẳng
    const dataToExport = filteredData.flatMap(item => 
      item.productOfCtmua.map(product => ({
        
        'Ngày hoạch toán': item.createdAt.split('T')[0],
        'Ngày chứng từ': item.donMuaHang.createdAt.split('T')[0], // Sử dụng ngày chứng từ từ đối tượng donMuaHang
        'Số phiếu nhập': item.id,
        'Mã nhà cung cấp': item.donMuaHang.supplier.id,
        'Tên nhà cung cấp': item.donMuaHang.supplier.name,
        'Địa chỉ': item.donMuaHang.supplier.address,
        'Người giao hàng': item.shipper,
        'Diễn giải': item.content,
        'Hạn thanh toán': item.paymentTerm,
        'Mã kho': 1,
        'Số đơn mua hàng': item.donMuaHang.id,
        'Mã hàng': product.product.id,
        'Tên hàng': product.product.name,
        'ĐVT': product.product.unit,
        'Số lượng': product.count,
        'Đơn giá': product.price,
        'Thành tiền': product.price * product.count,
        'Tỷ lệ CK (%)': item.donMuaHang.discountRate,
        'Tiền chiết khấu': (product.price * product.count * item.donMuaHang.discountRate) / 100,
        '% thuế GTGT': 0,
        'Tiền thuế GTGT': 0,
        'Số hóa đơn': item.donMuaHang.id,
        'Số chứng từ ghi nợ/Số chứng từ thanh toán': item.id,
        'Hình thức mua hàng': 'Mua hàng trong nước nhập kho',
        'Phương thức thanh toán':'Chưa thanh toán'
      }))
    );
  
    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chứng từ mua");
  
    // Xuất file
    XLSX.writeFile(wb, 'ChungTuMua.xlsx');
  };
  
  return (
    <div className='mx-5'>
      <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={exportToExcel}
        style={{ marginBottom: '16px' }}
      >
        Xuất file Excel
      </Button>
      <Table
        rowKey={record => record.id} // Ensure each row has a unique key
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={getColumns(navigate)}
        dataSource={filteredData}
        pagination={{
          current: paginationParam.current,
          pageSize: 10,
          total: filteredData.length,
          position: ['bottomRight'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        rowClassName={rowClassName}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ChungTuMuaTable;
