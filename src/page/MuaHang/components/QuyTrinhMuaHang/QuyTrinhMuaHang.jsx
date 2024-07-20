import React from 'react'
import Process from '../../../../component/Process/Process'

const QuyTrinhMuaHang = () => {
  const mainContent = "NGHIỆP VỤ MUA HÀNG";
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

  ]
      return (
        <Process mainContent={mainContent} process={process} />
      )
}

export default QuyTrinhMuaHang