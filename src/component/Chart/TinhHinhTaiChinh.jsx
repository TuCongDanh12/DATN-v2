import React, { useEffect, useState } from 'react'
import { VND, selectTime } from '../../utils/func'
import { Select } from 'antd'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import tongQuanService from '../../services/tongQuan.service';

const TinhHinhTaiChinh = () => {
    const [bank, setBank] = useState(0);
    const [cash, setCash] = useState(0);
    const [noPhaiThu, setNoPhaiThu] = useState(0);
    const [noPhaiThuTrongHan, setNoPhaiThuTrongHan] = useState(0);
    const [noPhaiThuQuaHan, setNoPhaiThuQuaHan] = useState(0);
    const [doanhThu, setDoanhThu] = useState(0);
    const [financialData, setFinancialData] = useState({
        noPhaiTra: 0,
        tongTienDaTra: 0,
        chiPhi: 0,
    });

    const fetchCashData = async (timeRange) => {
        try {
            const response = await tongQuanService.getListPhieuThuTienMat();
            const dataCash = response.data?.filter(item => new Date(item.createdAt) > new Date(timeRange.startDate) && new Date(item.createdAt) < new Date(timeRange.endDate));
            let cashTotal = 0;
            dataCash.forEach(item => {
                cashTotal += item?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => total + currentValue, 0);
            });
            setCash(cashTotal);
        } catch (error) {
            console.error('Error fetching cash data:', error);
        }
    };

    const fetchBankData = async (timeRange) => {
        try {
            const response = await tongQuanService.getListPhieuThuTienGui();
            const dataBank = response.data?.filter(item => new Date(item.createdAt) > new Date(timeRange.startDate) && new Date(item.createdAt) < new Date(timeRange.endDate));
            let bankTotal = 0;
            dataBank.forEach(item => {
                bankTotal += item?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => total + currentValue, 0);
            });
            setBank(bankTotal);
        } catch (error) {
            console.error('Error fetching bank data:', error);
        }
    };

    const fetchNoPhaiThuData = async (timeRange) => {
        try {
            const dataConvert = {
                ...timeRange,
                "name": "xxx",
                "description": "xxx",
                "customerIds": []
            };
            const response = await tongQuanService.postReportTHCNRaw({ values: dataConvert });
            const reportTHCNData = response.data;

            let tong = reportTHCNData?.map(pt => pt.inOfDate).reduce((total, currentValue) => total + currentValue, 0) +
                reportTHCNData?.map(pt => pt.outOfDate).reduce((total, currentValue) => total + currentValue, 0);

            let noTrongHan = reportTHCNData?.map(pt => pt.inOfDate).reduce((total, currentValue) => total + currentValue, 0);
            let noQuaHan = reportTHCNData?.map(pt => pt.outOfDate).reduce((total, currentValue) => total + currentValue, 0);

            setNoPhaiThu(tong);
            setNoPhaiThuTrongHan(noTrongHan);
            setNoPhaiThuQuaHan(noQuaHan);
        } catch (error) {
            console.error('Error fetching no phai thu data:', error);
        }
    };

    const fetchDoanhThuData = async (timeRange) => {
        try {
            const dataConvert2 = {
                ...timeRange,
                "name": "xxx",
                "description": "xxx",
                "salespersonIds": []
            };
            const response = await tongQuanService.postReportDTBHRaw({ values: dataConvert2 });
            const reportDTBHData = response.data;

            let doanhThuBanHang = reportDTBHData?.map(salesperson => {
                let tong = 0;
                salesperson.ctbans?.forEach(chungTuBanData => {
                    tong += chungTuBanData.totalProductValue - chungTuBanData.totalDiscountValue;
                });
                return tong;
            }).reduce((total, currentValue) => total + currentValue, 0);

            setDoanhThu(doanhThuBanHang);
        } catch (error) {
            console.error('Error fetching doanh thu data:', error);
        }
    };

    const fetchChiPhiData = async (timeRange) => {
        try {
            // Kiểm tra xem timeRange.startDate có tồn tại trước khi gọi split
            console.log('timeRange', timeRange)
            const year = timeRange.year;
            const month = timeRange.month;
    
            let response;
            if (month) {
                response = await tongQuanService.getMuaHangChartRevenueMonth({ values: { year, month } });
            } else if (timeRange.quarter) {
                response = await tongQuanService.getMuaHangChartRevenueQuarter({ values: { year, quarter: timeRange.quarter } });
            } else {
                response = await tongQuanService.getMuaHangChartRevenueYear({ values: { year } });
            }
    
            const ctmua = response.data.result.data;
    
            const tongNoPhaiTra = ctmua.reduce((total, item) => total + (item.finalValue - item.paidValue), 0);
            const tongTienDaTra = ctmua.reduce((total, item) => total + item.paidValue, 0);
            const tongChiPhi = ctmua.reduce((total, item) => total + item.finalValue, 0);
    
            setFinancialData({
                noPhaiTra: tongNoPhaiTra,
                tongTienDaTra: tongTienDaTra,
                chiPhi: tongChiPhi,
            });
        } catch (error) {
            console.error('Error fetching chi phi data:', error);
        }
    };
    

    const handleChange = (value) => {
        const currentDate = new Date();
        let year = currentDate.getFullYear(); // Năm hiện tại
        let month = currentDate.getMonth() + 1; // Tháng hiện tại (lưu ý: getMonth() trả về giá trị từ 0-11)
        let quarter = null;
    
        switch (value) {
            case "thisYear":
                fetchCashData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchBankData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchNoPhaiThuData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchDoanhThuData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchChiPhiData({ year });
                break;
    
            case "lastYear":
                year -= 1; 
                fetchCashData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchBankData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchNoPhaiThuData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchDoanhThuData({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
                fetchChiPhiData({ year });
                break;
    
            case "thisMonth":
                fetchCashData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchBankData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchNoPhaiThuData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchDoanhThuData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchChiPhiData({ year, month });
                break;
    
            case "lastMonth":
                if (month === 1) {
                    month = 12; 
                    year -= 1;
                } else {
                    month -= 1; 
                }
                fetchCashData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchBankData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchNoPhaiThuData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchDoanhThuData({ startDate: `${year}-${month}-01`, endDate: `${year}-${month}-31` });
                fetchChiPhiData({ year, month });
                break;
    
            case "thisQuarter":
                quarter = Math.floor((month - 1) / 3) + 1; 
                handleQuarter(year, quarter);
                break;
    
            case "lastQuarter":
                quarter = Math.floor((month - 1) / 3); 
                if (quarter === 0) {
                    quarter = 4;
                    year -= 1;
                }
                handleQuarter(year, quarter);
                break;
    
            case "Q1":
            case "Q2":
            case "Q3":
            case "Q4":
                quarter = parseInt(value.replace("Q", ""), 10); 
                handleQuarter(year, quarter);
                break;
    
            default:
                console.error("Invalid option selected");
        }
    };
    
    const handleQuarter = (year, quarter) => {
        let startMonth = (quarter - 1) * 3 + 1;
        let endMonth = startMonth + 2;
        const startDate = `${year}-${startMonth.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${endMonth.toString().padStart(2, '0')}-31`;
    
        fetchCashData({ startDate, endDate });
        fetchBankData({ startDate, endDate });
        fetchNoPhaiThuData({ startDate, endDate });
        fetchDoanhThuData({ startDate, endDate });
        fetchChiPhiData({ year, quarter });
    };
    
    useEffect(() => {
        handleChange('thisMonth'); 
    }, []);

    useEffect(() => {
        console.log('Financial Data Updated:', financialData);
        // Logic you want to execute when financialData updates
    }, [financialData]);

    return (
        <div>
            <p className="font-bold text-xl mt-5">Tình hình tài chính</p>
            <Select
                defaultValue={'thisMonth'}
                style={{ width: 120 }}
                className="bg-[#FFF6D8]"
                onChange={handleChange}
                options={[
                    { value: 'thisMonth', label: 'Tháng này' },
                    { value: 'lastMonth', label: 'Tháng trước' },
                    { value: 'thisQuarter', label: 'Quý này' },
                    { value: 'lastQuarter', label: 'Quý trước' },
                    { value: 'Q1', label: 'Quý 1' },
                    { value: 'Q2', label: 'Quý 2' },
                    { value: 'Q3', label: 'Quý 3' },
                    { value: 'Q4', label: 'Quý 4' },
                    { value: 'thisYear', label: 'Năm nay' },
                    { value: 'lastYear', label: 'Năm trước' },
                ]}
            />
            <div className="border border-gray-300 w-[600px] p-5 text-xl shadow-xl rounded-lg">
                <div className='w-[560px]'>
                    <div className='flex justify-between'>
                        <p>Tổng tiền đã thu</p>
                        <p className="font-bold">
                            {VND.format(bank + cash)}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8">
                            <LocalAtmIcon /> Tiền mặt
                        </p>
                        <p className="font-bold">
                            {VND.format(cash)}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8">
                            <AccountBalanceIcon /> Tiền gửi
                        </p>
                        <p className="font-bold">
                            {VND.format(bank)}
                        </p>
                    </div>
                    <div className='flex justify-between border-b border-zinc-950 my-2'></div>

                    <div className='flex justify-between'>
                        <p>Nợ phải thu</p>
                        <p className="font-bold">
                            {VND.format(noPhaiThu)}
                        </p>
                    </div>

                    <div className='flex justify-between'>
                        <p className="pl-8">
                            Trong hạn
                        </p>
                        <p className="font-bold">
                            {VND.format(noPhaiThuTrongHan)}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8 text-orange-500">
                            Quá hạn
                        </p>
                        <p className="font-bold text-orange-500">
                            {VND.format(noPhaiThuQuaHan)}
                        </p>
                    </div>

                    <div className='flex justify-between border-b border-zinc-950 my-2'></div>

                    <div className='flex justify-between'>
                        <p>Chi phí</p>
                        <p className="font-bold">
                            {VND.format(financialData.chiPhi)}
                        </p>
                    </div>

                    <div className='flex justify-between'>
                        <p className="pl-8">
                            Nợ phải trả
                        </p>
                        <p className="font-bold">
                            {VND.format(financialData.noPhaiTra)}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8">
                            Tổng tiền đã trả
                        </p>
                        <p className="font-bold">
                            {VND.format(financialData.tongTienDaTra)}
                        </p>
                    </div>

                    <div className='flex justify-between border-b border-zinc-950 my-2'></div>

                    <div className='flex justify-between'>
                        <p>Doanh thu</p>
                        <p className="font-bold">
                            {VND.format(doanhThu)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TinhHinhTaiChinh;
