import React, { useEffect, useState } from "react";
import { VND } from "../../utils/func";
import { Flex, Progress } from "antd";
import muahangService from "../../services/muahang.service";

const NoPhaiTra = () => {
  const [noPhaiTraData, setNoPhaiTraData] = useState({
    noTrongHan: 0,
    noQuaHan: 0,
  });

  const fetchNoPhaiTraData = async () => {
    try {
      const response = await muahangService.getListChungTuMua();
      const ctmua = response.data.result.data;

      const currentDate = new Date();

      let noTrongHan = 0;
      let noQuaHan = 0;

      ctmua.forEach((item) => {
        const paymentTermDate = new Date(item.paymentTerm);
        const noConLai = item.finalValue - item.paidValue;

        if (paymentTermDate > currentDate) {
          // Trong hạn
          noTrongHan += noConLai;
        } else {
          // Quá hạn
          noQuaHan += noConLai;
        }
      });

      setNoPhaiTraData({ noTrongHan, noQuaHan });
    } catch (error) {
      console.error("Error fetching no phai tra data:", error);
    }
  };

  useEffect(() => {
    fetchNoPhaiTraData();
  }, []);

  return (
    <div>
      <p className="text-xl mt-5">Tổng nợ phải trả</p>
      <strong className="fon-bold text-2xl !mb-5">
        {VND.format(noPhaiTraData.noTrongHan + noPhaiTraData.noQuaHan)}
      </strong>
      <Flex className='mt-5' justify="space-between">
        <Flex vertical>
          <p className="text-orange-500">
            <strong className="fon-bold text-2xl">
              {VND.format(noPhaiTraData.noQuaHan)}
            </strong>
          </p>
          <p className="text-gray-500">QUÁ HẠN</p>
        </Flex>
        <Flex vertical align="flex-end">
          <p>
            <strong className="fon-bold text-2xl">
              {VND.format(noPhaiTraData.noTrongHan)}
            </strong>
          </p>
          <p className="text-gray-500">TRONG HẠN</p>
        </Flex>
      </Flex>
      <Progress
        percent={
          (noPhaiTraData.noQuaHan * 100) /
          (noPhaiTraData.noQuaHan + noPhaiTraData.noTrongHan)
        }
        showInfo={false}
        strokeColor="#f00732"
        trailColor="blue"
      />
    </div>
  );
};

export default NoPhaiTra;
