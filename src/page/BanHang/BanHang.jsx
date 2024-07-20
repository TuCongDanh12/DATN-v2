import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom';

const BanHang = () => {
    const titlez = "Bán hàng";
    const process = [
      // {
      //   url: 'quy-trinh',
      //   content: "Quy trình"
      // },
      {
        url: 'don-dat-hang',
        content: "Đơn đặt hàng"
      },
      {
        url: 'chung-tu-ban-hang',
        content: "Chứng từ bán hàng"
      },
      {
        url: 'hoa-don-ban-hang',
        content: "Hóa đơn bán hàng"
      },
      {
        url: 'thu-tien-theo-hoa-don',
        content: "Thu tiền theo hóa đơn"
      },
    ]
  return (
    <div>
      <Header title="Bán hàng" titlez={titlez} process={process} />
      <Outlet />
    </div>
  )
}

export default BanHang