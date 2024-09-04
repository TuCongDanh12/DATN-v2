import React, { useEffect, useState } from "react";
import { Flex, Select } from "antd";
import { DiffTwoTone, SnippetsTwoTone, CopyTwoTone } from "@ant-design/icons";
import muahangService from "../../services/muahang.service";
import { selectTime } from "../../utils/func";

function CountdocumentMua() {
  const [soDonMua, setSoDonMua] = useState(0);
  const [soChungTuMua, setSoChungTuMua] = useState(0);
  const [soPhieuChi, setSoPhieuChi] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const requestParams = {
      currentPage: 1,
      pageSize: 1000, // Lấy toàn bộ dữ liệu để lọc cục bộ
      sorts: 'id%3AASC',
    };

    try {
      // Gọi API và lấy dữ liệu
      const res1 = await muahangService.getListDonMuahang({ requestParam: requestParams });
      const donMuaData = res1.data.result.data; // Lấy dữ liệu từ .data.result.data

      const res2 = await muahangService.getListChungTuMua();
      const chungTuMuaData = res2.data.result.data; // Lấy dữ liệu từ .data.result.data

      const res3 = await muahangService.getListPhieuChiTienMat();
      const phieuChiTienMatData = res3.data.result.data; // Lấy dữ liệu từ .data.result.data

      const res4 = await muahangService.getListPhieuChiTienGui();
      const phieuChiTienGuiData = res4.data.result.data; // Lấy dữ liệu từ .data.result.data

      // Lọc dữ liệu theo thời gian
      const timeRange = selectTime("thisMonth");

      const filteredDonMua = donMuaData?.filter(
        (don) =>
          new Date(don?.createdAt) > new Date(timeRange.startDate) &&
          new Date(don?.createdAt) < new Date(timeRange.endDate)
      );
      setSoDonMua(filteredDonMua.length);

      const filteredChungTuMua = chungTuMuaData?.filter(
        (chungTu) =>
          new Date(chungTu?.createdAt) > new Date(timeRange.startDate) &&
          new Date(chungTu?.createdAt) < new Date(timeRange.endDate)
      );
      setSoChungTuMua(filteredChungTuMua.length);

      const filteredPhieuChiTienMat = phieuChiTienMatData?.filter(
        (phieuChi) =>
          new Date(phieuChi?.createdAt) > new Date(timeRange.startDate) &&
          new Date(phieuChi?.createdAt) < new Date(timeRange.endDate)
      );
      const filteredPhieuChiTienGui = phieuChiTienGuiData?.filter(
        (phieuChi) =>
          new Date(phieuChi?.createdAt) > new Date(timeRange.startDate) &&
          new Date(phieuChi?.createdAt) < new Date(timeRange.endDate)
      );
      setSoPhieuChi(filteredPhieuChiTienMat.length + filteredPhieuChiTienGui.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeSoDonMua = async (value) => {
    const requestParams = {
      currentPage: 1,
      pageSize: 1000,
      sorts: 'id%3AASC',
    };
    try {
      const res1 = await muahangService.getListDonMuahang({ requestParam: requestParams });
      const donMuaData = res1.data.result.data;
      const timeRange = selectTime(value);

      const filteredDonMua = donMuaData?.filter(
        (don) =>
          new Date(don?.createdAt) > new Date(timeRange.startDate) &&
          new Date(don?.createdAt) < new Date(timeRange.endDate)
      );
      setSoDonMua(filteredDonMua.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeSoChungTuMua = async (value) => {
    try {
      const res2 = await muahangService.getListChungTuMua();
      const chungTuMuaData = res2.data.result.data;
      const timeRange = selectTime(value);

      const filteredChungTuMua = chungTuMuaData?.filter(
        (chungTu) =>
          new Date(chungTu?.createdAt) > new Date(timeRange.startDate) &&
          new Date(chungTu?.createdAt) < new Date(timeRange.endDate)
      );
      setSoChungTuMua(filteredChungTuMua.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeSoPhieuChi = async (value) => {
    try {
      const res3 = await muahangService.getListPhieuChiTienMat();
      const phieuChiTienMatData = res3.data.result.data;
      const res4 = await muahangService.getListPhieuChiTienGui();
      const phieuChiTienGuiData = res4.data.result.data;

      const timeRange = selectTime(value);

      const filteredPhieuChiTienMat = phieuChiTienMatData?.filter(
        (phieuChi) =>
          new Date(phieuChi?.createdAt) > new Date(timeRange.startDate) &&
          new Date(phieuChi?.createdAt) < new Date(timeRange.endDate)
      );
      const filteredPhieuChiTienGui = phieuChiTienGuiData?.filter(
        (phieuChi) =>
          new Date(phieuChi?.createdAt) > new Date(timeRange.startDate) &&
          new Date(phieuChi?.createdAt) < new Date(timeRange.endDate)
      );
      setSoPhieuChi(filteredPhieuChiTienMat.length + filteredPhieuChiTienGui.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const initialItems = [
    {
      name: "Số đơn mua hàng",
      icon: <DiffTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#D4EAC7",
      number: soDonMua,
    },
    {
      name: "Số chứng từ mua",
      icon: <SnippetsTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#C7EAF4",
      number: soChungTuMua,
    },
    {
      name: "Số phiếu chi",
      icon: <CopyTwoTone style={{ fontSize: "30px" }} />,
      backgroundColor: "#F4C7E1",
      number: soPhieuChi,
    },
  ];

  return (
    <Flex gap={50}>
      {/* Đơn mua hàng */}
      <Flex
        gap={20}
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[0].backgroundColor }}
      >
        <div>{initialItems[0].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">
            {initialItems[0].name} &emsp;
            <Select
              defaultValue={"thisMonth"}
              style={{ width: 120 }}
              className="bg-[#FFF6D8]"
              onChange={handleChangeSoDonMua}
              options={[
                { value: "current", label: "Hiện tại" },
                { value: "thisYear", label: "Năm nay" },
                { value: "lastYear", label: "Năm trước" },
                { value: "thisMonth", label: "Tháng này" },
                { value: "lastMonth", label: "Tháng trước" },
                { value: "thisQuarter", label: "Quý này" },
                { value: "lastQuarter", label: "Quý trước" },
                { value: "Q1", label: "Quý 1" },
                { value: "Q2", label: "Quý 2" },
                { value: "Q3", label: "Quý 3" },
                { value: "Q4", label: "Quý 4" },
              ]}
            />
          </p>
          <p className="text-3xl font-bold">{soDonMua}</p>
        </Flex>
      </Flex>

      {/* Chứng từ mua */}
      <Flex
        gap={20}
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[1].backgroundColor }}
      >
        <div>{initialItems[1].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">
            {initialItems[1].name} &emsp;
            <Select
              defaultValue={"thisMonth"}
              style={{ width: 120 }}
              className="bg-[#FFF6D8]"
              onChange={handleChangeSoChungTuMua}
              options={[
                { value: "current", label: "Hiện tại" },
                { value: "thisYear", label: "Năm nay" },
                { value: "lastYear", label: "Năm trước" },
                { value: "thisMonth", label: "Tháng này" },
                { value: "lastMonth", label: "Tháng trước" },
                { value: "thisQuarter", label: "Quý này" },
                { value: "lastQuarter", label: "Quý trước" },
                { value: "Q1", label: "Quý 1" },
                { value: "Q2", label: "Quý 2" },
                { value: "Q3", label: "Quý 3" },
                { value: "Q4", label: "Quý 4" },
              ]}
            />
          </p>
          <p className="text-3xl font-bold">{soChungTuMua}</p>
        </Flex>
      </Flex>

      {/* Phiếu chi */}
      <Flex
        gap={20}
        className="p-5 rounded-md"
        style={{ backgroundColor: initialItems[2].backgroundColor }}
      >
        <div>{initialItems[2].icon}</div>
        <Flex vertical gap={10}>
          <p className="text-xl font-bold">
            {initialItems[2].name} &emsp;
            <Select
              defaultValue={"thisMonth"}
              style={{ width: 120 }}
              className="bg-[#FFF6D8]"
              onChange={handleChangeSoPhieuChi}
              options={[
                { value: "current", label: "Hiện tại" },
                { value: "thisYear", label: "Năm nay" },
                { value: "lastYear", label: "Năm trước" },
                { value: "thisMonth", label: "Tháng này" },
                { value: "lastMonth", label: "Tháng trước" },
                { value: "thisQuarter", label: "Quý này" },
                { value: "lastQuarter", label: "Quý trước" },
                { value: "Q1", label: "Quý 1" },
                { value: "Q2", label: "Quý 2" },
                { value: "Q3", label: "Quý 3" },
                { value: "Q4", label: "Quý 4" },
              ]}
            />
          </p>
          <p className="text-3xl font-bold">{soPhieuChi}</p>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default CountdocumentMua;
