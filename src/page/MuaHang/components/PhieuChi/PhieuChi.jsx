import React, { useState, useEffect } from 'react';
import { Button, Table, Input, DatePicker, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import muahangService from '../../../../services/muahang.service';
import columns from './columns';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const PhieuChi = () => {
  const [listPhieuThuTienMat, setListPhieuThuTienMat] = useState([]);
  const [listPhieuThuTienGui, setListPhieuThuTienGui] = useState([]);
  const [status, setStatus] = useState('tienmat');
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [valueRangepicker, setValueRangepicker] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'tienmat') {
      fetchTienMat();
    } else {
      fetchTienGui();
    }
  }, [status]);

  useEffect(() => {
    applyFilters();
  }, [listPhieuThuTienMat, listPhieuThuTienGui, searchText, valueRangepicker]);

  const fetchTienMat = async () => {
    try {
      const response = await muahangService.getListPhieuChiTienMat();
      const data = response.data.result.data;
      setListPhieuThuTienMat(data);
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  const fetchTienGui = async () => {
    try {
      const response = await muahangService.getListPhieuChiTienGui();
      const data = response.data.result.data;
      setListPhieuThuTienGui(data);
    } catch (error) {
      console.log('There was an error!', error);
    }
  };

  const applyFilters = () => {
    let dataSource = status === 'tienmat' ? listPhieuThuTienMat : listPhieuThuTienGui;

    // Filter by supplier name
    if (searchText) {
      dataSource = dataSource.filter((item) =>
        item.supplier?.accountName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by date range
    if (valueRangepicker.length === 2) {
      const [startDate, endDate] = valueRangepicker;
      dataSource = dataSource.filter((item) => {
        const itemDate = dayjs(item.createdAt);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
    }

    setFilteredData(dataSource);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleFilterday = (dates) => {
    setValueRangepicker(dates);
  };

  const handleDropdownItemClick = (e, record) => {
    // Handle dropdown click event
  };

  const items = [
    // Define your dropdown items here
  ];

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <Button
          type={status === 'tienmat' ? 'primary' : 'default'}
          onClick={() => setStatus('tienmat')}
        >
          Tiền mặt
        </Button>
        <Button
          type={status === 'tiengui' ? 'primary' : 'default'}
          onClick={() => setStatus('tiengui')}
        >
          Tiền gửi
        </Button>
      </div>
      <div className="flex mb-4">
        <RangePicker
          value={valueRangepicker}
          format='DD-MM-YYYY'
          onChange={(dates) => handleFilterday(dates)}
          className="!mr-[20px]"
        />
       
          <Input
            className="rounded-tr-none rounded-br-none max-w-[350px]"
            placeholder="Nhập tên nhà cung cấp"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />

      </div>
      <Table
        columns={columns(status, sortedInfo, filteredInfo, handleDropdownItemClick, items, navigate)}
        dataSource={filteredData}
        onChange={(pagination, filters, sorter) => {
          setSortedInfo(sorter);
          setFilteredInfo(filters);
        }}
        rowKey="id"
      />
    </div>
  );
};

export default PhieuChi;
