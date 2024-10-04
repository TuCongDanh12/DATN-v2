import React, { useState } from 'react';
import ChungTuMuaTable from './table';
import { DatePicker, Input } from 'antd';

const { RangePicker } = DatePicker;

const NoPhaiThu = () => {
  const [filter, setFilter] = useState('');
  const [dateRange, setDateRange] = useState([]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <div className='m-5 flex gap-4'>
        <RangePicker onChange={handleDateRangeChange} />
        <Input
          className='rounded-tr-none rounded-br-none max-w-[500px]'
          placeholder="Tìm kiếm tên khách hàng"
          onChange={handleFilterChange}
        />
      </div>
      <ChungTuMuaTable filter={filter} dateRange={dateRange} />
    </div>
  );
};

export default NoPhaiThu;
