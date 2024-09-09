import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { baoCaoSelector, postReportDTBHRaw } from "../../store/features/baoCaoSlice";
// import { DataFormater, selectTime } from "../../utils/func";

const colors = [
  "#00C49F",
  "#00C49F",
  "#82CA9D",
  "#82CA9D",
  "#AED581",
  "#AED581",
  "#FFB74D",
  "#FFB74D",
  "#FF8A65",
  "#FF8A65",
];
const DataFormater = (number) => {
  // if(number > 1000000000){
  //   return (number/1000000000).toString() + 'B';
  // }else if(number > 1000000){
  //   return (number/1000000).toString() + 'M';
  // }else 
  if (number >= 1000000000) {
    return (number / 1000000000).toString() + 'Tỷ';
  }
  if (number > 1000000) {
    return (number / 1000000).toString() + 'Triệu';
  } else {
    return number.toString();
  }
}


// Utility function to format the time range into startDate and endDate
const getTimeRangeDates = (timeRange) => {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let startDate, endDate;

  switch (timeRange) {
    case "thisYear":
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
      break;
    case "lastYear":
      year -= 1;
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
      break;
    case "thisMonth":
      startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of the month
      break;
    case "lastMonth":
      if (month === 1) {
        year -= 1;
        month = 12;
      } else {
        month -= 1;
      }
      startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      endDate = new Date(year, month, 0).toISOString().split("T")[0];
      break;
    case "Q1":
      startDate = `${year}-01-01`;
      endDate = `${year}-03-31`;
      break;
    case "Q2":
      startDate = `${year}-04-01`;
      endDate = `${year}-06-30`;
      break;
    case "Q3":
      startDate = `${year}-07-01`;
      endDate = `${year}-09-30`;
      break;
    case "Q4":
      startDate = `${year}-10-01`;
      endDate = `${year}-12-31`;
      break;
    default:
      throw new Error("Invalid time range");
  }

  return { startDate, endDate };
};

const ChartNhanvien = ({ timeRange }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  const {
    reportDTBHData,
    isSuccessPostReportDTBH,
  } = useSelector(baoCaoSelector);

  // Fetch report data when timeRange changes
  useEffect(() => {
    if (timeRange) {
      const { startDate, endDate } = getTimeRangeDates(timeRange);

      const dataConvert = {
        startDate,
        endDate,
        name: `Báo cáo doanh thu nhân viên cho ${timeRange}`,
        description: `Báo cáo doanh thu nhân viên trong khoảng ${startDate} - ${endDate}`,
        salespersonIds: [1, 2, 3], // Example IDs, replace with actual salesperson IDs if needed
      };

      dispatch(postReportDTBHRaw({ values: dataConvert }));
    }
  }, [timeRange, dispatch]);

  // Process report data when available
  useEffect(() => {
    if (reportDTBHData) {
      const processedData = reportDTBHData.map((salesperson) => {
        let totalRevenue = 0;
        salesperson.ctbans?.forEach((sale) => {
          totalRevenue += sale.totalProductValue - sale.totalDiscountValue;
        });

        return {
          id: salesperson?.salesperson?.id,
          name: salesperson?.salesperson?.name,
          "Doanh thu": totalRevenue,
        };
      });

      // Sort the data by "Doanh thu" and take the top 10
      processedData.sort((a, b) => b["Doanh thu"] - a["Doanh thu"]);
      setData(processedData.slice(0, 10));
    }
  }, [reportDTBHData]);

  return (
    <div>
      <p className="font-bold text-xl mt-5">Biểu đồ top 10 nhân viên có doanh thu cao nhất</p>
      <ResponsiveContainer width={600} height={400} className="border border-gray-300 shadow-xl rounded-lg">
        <BarChart
          layout="vertical"
          width={500}
          height={400}
          data={data}
          margin={{ top: 20, right: 70, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={DataFormater} />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Doanh thu">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
            <LabelList dataKey="Doanh thu" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartNhanvien;
