import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom';

const BaoCao = () => {
  const titlez = "Báo cáo";
    const process = [
      // {
      //   url: 'quy-trinh',
      //   content: "Quy trình"
      // },
      {
        url: 'chi-tiet-doanh-thu-nhan-vien',
        content: "Chi tiết doanh thu nhân viên"
      },
      {
        url: 'tong-hop-doanh-thu-nhan-vien',
        content: "Tổng hợp doanh thu nhân viên"
      },
      {
        url: 'doanh-thu-theo-san-pham',
        content: "Doanh thu theo sản phẩm"
      },
      {
        url: 'bao-cao-mua-hang',
        content: "Báo cáo mua hàng"
      },
      // {
      //   url: 'bao-cao-da-luu',
      //   content: "Báo cáo đã lưu"
      // },
    ]
  return (
    <div>
      <Header title="Báo cáo" titlez={titlez} process={process} />
      <Outlet />
    </div>
  )
}

export default BaoCao