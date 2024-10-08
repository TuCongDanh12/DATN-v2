import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
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
import { VND } from "../../utils/func";
import tongQuanService from "../../services/tongQuan.service";
import Countdocument from "../../component/Tongquan/count-document";
import CountdocumentMua from "../../component/Tongquan/count-document-mua";
import TinhHinhTaiChinh from "../../component/Chart/TinhHinhTaiChinh";
import TinhHinhTaiChinhMua from "../../component/Chart/TinhHinhTaiChinhMua";
import { congNoSelector } from "../../store/features/congNoSlice";
import NoPhaiTra from "../../component/Chart/NoChuaTra";

const TongQuan = () => {
  const dispatch = useDispatch();
  const { isSuccessGetChartRevenue, chartRevenueData } =
    useSelector(tongQuanSelector);
  const { reportTHCNData } = useSelector(congNoSelector);

  const [dataVenue, setDataVenue] = useState([]);
  const [costData, setCostData] = useState({ thisPeriod: [], lastPeriod: [] });
  const [timeRange, setTimeRange] = useState("thisYear");
  const [hideRevenue, setHideRevenue] = useState(false);
  const [hideCostThisPeriod, setHideCostThisPeriod] = useState(false);
  const [hideCostLastPeriod, setHideCostLastPeriod] = useState(false);

  // Function to fetch cost data based on year, month or quarter
  const fetchCostData = async (year, month = null, quarter = null) => {
    try {
      let responseThisPeriod, responseLastPeriod;
      if (month) {
        responseThisPeriod = await tongQuanService.getMuaHangChartRevenueMonth({
          values: { year, month },
        });
        responseLastPeriod = await tongQuanService.getMuaHangChartRevenueMonth({
          values: {
            year: month === 1 ? year - 1 : year,
            month: month === 1 ? 12 : month - 1,
          },
        });
      } else if (quarter) {
        responseThisPeriod =
          await tongQuanService.getMuaHangChartRevenueQuarter({
            values: { year, quarter },
          });
        responseLastPeriod =
          await tongQuanService.getMuaHangChartRevenueQuarter({
            values: {
              year: quarter === 1 ? year - 1 : year,
              quarter: quarter === 1 ? 4 : quarter - 1,
            },
          });
      } else {
        responseThisPeriod = await tongQuanService.getMuaHangChartRevenueYear({
          values: { year },
        });
        responseLastPeriod = await tongQuanService.getMuaHangChartRevenueYear({
          values: { year: year - 1 },
        });
      }

      const costThisPeriod = responseThisPeriod.data.result.data.map(
        (item) => ({ cost: item.finalValue })
      );
      const costLastPeriod = responseLastPeriod.data.result.data.map(
        (item) => ({ cost: item.finalValue })
      );

      setCostData({ thisPeriod: costThisPeriod, lastPeriod: costLastPeriod });
      // console.log('Tiền', costData, year, month)
    } catch (error) {
      console.error("Error fetching cost data:", error);
    }
  };

  // Handle time range selection and fetch necessary data
  const handleTimeRangeChange = async (value) => {
    setTimeRange(value);
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let quarter = null;

    switch (value) {
      case "thisYear":
        await fetchCostData(year);
        dispatch(getChartRevenueYear({ values: { year } }));
        break;
      case "lastYear":
        year -= 1;
        await fetchCostData(year);
        dispatch(getChartRevenueYear({ values: { year } }));
        break;
      case "thisMonth":
        await fetchCostData(year, month);
        dispatch(getChartRevenueMonth({ values: { year, month } }));
        break;
      case "lastMonth":
        if (month === 1) {
          month = 12;
          year -= 1;
        } else {
          month -= 1;
        }
        await fetchCostData(year, month);
        dispatch(getChartRevenueMonth({ values: { year, month } }));
        break;
      case "thisQuarter":
        quarter = Math.floor((month - 1) / 3) + 1;
        await fetchCostData(year, null, quarter);
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
      case "lastQuarter":
        quarter = Math.floor((month - 1) / 3);
        if (quarter === 0) {
          quarter = 4;
          year -= 1;
        }
        await fetchCostData(year, null, quarter);
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
      case "Q1":
      case "Q2":
      case "Q3":
      case "Q4":
        quarter = parseInt(value.replace("Q", ""), 10);
        await fetchCostData(year, null, quarter);
        dispatch(getChartRevenueQuarter({ values: { year, quarter } }));
        break;
      default:
        console.error("Invalid option selected");
    }
  };

  useEffect(() => {
    handleTimeRangeChange("thisYear");
  }, []);

  useEffect(() => {
    if (
      isSuccessGetChartRevenue &&
      costData.thisPeriod &&
      costData.lastPeriod
    ) {
      const combinedData = chartRevenueData.map((item, index) => ({
        name: item.name,
        "Doanh thu": item["Doanh thu năm nay"],
        [currentLabel]: costData.thisPeriod[index]?.cost || 0,
        [previousLabel]: costData.lastPeriod[index]?.cost || 0,
        "Lợi nhuận":
          Number(item["Doanh thu năm nay"]) - costData.thisPeriod[index]?.cost,
      }));
      console.log("Biểu đồ", combinedData);
      setDataVenue(combinedData);
      dispatch(clearState());
    }
  }, [isSuccessGetChartRevenue, costData, chartRevenueData, dispatch]);

  const DataFormater = (number) => {
    if (number >= 1000000000) {
      return (number / 1000000000).toString() + " Tỷ";
    }
    if (number > 1000000) {
      return (number / 1000000).toString() + " Triệu";
    } else {
      return number.toString();
    }
  };

  const getCostLabels = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    switch (timeRange) {
      case "thisYear":
        return {
          current: `Chi phí năm ${year}`,
          previous: `Chi phí năm ${year - 1}`,
        };
      case "thisMonth":
        return {
          current: `Chi phí tháng ${month}/${year}`,
          previous: `Chi phí tháng ${month - 1 || 12}/${
            month === 1 ? year - 1 : year
          }`,
        };
      case "lastMonth":
        return {
          current: `Chi phí tháng ${month - 1 || 12}/${
            month === 1 ? year - 1 : year
          }`,
          previous: `Chi phí tháng ${month - 2 || 12}/${
            month === 1 ? year - 1 : year
          }`,
        };
      case "thisQuarter":
      case "lastQuarter":
        const quarter =
          Math.floor((month - 1) / 3) + (timeRange === "thisQuarter" ? 1 : 0);
        return {
          current: `Chi phí quý ${quarter} năm ${year}`,
          previous: `Chi phí quý ${quarter - 1 || 4} năm ${
            quarter === 1 ? year - 1 : year
          }`,
        };
      case "Q1":
      case "Q2":
      case "Q3":
      case "Q4":
        const selectedQuarter = parseInt(timeRange.replace("Q", ""), 10);
        return {
          current: `Chi phí quý ${selectedQuarter} năm ${year}`,
          previous: `Chi phí quý ${selectedQuarter} năm ${year - 1}`,
        };
      default:
        return {
          current: "Chi phí kỳ này",
          previous: "Chi phí kỳ trước",
        };
    }
  };

  const { current: currentLabel, previous: previousLabel } = getCostLabels();

  return (
    <div className="ml-5 mb-5 mt-5">
      <h1 className="font-bold text-3xl mb-5">Tổng quan</h1>
      <Select
        defaultValue={"thisYear"}
        style={{ width: 120 }}
        className="!bg-[#FFF6D8] mb-5"
        onChange={handleTimeRangeChange}
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

      <Flex vertical gap={30}>
        <Flex gap={50}>
          <Countdocument timeRange={timeRange} />
          <div className='border border-gray-300 shadow-md rounded-lg p-5 w-[500px] mr-3'>
            <p className="text-xl">Tổng nợ phải thu</p>
            <p>
              <strong className="font-bold text-2xl ">
                {VND.format(
                  reportTHCNData
                    ?.map((pt) => pt.inOfDate)
                    .reduce((total, currentValue) => total + currentValue, 0) +
                    reportTHCNData
                      ?.map((pt) => pt.outOfDate)
                      .reduce((total, currentValue) => total + currentValue, 0)
                )}
              </strong>
            </p>
            <p className="text-gray-500 mb-8">TỔNG</p>
            <Flex justify="space-between">
              <Flex vertical>
                <p className="text-orange-500">
                  <strong className="font-bold text-2xl">
                    {VND.format(
                      reportTHCNData
                        ?.map((pt) => pt.outOfDate)
                        .reduce(
                          (total, currentValue) => total + currentValue,
                          0
                        )
                    )}
                  </strong>
                </p>
                <p className="text-gray-500">QUÁ HẠN</p>
              </Flex>
              <Flex vertical align="flex-end">
                <p>
                  <strong className="font-bold text-2xl">
                    {VND.format(
                      reportTHCNData
                        ?.map((pt) => pt.inOfDate)
                        .reduce(
                          (total, currentValue) => total + currentValue,
                          0
                        )
                    )}
                  </strong>
                </p>
                <p className="text-gray-500">TRONG HẠN</p>
              </Flex>
            </Flex>
            <Progress
              percent={
                (reportTHCNData
                  ?.map((pt) => pt.outOfDate)
                  .reduce((total, currentValue) => total + currentValue, 0) *
                  100) /
                (reportTHCNData
                  ?.map((pt) => pt.outOfDate)
                  .reduce((total, currentValue) => total + currentValue, 0) +
                  reportTHCNData
                    ?.map((pt) => pt.inOfDate)
                    .reduce((total, currentValue) => total + currentValue, 0))
              }
              showInfo={false}
              strokeColor="#f00732"
              trailColor="blue"
            />
          </div>
        </Flex>
        <Flex gap={50}>
          <CountdocumentMua timeRange={timeRange} />
          <div className='border border-gray-300 shadow-md rounded-lg p-5 w-[500px] mr-3'>
          <NoPhaiTra />
          </div>
        </Flex>
      </Flex>

      <Flex vertical gap={50} className="mt-5 w-full">
        <ResponsiveContainer className="!w-[900px] !h-[300px] border border-gray-300 shadow-xl rounded-lg p-5 mt-3">
          <p className="font-bold text-xl">Chi phí, doanh thu</p>
          <LineChart
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
            <Legend
              onClick={(e) => {
                if (e.dataKey === "Doanh thu") {
                  setHideRevenue(!hideRevenue);
                } else if (e.dataKey === currentLabel) {
                  setHideCostThisPeriod(!hideCostThisPeriod);
                } else if (e.dataKey === previousLabel) {
                  setHideCostLastPeriod(!hideCostLastPeriod);
                }
              }}
            />
            <Line
              dataKey="Doanh thu"
              stroke="#4B8AF1"
              strokeOpacity={hideRevenue ? 0 : 1}
            />
            <Line
              dataKey={currentLabel}
              stroke="#E76F51"
              strokeOpacity={hideCostThisPeriod ? 0 : 1}
            />
            <Line
              dataKey={previousLabel}
              stroke="#82ca9d"
              strokeOpacity={hideCostLastPeriod ? 0 : 1}
            />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer className="!w-[900px] !h-[300px] border border-gray-300 shadow-xl rounded-lg p-5 mt-5">
          <p className="font-bold text-xl">Lợi nhuận</p>
          <BarChart
            data={dataVenue}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Lợi nhuận" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        
      </Flex>

      <Flex gap={40}>
        <TinhHinhTaiChinh timeRange={timeRange} />
        <TinhHinhTaiChinhMua timeRange={timeRange} />
      </Flex>
    </div>
  );
};

export default TongQuan;
