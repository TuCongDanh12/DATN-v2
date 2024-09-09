import React, { useEffect, useState } from "react";
import { Flex } from "antd";
import { DiffTwoTone, SnippetsTwoTone, CopyTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  banHangSelector,
  getListChungTuBan,
  getListDonBanHang,
  getListPhieuThuTienGui,
  getListPhieuThuTienMat,
} from "../../store/features/banHangSlice";

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
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }

  return { startDate, endDate };
};

function Countdocument({ timeRange }) {
  const dispatch = useDispatch();
  const { listDonBanHangData, listChungTuBanData, listPhieuThuTienMatData, listPhieuThuTienGuiData } = useSelector(banHangSelector);
  
  const [soDonHang, setSoDonHang] = useState(0);
  const [soChungTu, setSoChungTu] = useState(0);
  const [soPhieuThu, setSoPhieuThu] = useState(0);

  useEffect(() => {
    dispatch(getListDonBanHang());
    dispatch(getListChungTuBan());
    dispatch(getListPhieuThuTienMat());
    dispatch(getListPhieuThuTienGui());
  }, [dispatch]);

  useEffect(() => {
    const { startDate, endDate } = getTimeRangeDates(timeRange);

    if (listDonBanHangData.length) {
      const data = listDonBanHangData?.filter(
        (don) =>
          new Date(don?.createdAt) >= startDate && new Date(don?.createdAt) <= endDate
      );
      setSoDonHang(data.length);
    }
  }, [listDonBanHangData, timeRange]);

  useEffect(() => {
    const { startDate, endDate } = getTimeRangeDates(timeRange);

    if (listChungTuBanData.length) {
      const data = listChungTuBanData?.filter(
        (chungTu) =>
          new Date(chungTu?.createdAt) >= startDate && new Date(chungTu?.createdAt) <= endDate
      );
      setSoChungTu(data.length);
    }
  }, [listChungTuBanData, timeRange]);

  useEffect(() => {
    const { startDate, endDate } = getTimeRangeDates(timeRange);

    if (listPhieuThuTienMatData.length || listPhieuThuTienGuiData.length) {
      const data1 = listPhieuThuTienMatData?.filter(
        (phieuThu) =>
          new Date(phieuThu?.createdAt) >= startDate && new Date(phieuThu?.createdAt) <= endDate
      );
      const data2 = listPhieuThuTienGuiData?.filter(
        (phieuThu) =>
          new Date(phieuThu?.createdAt) >= startDate && new Date(phieuThu?.createdAt) <= endDate
      );
      setSoPhieuThu(data1.length + data2.length);
    }
  }, [listPhieuThuTienMatData, listPhieuThuTienGuiData, timeRange]);

  return (
    <Flex gap={50}>
      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#D4EAC7" }}>
        <div><DiffTwoTone style={{ fontSize: "30px" }} /></div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số đơn bán hàng</p>
          <p className="text-3xl font-bold">{soDonHang}</p>
        </Flex>
      </Flex>

      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#C7EAF4" }}>
        <div><SnippetsTwoTone style={{ fontSize: "30px" }} /></div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số chứng từ bán</p>
          <p className="text-3xl font-bold">{soChungTu}</p>
        </Flex>
      </Flex>

      <Flex gap={20} className="p-5 rounded-md" style={{ backgroundColor: "#F4C7E1" }}>
        <div><CopyTwoTone style={{ fontSize: "30px" }} /></div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">Số phiếu thu</p>
          <p className="text-3xl font-bold">{soPhieuThu}</p>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Countdocument;
