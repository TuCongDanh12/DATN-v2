import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, Flex, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  getChartRevenueMonth,
  getChartRevenueQuarter,
  getChartRevenueYear,
  tongQuanSelector,
} from "../../store/features/tongQuanSlice";
import { VND, selectTime } from "../../utils/func";
import tongQuanService from "../../services/tongQuan.service";
import Countdocument from "../../component/Tongquan/count-document";
import ChartNhanvien from "../../component/Chart/chartNhanvien";
import ChartSanpham from "../../component/Chart/chartSanpham";
import TinhHinhTaiChinh from "../../component/Chart/TinhHinhTaiChinh";
import { congNoSelector } from "../../store/features/congNoSlice";
import NoPhaiTra from "../../component/Chart/NoChuaTra";

const TongQuan = () => {
  const dispatch = useDispatch();

  const { isSuccessGetChartRevenue, chartRevenueData } =
    useSelector(tongQuanSelector);

  const { reportTHCNData } = useSelector(congNoSelector);

  const [dataVenue, setDataVenue] = useState([]);
  const [costData, setCostData] = useState([]);

  // Function to fetch cost data using tongQuanService
  const fetchCostData = async (year, month = null, quarter = null) => {
    try {
      let response;
      if (month) {
        response = await tongQuanService.getMuaHangChartRevenueMonth({
          values: { year, month },
        });
      } else if (quarter) {
        response = await tongQuanService.getMuaHangChartRevenueQuarter({
          values: { year, quarter },
        });
      } else {
        response = await tongQuanService.getMuaHangChartRevenueYear({
          values: { year },
        });
      }
      // Check the structure of the response
      // console.log("data chi phí", response);
      const costArray = response.data.result.data.map(item => ({
        cost: item.finalValue
      }));
      // console.log("costArray", costArray);
      setCostData(costArray); 
    } catch (error) {
      console.error("Error fetching cost data:", error);
    }
  };
  
  useEffect(() => {
    handleChange("thisYear");
  }, []); // Chạy một lần khi component mount

  // Combining revenue and cost data
  useEffect(() => {
    if (isSuccessGetChartRevenue && costData.length > 0) {
      const combinedData = chartRevenueData.map((item, index) => ({
        name: item.name,
        "Doanh thu": item["Doanh thu năm nay"],
        "Chi phí": costData[index]?.cost || 0, // Assuming 'cost' is the field name in the response
      }));
      // console.log("biểu đồ", combinedData);
      setDataVenue(combinedData); // Cập nhật dataVenue với combinedData mới
      dispatch(clearState()); // Clear state after use
    }
  }, [isSuccessGetChartRevenue, costData, dispatch, chartRevenueData]);
  

  const handleChange = async (value) => {
    const currentDate = new Date();
    let year = currentDate.getFullYear(); // Năm hiện tại
    let month = currentDate.getMonth() + 1; // Tháng hiện tại (lưu ý: getMonth() trả về giá trị từ 0-11)
    let quarter = null;
  
    switch (value) {
      case "thisYear":
        // Năm hiện tại đã được xác định
        await fetchCostData(year); // Fetch cost data first
        dispatch(getChartRevenueYear({ values: { year } }));
        break;
  
      case "lastYear":
        year = year - 1; // Giảm một năm để lấy năm trước
        await fetchCostData(year); // Fetch cost data first
        dispatch(getChartRevenueYear({ values: { year } }));
        break;
  
      case "thisMonth":
        // Năm và tháng hiện tại đã được xác định
        await fetchCostData(year, month); // Fetch cost data first
        dispatch(getChartRevenueMonth({ values: { year, month } }));
        break;
  
      case "lastMonth":
        if (month === 1) {
          month = 12; // Nếu là tháng 1, thì tháng trước là tháng 12 của năm trước
          year = year - 1;
        } else {
          month = month - 1; // Tháng trước đó
        }
        await fetchCostData(year, month); // Fetch cost data first
        dispatch(getChartRevenueMonth({ values: { year, month } }));
        break;
  
      case "thisQuarter":
        quarter = Math.floor((month - 1) / 3) + 1; // Tính quý hiện tại
        await fetchCostData(year, null, quarter); // Fetch cost data first
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
  
      case "lastQuarter":
        quarter = Math.floor((month - 1) / 3); // Tính quý trước đó
        if (quarter === 0) {
          quarter = 4; // Nếu quý trước là 0 thì quay về quý 4 của năm trước
          year = year - 1;
        }
        await fetchCostData(year, null, quarter); // Fetch cost data first
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
  
      case "Q1":
      case "Q2":
      case "Q3":
      case "Q4":
        quarter = parseInt(value.replace("Q", ""), 10); // Chuyển đổi giá trị Q thành số quý
        await fetchCostData(year, null, quarter); // Fetch cost data first
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
  
      default:
        console.error("Invalid option selected");
    }
  };
  
  const DataFormater = (number) => {
    if (number >= 1000000000) {
      return (number / 1000000000).toString() + "Tỷ";
    }
    if (number > 1000000) {
      return (number / 1000000).toString() + "Triệu";
    } else {
      return number.toString();
    }
  };

  return (
    <div className="ml-5 mb-5 mt-5">
      <h1 className="font-bold text-3xl mb-5">Tổng quan</h1>

      <Countdocument />

      <Flex gap={50} className="mt-5 w-full">
        <div>
          <p className="font-bold text-xl">Doanh thu, Chi Phí</p>
          <Select
            defaultValue={"thisYear"}
            style={{ width: 120 }}
            className="bg-[#FFF6D8]"
            onChange={handleChange}
            options={[
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

          <ResponsiveContainer className="!w-[900px] !h-[300px] border border-gray-300 shadow-xl rounded-lg p-5">
            <LineChart
              width={500}
              height={300}
              data={dataVenue}
              margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" />
              <YAxis
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={DataFormater}
              />
              <Tooltip />
              <Legend />
              <Line dataKey="Doanh thu" stroke="#4B8AF1" activeDot={{ r: 8 }} />
              <Line dataKey="Chi phí" stroke="#E76F51" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <Flex vertical className="border border-gray-300 shadow-md rounded-lg p-5 w-[400px]">
          <div>
          <p className="text-xl">Nợ phải thu theo hạn nợ</p>
          <p>
            <strong className="fon-bold text-2xl">
              {VND.format(
                reportTHCNData
                  ?.map((pt) => pt.inOfDate)
                  .reduce((total, currentValue) => {
                    return total + currentValue;
                  }, 0) +
                  reportTHCNData
                    ?.map((pt) => pt.outOfDate)
                    .reduce((total, currentValue) => {
                      return total + currentValue;
                    }, 0)
              )}
            </strong>
          </p>
          <p className="text-gray-500 mb-8">TỔNG</p>
          <Flex justify="space-between">
            <Flex vertical>
              <p className="text-orange-500">
                <strong className="fon-bold text-2xl">
                  {VND.format(
                    reportTHCNData
                      ?.map((pt) => pt.outOfDate)
                      .reduce((total, currentValue) => {
                        return total + currentValue;
                      }, 0)
                  )}
                </strong>
              </p>
              <p className="text-gray-500 ">QUÁ HẠN</p>
            </Flex>
            <Flex vertical align="flex-end">
              <p>
                <strong className="fon-bold text-2xl">
                  {VND.format(
                    reportTHCNData
                      ?.map((pt) => pt.inOfDate)
                      .reduce((total, currentValue) => {
                        return total + currentValue;
                      }, 0)
                  )}
                </strong>
              </p>
              <p className="text-gray-500 ">TRONG HẠN</p>
            </Flex>
          </Flex>
          <Progress
            percent={
              (reportTHCNData
                ?.map((pt) => pt.outOfDate)
                .reduce((total, currentValue) => {
                  return total + currentValue;
                }, 0) *
                100) /
              (reportTHCNData
                ?.map((pt) => pt.outOfDate)
                .reduce((total, currentValue) => {
                  return total + currentValue;
                }, 0) +
                reportTHCNData
                  ?.map((pt) => pt.inOfDate)
                  .reduce((total, currentValue) => {
                    return total + currentValue;
                  }, 0))
            }
            showInfo={false}
            strokeColor="#f00732"
            trailColor="blue"
          />
          </div>
           <NoPhaiTra/>
        </Flex>
       
      </Flex>

      <Flex gap={0} className="mt-4 !max-w-[90%]">
        <ChartNhanvien />
        <ChartSanpham />
      </Flex>

      <TinhHinhTaiChinh />
    </div>
  );
};

export default TongQuan;
