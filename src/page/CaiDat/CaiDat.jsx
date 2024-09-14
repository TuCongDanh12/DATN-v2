import React from 'react'
import Header from '../../component/Header/Header'
import { Outlet } from 'react-router-dom';

const CaiDat = () => {
  const titlez = "Cài đặt";
  const process = [
    // {
    //   url: 'quy-trinh',
    //   content: "Quy trình"
    // },
    {
      url: 'thong-tin-cong-ty',
      content: "Thông tin công ty"
    },
    {
      url: 'them-nhan-vien',
      content: "Quản lý nhân viên"
    },
    {
      url: 'thong-bao-den-han',
      content: "Thông báo đến hạn"
    },
    // {
    //   url: 'bao-cao-mua-hang',
    //   content: "Báo cáo mua hàng"
    // },
    // {
    //   url: 'bao-cao-da-luu',
    //   content: "Báo cáo đã lưu"
    // },
  ]
return (
  <div>
    <Header title="Cài đặt" titlez={titlez} process={process} />
    <Outlet />
  </div>
)
}

export default CaiDat