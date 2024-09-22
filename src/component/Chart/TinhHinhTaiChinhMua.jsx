import React, { useEffect, useState } from 'react';
import { VND } from '../../utils/func';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import muahangService from '../../services/muahang.service';

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

const TinhHinhTaiChinhMua = ({ timeRange }) => {
  const [cash, setCash] = useState(0);
  const [bank, setBank] = useState(0);
  const [noPhaiThu, setNoPhaiThu] = useState(0);
  const [noPhaiThuTrongHan, setNoPhaiThuTrongHan] = useState(0);
  const [noPhaiThuQuaHan, setNoPhaiThuQuaHan] = useState(0);
  const [doanhThu, setDoanhThu] = useState(0);
  const [ctmua, setCtmua] = useState([]);
  const [acc,setAcc] = useState(0)

  useEffect(() => {
    const getCtmua = async () => {
      try {
        const res = await muahangService.getListChungTuMua();
        // console.log('ctmua', res.data.result.data);
        setCtmua(res.data.result.data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };
    getCtmua();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);

        // Tính tổng tiền gửi
        const responseTienGui = await muahangService.getListPhieuChiTienGuiByDate({ startDate, endDate });
        // console.log('Phiếu chi tiền gửi', responseTienGui?.data?.result?.data);
        const totalBank = responseTienGui?.data?.result?.data.reduce((acc, item) => acc + item.chungTu.reduce((sum, ct) => sum + ct.money, 0), 0);
        setBank(totalBank || 0);

        // Tính tổng tiền mặt
        const responseTienMat = await muahangService.getListPhieuChiTienMatByDate({ startDate, endDate });
        // console.log('Phiếu chi tiền mặt', responseTienMat?.data?.result?.data);
        const totalCash = responseTienMat?.data?.result?.data.reduce((acc, item) => acc + item.chungTu.reduce((sum, ct) => sum + ct.money, 0), 0);
        setCash(totalCash || 0);

        // Tính tổng nợ phải thu
        const noPhaiThuData = ctmua.reduce(
          (acc, item) => {
            const paymentTerm = new Date(item.paymentTerm);
            const endDateObject = new Date(endDate);

            if (paymentTerm <= endDateObject && item.paidValue < item.finalValue) {
              acc.quaHan += item.finalValue - item.paidValue;
            } else if (paymentTerm > endDateObject) {
              acc.trongHan += item.finalValue - item.paidValue;
            }
            setAcc(acc)
            return acc;
          },
          { quaHan: 0, trongHan: 0 }
        );

        setNoPhaiThuTrongHan(noPhaiThuData.trongHan);
        setNoPhaiThuQuaHan(noPhaiThuData.quaHan);

        // Tính tổng doanh thu (Chi phí)
        setDoanhThu(totalCash + totalBank + acc); // Doanh thu có thể là tổng chi phí hoặc tổng tiền đã trả

      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [timeRange, ctmua]); // Thêm ctmua vào dependencies để tính toán khi dữ liệu thay đổi

  return (
    <div>
      <p className="font-bold text-xl mt-5">Tình hình tài chính</p>
      <div className="border border-gray-300 w-[600px] p-5 text-xl shadow-xl rounded-lg">
        <div className="w-[560px]">
          <div className="flex justify-between">
            <p>Tổng tiền đã trả</p>
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
            <p>Nợ phải trả</p>
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
            <p>Chi phí</p>
            <p className="font-bold">{VND.format(doanhThu)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinhHinhTaiChinhMua;
