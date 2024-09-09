import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom'

const MuaHang = () => {
  const titlez = "Mua hàng";
  const process = [
    
    {
      url: 'don-mua-hang',
      content: "Đơn mua hàng"
    },
    {
      url: 'chung-tu-mua-hang',
      content: "Chứng từ mua hàng"
    },
    {
      url: 'phieu-chi',
      content: "Phiếu chi"
    },
    {
      url: 'phieu-chi-khac',
      content: "Phiếu chi khác"
    },

  ]
  return (
    <div>
      <Header title="Mua hàng" titlez={titlez} process={process} />
      <Outlet />
    </div>
      )
}

export default MuaHang