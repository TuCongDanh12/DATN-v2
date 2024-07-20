import React from 'react'
import DonDatHang from '../../../DonDatHang/DonDatHang'
import HoaDonBanHang from './../../../HoaDonBanHang/HoaDonBanHang';

const TimKiemHoaDonBanHang = () => {
  return (
    <div className='mt-4'>
      <h1 className="mx-[30px] font-bold text-[32px] mb-2">
        Thu tiền theo hóa đơn
      </h1>

      <HoaDonBanHang checkbox={true} />
    </div>
  )
}

export default TimKiemHoaDonBanHang