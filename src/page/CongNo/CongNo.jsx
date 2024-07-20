import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom';

const CongNo = () => {
  const titlez = "Nợ phải thu";
    const process = [
      // {
      //   url: 'quy-trinh',
      //   content: "Quy trình"
      // },
      {
        url: 'chi-tiet-no-phai-thu',
        content: "Chi tiết nợ phải thu"
      },
      {
        url: 'tong-hop-no-phai-thu',
        content: "Tổng hợp nợ phải thu"
      },
      {
        url: 'bao-cao-da-luu',
        content: "Báo cáo đã lưu"
      },
    ]
  return (
    <div>
      <Header title="Nợ phải thu" titlez={titlez} process={process} />
      <Outlet />
    </div>
  )
}

export default CongNo