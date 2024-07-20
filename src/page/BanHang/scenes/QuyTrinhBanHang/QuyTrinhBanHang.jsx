import React from 'react'
import Process from './../../../../component/Process/Process';

const QuyTrinhBanHang = () => {
  const mainContent = "NGHIỆP VỤ BÁN HÀNG";
  const process = [
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
    <Process mainContent={mainContent} process={process} />
  )
}

export default QuyTrinhBanHang