import React, { useEffect, useState } from 'react'
import { VND, selectTime } from '../../utils/func'
import { Select } from 'antd'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { useDispatch, useSelector } from 'react-redux';
import { banHangSelector, getListPhieuThuTienGui, getListPhieuThuTienMat } from '../../store/features/banHangSlice';
import { clearState, postReportDTBHRaw, postReportTHCNRaw, tongQuanSelector } from '../../store/features/tongQuanSlice';

const TinhHinhTaiChinh = () => {
    const dispatch = useDispatch();


    const [bank, setBank] = useState(0);
    const [cash, setCash] = useState(0);
    const [noPhaiThu, setNoPhaiThu] = useState(0);
    const [noPhaiThuTrongHan, setNoPhaiThuTrongHan] = useState(0);
    const [noPhaiThuQuaHan, setNoPhaiThuQuaHan] = useState(0);
    const [doanhThu, setDoanhThu] = useState(0);

    const {
        isSuccessGetListPhieuThuTienMat,
        isSuccessPostPhieuThuTienMat,

        isError,
        message,

        listPhieuThuTienMatData,

        isSuccessGetListPhieuThuTienGui,
        isSuccessPostPhieuThuTienGui,

        listPhieuThuTienGuiData,

        // phieuThuTienMatData,
    } = useSelector(banHangSelector);

    // useEffect(() => {
    //     dispatch(getListPhieuThuTienMat());
    //     dispatch(getListPhieuThuTienGui());
    // }, []);

    useEffect(() => {
        if (isSuccessGetListPhieuThuTienMat) {
            // let tong = 0;
            // listPhieuThuTienMatData.forEach(phieuThuTienMatData => {
            //     console.log("phieuThuTienMatData", phieuThuTienMatData)
            //     tong += phieuThuTienMatData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
            //         return total + currentValue;
            //     }, 0)
            // })

            // setCash(tong);
            // dispatch(clearState());


            const timeRange = selectTime('thisMonth');

            const dataCash = listPhieuThuTienMatData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
            let cashTotal = 0;
            dataCash.forEach(phieuThuTienMatData => {
                console.log("phieuThuTienMatData", phieuThuTienMatData)
                cashTotal += phieuThuTienMatData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })

            setCash(cashTotal);

        }
    }, [
        isSuccessGetListPhieuThuTienMat,
    ]);

    useEffect(() => {
        if (isSuccessGetListPhieuThuTienGui) {
            // let tong = 0;
            // listPhieuThuTienGuiData.forEach(phieuThuTienGuiData => {
            //     console.log("phieuThuTienGuiData", phieuThuTienGuiData)
            //     tong += phieuThuTienGuiData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
            //         return total + currentValue;
            //     }, 0)
            // })
            // setBank(tong);
            // dispatch(clearState());

            const timeRange = selectTime('thisMonth');

            const dataBank = listPhieuThuTienGuiData?.filter(phieuThuTienGuiData => new Date(phieuThuTienGuiData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienGuiData?.createdAt) < new Date(timeRange.endDate))

            let bankTotal = 0;
            dataBank.forEach(phieuThuTienGuiData => {
                console.log("phieuThuTienGuiData", phieuThuTienGuiData)
                bankTotal += phieuThuTienGuiData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })
            setBank(bankTotal);
        }
    }, [
        isSuccessGetListPhieuThuTienGui,
    ]);


    useEffect(() => {
        const timeRange = selectTime('thisMonth');

        const dataConvert = {
            ...timeRange,
            "name": "xxx",
            "description": "xxx",
            "customerIds": []
        }

        dispatch(postReportTHCNRaw({ values: dataConvert }));

        const dataConvert2 = {
            ...timeRange,
            "name": "xxx",
            "description": "xxx",
            "salespersonIds": []
        }
        dispatch(postReportDTBHRaw({ values: dataConvert2 }));


    }, []);

    const {
        reportTHCNData,
        isSuccessPostReportTHCNRaw,
        reportDTBHData,
        isSuccessPostReportDTBHRaw
    } = useSelector(tongQuanSelector);

    useEffect(() => {
        if (isSuccessPostReportTHCNRaw) {
            let tong = reportTHCNData?.map(pt => pt.inOfDate).reduce((total, currentValue) => {
                return total + currentValue;
            }, 0)
                +
                reportTHCNData?.map(pt => pt.outOfDate).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
                ;

            let noTrongHan = reportTHCNData?.map(pt => pt.inOfDate).reduce((total, currentValue) => {
                return total + currentValue;
            }, 0)

            let noQuaHan = reportTHCNData?.map(pt => pt.outOfDate).reduce((total, currentValue) => {
                return total + currentValue;
            }, 0)


            setNoPhaiThu(tong);
            setNoPhaiThuTrongHan(noTrongHan);
            setNoPhaiThuQuaHan(noQuaHan);
            dispatch(clearState());
        }
    }, [
        isSuccessPostReportTHCNRaw,
    ]);


    useEffect(() => {
        if (isSuccessPostReportDTBHRaw) {
            let doanhThuBanHang = 0;

            const dataConvertCurrent = reportDTBHData?.map(salesperson => {
                let tong = 0;
                salesperson.ctbans?.forEach(chungTuBanData => {
                    console.log("chungTuBanData", chungTuBanData)
                    tong += chungTuBanData.totalProductValue - chungTuBanData.totalDiscountValue;
                })


                return {
                    tong
                }
            })

            doanhThuBanHang = dataConvertCurrent?.map(item => item?.tong)?.reduce((total, currentValue) => {
                return total + currentValue;
            }, 0)


            setDoanhThu(doanhThuBanHang);
            dispatch(clearState());
        }
    }, [
        isSuccessPostReportDTBHRaw,
    ]);



    const handleChange = (value) => {
        if (value === "current") {
            let cashTotal = 0;
            listPhieuThuTienMatData.forEach(phieuThuTienMatData => {
                console.log("phieuThuTienMatData", phieuThuTienMatData)
                cashTotal += phieuThuTienMatData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })

            setCash(cashTotal);


            let bankTotal = 0;
            listPhieuThuTienGuiData.forEach(phieuThuTienGuiData => {
                console.log("phieuThuTienGuiData", phieuThuTienGuiData)
                bankTotal += phieuThuTienGuiData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })
            setBank(bankTotal);

            //nophaithu
            const dataConvert = {
                "startDate": "2020-01-01",
                "endDate": "2025-01-01",
                "name": "xxx",
                "description": "xxx",
                "customerIds": []
            }

            dispatch(postReportTHCNRaw({ values: dataConvert }));


            //doanhthu
            const dataConvert2 = {
                "startDate": "2020-01-01",
                "endDate": "2025-01-01",
                "name": "xxx",
                "description": "xxx",
                "salespersonIds": []
            }
            dispatch(postReportDTBHRaw({ values: dataConvert2 }));
        }
        else {
            const timeRange = selectTime(value);

            const dataCash = listPhieuThuTienMatData?.filter(phieuThuTienMatData => new Date(phieuThuTienMatData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienMatData?.createdAt) < new Date(timeRange.endDate))
            let cashTotal = 0;
            dataCash.forEach(phieuThuTienMatData => {
                console.log("phieuThuTienMatData", phieuThuTienMatData)
                cashTotal += phieuThuTienMatData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })

            setCash(cashTotal);

            const dataBank = listPhieuThuTienGuiData?.filter(phieuThuTienGuiData => new Date(phieuThuTienGuiData?.createdAt) > new Date(timeRange.startDate) && new Date(phieuThuTienGuiData?.createdAt) < new Date(timeRange.endDate))

            let bankTotal = 0;
            dataBank.forEach(phieuThuTienGuiData => {
                console.log("phieuThuTienGuiData", phieuThuTienGuiData)
                bankTotal += phieuThuTienGuiData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
                    return total + currentValue;
                }, 0)
            })
            setBank(bankTotal);

            //nophaithu

            const dataConvert = {
                ...timeRange,
                "name": "xxx",
                "description": "xxx",
                "customerIds": []
            }

            dispatch(postReportTHCNRaw({ values: dataConvert }));


            //doanhthu

            const dataConvert2 = {
                ...timeRange,
                "name": "xxx",
                "description": "xxx",
                "salespersonIds": []
            }

            console.log("dataConvert", dataConvert2)
            dispatch(postReportDTBHRaw({ values: dataConvert2 }));
        }
    }
    return (
        <div>
            <p className="font-bold text-xl mt-5">Tình hình tài chính</p>
            <Select
                defaultValue={'thisMonth'}
                style={{
                    width: 120,

                }}
                className="bg-[#FFF6D8]"
                onChange={handleChange}
                options={[
                    {
                        value: 'current',
                        label: 'Hiện tại',
                    },
                    {
                        value: 'thisWeek',
                        label: 'Tuần này',
                    },
                    {
                        value: 'lastWeek',
                        label: 'Tuần trước',
                    },
                    {
                        value: 'thisMonth',
                        label: 'Tháng này',
                    },
                    {
                        value: 'lastMonth',
                        label: 'Tháng trước',
                    },
                    {
                        value: 'thisQuarter',
                        label: 'Quý này',
                    },
                    {
                        value: 'lastQuarter',
                        label: 'Quý trước',
                    },
                    {
                        value: 'Q1',
                        label: 'Quý 1',
                    },
                    {
                        value: 'Q2',
                        label: 'Quý 2',
                    },
                    {
                        value: 'Q3',
                        label: 'Quý 3',
                    },
                    {
                        value: 'Q4',
                        label: 'Quý 4',
                    },
                    {
                        value: 'thisYear',
                        label: 'Năm nay',
                    },
                    {
                        value: 'lastYear',
                        label: 'Năm trước',
                    },
                ]}
            />
            <div className="border border-gray-300 w-[600px] p-5 text-xl shadow-xl rounded-lg">
                <div className='w-[560px]'>
                    <div className='flex justify-between'>
                        <p>Tổng tiền đã thu</p>
                        <p className="font-bold">
                            {
                                VND.format(bank + cash)
                            }
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8">
                            < LocalAtmIcon /> Tiền mặt
                        </p>
                        <p className="font-bold">
                            {
                                VND.format(cash)
                            }
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8">
                            <AccountBalanceIcon /> Tiền gửi
                        </p>
                        <p className="font-bold">
                            {
                                VND.format(bank)
                            }
                        </p>
                    </div>

                    <div className='flex justify-between border-b border-zinc-950 my-2'></div>

                    <div className='flex justify-between'>
                        <p>Nợ phải thu</p>
                        <p className="font-bold">
                            {
                                VND.format(noPhaiThu)
                            }
                        </p>
                    </div>

                    <div className='flex justify-between'>
                        <p className="pl-8">
                            Trong hạn
                        </p>
                        <p className="font-bold">
                            {
                                VND.format(noPhaiThuTrongHan)
                            }
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="pl-8 text-orange-500">
                            Quá hạn
                        </p>
                        <p className="font-bold text-orange-500">
                            {
                                VND.format(noPhaiThuQuaHan)
                            }
                        </p>
                    </div>

                    <div className='flex justify-between border-b border-zinc-950 my-2'></div>


                    <div className='flex justify-between'>
                        <p>Doanh thu</p>
                        <p className="font-bold">
                            {
                                VND.format(doanhThu)
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TinhHinhTaiChinh