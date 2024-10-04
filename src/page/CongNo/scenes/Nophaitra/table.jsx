import React, { useEffect, useState } from 'react';
import { Table, message as msg, notification, Button } from "antd";
import muahangService from './../../../../services/muahang.service';
import getColumns from './columns'; // Import từ file columns.js
import { useNavigate } from 'react-router-dom';
import { FaCommentsDollar } from 'react-icons/fa';


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
    
        const listchungtu = response.data.result.data.filter((item)=>{
            if (item.finalValue == item.paidValue) {
                return false;
            }
            return true
        })
        console.log('list', listchungtu)
        setListchungtumua(listchungtu);
        setFilteredData(listchungtu);
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

  
  return (
    <div className='mx-5'>
      {/* <Button
        type="primary"
        icon={<FileExcelOutlined />}
        onClick={exportToExcel}
        style={{ marginBottom: '16px' }}
      >
        Xuất file Excel
      </Button> */}
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
