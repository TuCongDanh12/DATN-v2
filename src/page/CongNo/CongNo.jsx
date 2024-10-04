import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom';

const CongNo = () => {
  const titlez = "Nợ";
    const process = [
      // {
      //   url: 'quy-trinh',
      //   content: "Quy trình"
      // },
      // {
      //   url: 'chi-tiet-no-phai-thu',
      //   content: "Chi tiết nợ phải thu"
      // },
      // {
      //   url: 'tong-hop-no-phai-thu',
      //   content: "Tổng hợp nợ phải thu"
      // },
      // {
      //   url: 'bao-cao-da-luu',
      //   content: "Báo cáo đã lưu"
      // },
      {
        url: 'bao-cao-no-phai-tra',
        content: "Báo cáo nợ phải trả"
      },
      {
        url: 'doi-chieu-cong-no',
        content: "Đối chiếu công nợ"
      },
      {
        url: 'tong-hop-cong-no',
        content: "Tổng hợp công nợ"
      },
    ]
  return (
    <div>
      <Header title="Nợ" titlez={titlez} process={process} />
      <Outlet />
    </div>
  )
}

export default CongNo