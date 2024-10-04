import React, { useEffect, useState } from "react";
import { Flex } from "antd";
import { DiffTwoTone, SnippetsTwoTone, CopyTwoTone } from "@ant-design/icons";
import muahangService from "../../services/muahang.service";

// Helper function to convert timeRange to startDate and endDate
const getTimeRangeDates = (timeRange) => {
  const currentDate = new Date();
  let startDate, endDate;

  switch (timeRange) {
    case "thisYear":
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
      break;
    case "lastYear":
      startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
      endDate = new Date(currentDate.getFullYear() - 1, 11, 31);
      break;
    case "thisMonth":
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      break;
    case "lastMonth":
      const lastMonth = currentDate.getMonth() - 1;
      startDate = new Date(currentDate.getFullYear(), lastMonth, 1);
      endDate = new Date(currentDate.getFullYear(), lastMonth + 1, 0);
      break;
    case "Q1":
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 2, 31);
      break;
    case "Q2":
      startDate = new Date(currentDate.getFullYear(), 3, 1);
      endDate = new Date(currentDate.getFullYear(), 5, 30);
      break;
    case "Q3":
      startDate = new Date(currentDate.getFullYear(), 6, 1);
      endDate = new Date(currentDate.getFullYear(), 8, 30);
      break;
    case "Q4":
      startDate = new Date(currentDate.getFullYear(), 9, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31);
      break;
    default:
      // If no time range is selected, return current month as default
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }

  return { startDate, endDate };
};

const CountdocumentMua = ({ timeRange }) => {
  const [soDonMua, setSoDonMua] = useState(0);
  const [soChungTuMua, setSoChungTuMua] = useState(0);
  const [soPhieuChi, setSoPhieuChi] = useState(0);

  useEffect(() => {
    if (timeRange) {
      fetchData();
    }
  }, [timeRange]);

  const fetchData = async () => {
    const requestParams = {
      currentPage: 1,
      pageSize: 1000,
      sorts: "id%3AASC",
    };

    const { startDate, endDate } = getTimeRangeDates(timeRange); // Convert timeRange to startDate and endDate

    try {
      const [
        donMuaRes,
        chungTuMuaRes,
        phieuChiTienMatRes,
        phieuChiTienGuiRes,
      ] = await Promise.all([
        muahangService.getListDonMuahang({ requestParam: requestParams }),
        muahangService.getListChungTuMua(),
        muahangService.getListPhieuChiTienMat(),
        muahangService.getListPhieuChiTienGui(),
      ]);

      const donMuaData = donMuaRes.data.result.data;
      const chungTuMuaData = chungTuMuaRes.data.result.data;
      const phieuChiTienMatData = phieuChiTienMatRes.data.result.data;
      const phieuChiTienGuiData = phieuChiTienGuiRes.data.result.data;

      // Filter data based on the computed startDate and endDate
      setSoDonMua(
        donMuaData.filter(
          (don) => new Date(don?.createdAt) >= startDate && new Date(don?.createdAt) <= endDate
        ).length
      );

      setSoChungTuMua(
        chungTuMuaData.filter(
          (chungTu) => new Date(chungTu?.createdAt) >= startDate && new Date(chungTu?.createdAt) <= endDate
        ).length
      );

      const totalPhieuChi = [
        ...phieuChiTienMatData,
        ...phieuChiTienGuiData,
      ].filter(
        (phieuChi) =>
          new Date(phieuChi?.createdAt) >= startDate &&
          new Date(phieuChi?.createdAt) <= endDate
      ).length;

      setSoPhieuChi(totalPhieuChi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Flex gap={50} className='h-[200px]'>
      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#D4EAC7" }}>
        <div>
          <DiffTwoTone style={{ fontSize: "30px" }} />
        </div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số đơn mua hàng</p>
          <p className="text-3xl font-bold">{soDonMua}</p>
        </Flex>
      </Flex>

      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#C7EAF4" }}>
        <div>
          <SnippetsTwoTone style={{ fontSize: "30px" }} />
        </div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số chứng từ mua</p>
          <p className="text-3xl font-bold">{soChungTuMua}</p>
        </Flex>
      </Flex>

      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#F4C7E1" }}>
        <div>
          <CopyTwoTone style={{ fontSize: "30px" }} />
        </div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số phiếu chi</p>
          <p className="text-3xl font-bold">{soPhieuChi}</p>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CountdocumentMua;
