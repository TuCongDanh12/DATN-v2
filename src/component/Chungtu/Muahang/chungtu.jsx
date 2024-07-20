import React, {useState} from "react";
import { Tabs } from "antd";
import FormPhieunhap from "../../Form/Muahang/phieunhap";
import FormHoadonMuahang from "../../Form/Muahang/hoadon";
import FormPhieuchi from "../../Form/Muahang/phieuchi";
import Tablehoadon from "../../Table/table-hoadon";
import Option from "./option";
import ListButton from "../../Button/list-button";


function MuahangChungtu() {
  const [selectedOption, setSelectedOption] = useState("Chưa thanh toán");

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const items = [
    {
      key: "1",
      label: "Phiếu nhập",
      children: <FormPhieunhap />,
    },
    {
      key: "2",
      label: "Hóa đơn",
      children: <FormHoadonMuahang />,
    },
  ];

  const items1 = [
    ...items,
    {
      key: "3",
      label: "Phiếu chi",
      children: <FormPhieuchi/>,
    },
  ];
  const renderItems = () => {
    if (selectedOption === "Chưa thanh toán") {
      return items;
    } else if (selectedOption === "Thanh toán ngay") {
      return items1;
    }
  };
  return (
    <div>
      <h1 className="mx-[30px] font-bold text-[32px] mb-2">
        Lập chứng từ mua hàng NK00006
      </h1>
      <Option onChange={handleOptionChange}/>
      <Tabs
        className="mx-[30px]"
        defaultActiveKey="1"
        items={renderItems()}
      />
      <Tablehoadon />
      <ListButton className="!float-right" />
    </div>
  );
}

export default MuahangChungtu;
