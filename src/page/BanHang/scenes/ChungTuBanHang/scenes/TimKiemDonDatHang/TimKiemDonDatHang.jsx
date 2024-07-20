import React from 'react'
import DonDatHang from '../../../DonDatHang/DonDatHang'

const TimKiemDonDatHang = () => {
  return (
    <div className='mt-4'>
      <h1 className="mx-[30px] font-bold text-[32px] mb-2">
        Lập chứng từ bán hàng theo đơn đặt hàng
      </h1>

      <DonDatHang radio={true} />
    </div>
  )
}

export default TimKiemDonDatHang