import React, { useEffect, useState } from 'react';
import { VND } from '../../utils/func';
import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import{
  postReportTHCNRaw,
  postReportDTBHRaw,
  clearState,
  tongQuanSelector,
} from '../../store/features/tongQuanSlice';

const getDateRangeFromTimeRange = (timeRange) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let startDate, endDate;

  switch (timeRange) {
    case 'thisYear':
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);
      break;
    case 'lastYear':
      startDate = new Date(currentYear - 1, 0, 1);
      endDate = new Date(currentYear - 1, 11, 31);
      break;
    case 'thisMonth':
      startDate = new Date(currentYear, currentDate.getMonth(), 1);
      endDate = new Date(currentYear, currentDate.getMonth() + 1, 0);
      break;
    case 'lastMonth':
      const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const lastMonthYear = currentDate.getMonth() === 0 ? currentYear - 1 : currentYear;
      startDate = new Date(lastMonthYear, lastMonth, 1);
      endDate = new Date(lastMonthYear, lastMonth + 1, 0);
      break;
    case 'Q1':
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 2, 31);
      break;
    case 'Q2':
      startDate = new Date(currentYear, 3, 1);
      endDate = new Date(currentYear, 5, 30);
      break;
    case 'Q3':
      startDate = new Date(currentYear, 6, 1);
      endDate = new Date(currentYear, 8, 30);
      break;
    case 'Q4':
      startDate = new Date(currentYear, 9, 1);
      endDate = new Date(currentYear, 11, 31);
      break;
    default:
      startDate = new Date(currentYear, 0, 1);
      endDate = new Date(currentYear, 11, 31);
  }

  return { startDate: startDate.toISOString().split('T')[0], endDate: endDate.toISOString().split('T')[0] };
};

const TinhHinhTaiChinh = ({ timeRange }) => {
  const dispatch = useDispatch();
  const [bank, setBank] = useState(0);
  const [cash, setCash] = useState(0);
  const [noPhaiThu, setNoPhaiThu] = useState(0);
  const [noPhaiThuTrongHan, setNoPhaiThuTrongHan] = useState(0);
  const [noPhaiThuQuaHan, setNoPhaiThuQuaHan] = useState(0);
  const [doanhThu, setDoanhThu] = useState(0);

  const { reportTHCNData, reportDTBHData, isSuccessPostReportTHCNRaw, isSuccessPostReportDTBHRaw } =
    useSelector(tongQuanSelector);

  useEffect(() => {
    const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);

    const dataConvert = {
      startDate,
      endDate,
      name: `Báo cáo THCN ${timeRange}`,
      description: `Báo cáo THCN ${timeRange}`,
      customerIds: [],
    };

    dispatch(postReportTHCNRaw({ values: dataConvert }));

    const dataConvert2 = {
      startDate,
      endDate,
      name: `Báo cáo doanh thu ${timeRange}`,
      description: `Báo cáo doanh thu ${timeRange}`,
      salespersonIds: [],
    };

    dispatch(postReportDTBHRaw({ values: dataConvert2 }));
  }, [timeRange, dispatch]);

  useEffect(() => {
    if (isSuccessPostReportTHCNRaw) {
      const totalDebt = reportTHCNData.reduce((total, item) => total + item.inOfDate + item.outOfDate, 0);
      const totalInOfDate = reportTHCNData.reduce((total, item) => total + item.inOfDate, 0);
      const totalOutOfDate = reportTHCNData.reduce((total, item) => total + item.outOfDate, 0);

      setNoPhaiThu(totalDebt);
      setNoPhaiThuTrongHan(totalInOfDate);
      setNoPhaiThuQuaHan(totalOutOfDate);
      dispatch(clearState());
    }
  }, [isSuccessPostReportTHCNRaw, reportTHCNData, dispatch]);

  useEffect(() => {
    if (isSuccessPostReportDTBHRaw) {
      const totalRevenue = reportDTBHData.reduce((total, salesperson) => {
        return total + salesperson.ctbans.reduce((innerTotal, sale) => {
          return innerTotal + sale.totalProductValue - sale.totalDiscountValue;
        }, 0);
      }, 0);

      setDoanhThu(totalRevenue);
      dispatch(clearState());
    }
  }, [isSuccessPostReportDTBHRaw, reportDTBHData, dispatch]);

  return (
    <div>
      <p className="font-bold text-xl mt-5">Tình hình tài chính</p>
      <div className="border border-gray-300 w-[600px] p-5 text-xl shadow-xl rounded-lg">
        <div className="w-[560px]">
          <div className="flex justify-between">
            <p>Tổng tiền đã thu</p>
            <p className="font-bold">{VND.format(bank + cash)}</p>
          </div>
          <div className="flex justify-between">
            <p className="pl-8">
              <LocalAtmIcon /> Tiền mặt
            </p>
            <p className="font-bold">{VND.format(cash)}</p>
          </div>
          <div className="flex justify-between">
            <p className="pl-8">
              <AccountBalanceIcon /> Tiền gửi
            </p>
            <p className="font-bold">{VND.format(bank)}</p>
          </div>

          <div className="flex justify-between border-b border-zinc-950 my-2"></div>

          <div className="flex justify-between">
            <p>Nợ phải thu</p>
            <p className="font-bold">{VND.format(noPhaiThu)}</p>
          </div>

          <div className="flex justify-between">
            <p className="pl-8">Trong hạn</p>
            <p className="font-bold">{VND.format(noPhaiThuTrongHan)}</p>
          </div>
          <div className="flex justify-between">
            <p className="pl-8 text-orange-500">Quá hạn</p>
            <p className="font-bold text-orange-500">{VND.format(noPhaiThuQuaHan)}</p>
          </div>

          <div className="flex justify-between border-b border-zinc-950 my-2"></div>

          <div className="flex justify-between">
            <p>Doanh thu</p>
            <p className="font-bold">{VND.format(doanhThu)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinhHinhTaiChinh;