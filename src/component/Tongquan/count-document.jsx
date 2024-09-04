import React, { useEffect, useState } from "react";
import { Flex, Select } from "antd";
import { DiffTwoTone, SnippetsTwoTone, CopyTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { banHangSelector, getListChungTuBan, getListDonBanHang, getListPhieuThuTienGui, getListPhieuThuTienMat } from "../../store/features/banHangSlice";
import { selectTime } from "../../utils/func";



function Countdocument() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getListDonBanHang());
    dispatch(getListChungTuBan());
    dispatch(getListPhieuThuTienMat());
    dispatch(getListPhieuThuTienGui());
  }, []);

  const {
    listDonBanHangData,
  } = useSelector(banHangSelector);

  const {
    listChungTuBanData,
  } = useSelector(banHangSelector);

  const {
    listPhieuThuTienMatData,
    listPhieuThuTienGuiData,
    isSuccessGetListPhieuThuTienMat,
    isSuccessGetListPhieuThuTienGui,
  } = useSelector(banHangSelector);

  const initialItems = [
    {
      name: "Số đơn bán hàng",
      icon: <DiffTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#D4EAC7",
      number: 0,
    },
    {
      name: "Số chứng từ bán",
      icon: <SnippetsTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#C7EAF4",
      number: 0,
    },
    {
      name: "Số phiếu thu",
      icon: <CopyTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#F4C7E1",
      number: 0,
    },
  ];


  useEffect(() => {
    if (listDonBanHangData.length) {
      const timeRange = selectTime('thisMonth');
      const data = listDonBanHangData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      setSoDonHang(data.length);
    }
  }, [listDonBanHangData]);

  useEffect(() => {
    if (listChungTuBanData.length) {
      // initialItems[1].number = listChungTuBanData.length;
      const timeRange = selectTime('thisMonth');
      const data = listChungTuBanData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      setSoChungTu(data.length);
    }
  }, [listChungTuBanData]);

  useEffect(() => {
    if (isSuccessGetListPhieuThuTienMat && isSuccessGetListPhieuThuTienGui) {
      // initialItems[2].number = listPhieuThuTienMatData.length + listPhieuThuTienGuiData.length;
      const timeRange = selectTime('thisMonth');
      const data1 = listPhieuThuTienMatData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      const data2 = listPhieuThuTienGuiData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))


      setSoPhieuThu(data1.length + data2.length);
    }
  }, [isSuccessGetListPhieuThuTienMat, isSuccessGetListPhieuThuTienGui]);



  const [soDonHang, setSoDonHang] = useState(0);
  const [soChungTu, setSoChungTu] = useState(0);
  const [soPhieuThu, setSoPhieuThu] = useState(0);

  const handleChangeSoDonHang = (value) => {
    if (value === "current") {
      setSoDonHang(listDonBanHangData.length);
    }
    else {
      const timeRange = selectTime(value);
      const data = listDonBanHangData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      setSoDonHang(data.length);
    }

  }

  const handleChangeSoChungTu = (value) => {
    if (value === "current") {
      setSoChungTu(listChungTuBanData.length);
    }
    else {
      const timeRange = selectTime(value);
      const data = listChungTuBanData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      setSoChungTu(data.length);
    }

  }

  const handleChangeSoPhieuThu = (value) => {
    if (value === "current") {
      setSoPhieuThu(listPhieuThuTienMatData.length + listPhieuThuTienGuiData.length);
    }
    else {
      const timeRange = selectTime(value);

      const data1 = listPhieuThuTienMatData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
      const data2 = listPhieuThuTienGuiData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))


      setSoPhieuThu(data1.length + data2.length);
    }

  }

  return (
    <Flex gap={50}>
      <Flex
        gap={20}
        // align="center"
        // justify="center"
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[0].backgroundColor }}
      >
        <div>{initialItems[0].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">{initialItems[0].name}  &emsp;<Select
            defaultValue={'thisMonth'}
            style={{
              width: 120,

            }}
            className="bg-[#FFF6D8]"
            onChange={handleChangeSoDonHang}
            options={[
              {
                value: 'current',
                label: 'Hiện tại',
              },
              {
                value: 'thisYear',
                label: 'Năm nay',
              },
              {
                value: 'lastYear',
                label: 'Năm trước',
              },
              {
                value: 'thisMonth',
                label: 'Tháng này',
              },
              {
                value: 'lastMonth',
                label: 'Tháng trước',
              },
              {
                value: 'thisQuarter',
                label: 'Quý này',
              },
              {
                value: 'lastQuarter',
                label: 'Quý trước',
              },
              {
                value: 'Q1',
                label: 'Quý 1',
              },
              {
                value: 'Q2',
                label: 'Quý 2',
              },
              {
                value: 'Q3',
                label: 'Quý 3',
              },
              {
                value: 'Q4',
                label: 'Quý 4',
              },
            ]}
          />
          </p>
          <p className="text-3xl font-bold">{soDonHang}</p>
        </Flex>
      </Flex>




      <Flex
        gap={20}
        // align="center"
        // justify="center"
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[1].backgroundColor }}
      >
        <div>{initialItems[1].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">{initialItems[1].name}  &emsp;<Select
            defaultValue={'thisMonth'}
            style={{
              width: 120,

            }}
            className="bg-[#FFF6D8]"
            onChange={handleChangeSoChungTu}
            options={[
              {
                value: 'current',
                label: 'Hiện tại',
              },
              {
                value: 'thisYear',
                label: 'Năm nay',
              },
              {
                value: 'lastYear',
                label: 'Năm trước',
              },
              {
                value: 'thisMonth',
                label: 'Tháng này',
              },
              {
                value: 'lastMonth',
                label: 'Tháng trước',
              },
              {
                value: 'thisQuarter',
                label: 'Quý này',
              },
              {
                value: 'lastQuarter',
                label: 'Quý trước',
              },
              {
                value: 'Q1',
                label: 'Quý 1',
              },
              {
                value: 'Q2',
                label: 'Quý 2',
              },
              {
                value: 'Q3',
                label: 'Quý 3',
              },
              {
                value: 'Q4',
                label: 'Quý 4',
              },
            ]}
          />
          </p>
          <p className="text-3xl font-bold">{soChungTu}</p>
        </Flex>
      </Flex>



      <Flex
        gap={20}
        // align="center"
        // justify="center"
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[2].backgroundColor }}
      >
        <div>{initialItems[2].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">{initialItems[2].name}  &emsp;<Select
            defaultValue={'thisMonth'}
            style={{
              width: 120,

            }}
            className="bg-[#FFF6D8]"
            onChange={handleChangeSoPhieuThu}
            options={[
              {
                value: 'current',
                label: 'Hiện tại',
              },
              {
                value: 'thisYear',
                label: 'Năm nay',
              },
              {
                value: 'lastYear',
                label: 'Năm trước',
              },
              {
                value: 'thisMonth',
                label: 'Tháng này',
              },
              {
                value: 'lastMonth',
                label: 'Tháng trước',
              },
              {
                value: 'thisQuarter',
                label: 'Quý này',
              },
              {
                value: 'lastQuarter',
                label: 'Quý trước',
              },
              {
                value: 'Q1',
                label: 'Quý 1',
              },
              {
                value: 'Q2',
                label: 'Quý 2',
              },
              {
                value: 'Q3',
                label: 'Quý 3',
              },
              {
                value: 'Q4',
                label: 'Quý 4',
              },
            ]}
          />
          </p>
          <p className="text-3xl font-bold">{soPhieuThu}</p>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Countdocument;


// {initialItems.map((item) => {
//   return (
//     <Flex
//       gap={20}
//       // align="center"
//       // justify="center"
//       className="p-5 rounded-md"
//       style={{ backgroundColor: item.backgroundColor }}
//     >
//       <div>{item.icon}</div>
//       <Flex vertical gap={10}>
//         <p className="text-xl font-bold">{item.name}  &emsp;<Select
//           defaultValue={'thisYear'}
//           style={{
//             width: 120,

//           }}
//           className="bg-[#FFF6D8]"
//           // onChange={(value) => handleChange(value, initialItems.data)}
//           options={[
//             {
//               value: 'thisYear',
//               label: 'Năm nay',
//             },
//             {
//               value: 'lastYear',
//               label: 'Năm trước',
//             },
//             {
//               value: 'thisMonth',
//               label: 'Tháng này',
//             },
//             {
//               value: 'lastMonth',
//               label: 'Tháng trước',
//             },
//             {
//               value: 'thisQuarter',
//               label: 'Quý này',
//             },
//             {
//               value: 'lastQuarter',
//               label: 'Quý trước',
//             },
//             {
//               value: 'Q1',
//               label: 'Quý 1',
//             },
//             {
//               value: 'Q2',
//               label: 'Quý 2',
//             },
//             {
//               value: 'Q3',
//               label: 'Quý 3',
//             },
//             {
//               value: 'Q4',
//               label: 'Quý 4',
//             },
//           ]}
//         />
//         </p>
//         <p className="text-3xl font-bold">{item.number}</p>
//       </Flex>
//     </Flex>
//   );
// })}