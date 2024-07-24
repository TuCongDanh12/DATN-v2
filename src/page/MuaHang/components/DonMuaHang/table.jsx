import React, { useEffect, useState } from 'react';
import { Table, message as msg, notification } from "antd";
import muahangService from './../../../../services/muahang.service';
import getColumns from './columns'; // Import từ file columns.js

const DonMuaHangTable = ({ navigate, setDataSelected, setOpen, paginationParam, setPaginationParam, searchParams }) => {
  const [listdonmuahang, setListdonmuahang] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [messageApi, contextHolderMes] = msg.useMessage();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchListDonMuahang();
  }, []); // Chỉ chạy một lần khi component mount

  useEffect(() => {
    filterData();
  }, [searchParams, listdonmuahang]); // Chạy lại khi searchParams hoặc listdonmuahang thay đổi

  const fetchListDonMuahang = async (retries = 3, delay = 1000) => {
    const requestParams = {
      currentPage: 1,
      pageSize: 1000, // Lấy toàn bộ dữ liệu để lọc cục bộ
      sorts: paginationParam.sorts || 'id%3AASC',
    };

    try {
      const response = await muahangService.getListDonMuahang({ requestParam: requestParams });
      if (Array.isArray(response.data.result.data)) {
        setListdonmuahang(response.data.result.data);
        setPaginationParam(prev => ({
          ...prev,
          total: response.data.result.totalCount || response.data.result.data.length, // assuming API returns total count of records
        }));
      } else {
        setListdonmuahang([]);
        setPaginationParam(prev => ({
          ...prev,
          total: 0,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 429 && retries > 0) {
        setTimeout(() => fetchListDonMuahang(retries - 1, delay), delay);
      } else {
        console.error("There was an error!", error);
      }
    }
  };

  const filterData = () => {
    const { keyword, dateRange } = searchParams;
    let filtered = listdonmuahang;

    if (keyword) {
      filtered = filtered.filter(item =>
        item.supplier.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(item => {
        const ngayMua = new Date(item.ngayMua);
        return ngayMua >= new Date(startDate) && ngayMua <= new Date(endDate);
      });
    }

    // Prioritize rows with "Chưa lập chứng từ"
    filtered.sort((a, b) => (a.documentStatus === 'UNDOCUMENTED' ? -1 : 1));

    setFilteredData(filtered);
  };

  const onChange = (pagination, filters, sorter) => {
    const newPagination = {
      ...paginationParam,
      current: pagination.current,
      pageSize: pagination.pageSize,
      sorts: sorter.field ? `${sorter.field}%3A${sorter.order === "descend" ? 'DESC' : 'ASC'}` : 'id%3AASC',
    };
    setPaginationParam(newPagination);
  };

  const rowClassName = (record) => {
    return record.documentStatus === 'UNDOCUMENTED' ? 'text-red-500 font-medium' : '';
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  return (
    <div>
      {contextHolderMes}
      {contextHolder}
      <Table
        rowKey={record => record.id} // Ensure each row has a unique key
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={getColumns(navigate, setDataSelected, setOpen)}
        dataSource={filteredData.slice(
          (paginationParam.current - 1) * paginationParam.pageSize,
          paginationParam.current * paginationParam.pageSize
        )}
        pagination={{
          current: paginationParam.current,
          pageSize: paginationParam.pageSize,
          total: filteredData.length,
          position: ['bottomRight'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
        rowClassName={rowClassName}
      />
    </div>
  );
};

export default DonMuaHangTable;
