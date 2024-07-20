import React from 'react'
import FormPhieunhap from '../../Form/Muahang/phieunhap'
import Tablehoadon from '../../Table/table-hoadon'

function Donmuahang() {
  return (
    <>
    <h1 className="mx-[30px] font-bold text-[32px] mb-2">
        Đơn mua hàng ĐMH00001
      </h1>
    <FormPhieunhap/>
    <Tablehoadon/>
    </>
  )
}

export default Donmuahang