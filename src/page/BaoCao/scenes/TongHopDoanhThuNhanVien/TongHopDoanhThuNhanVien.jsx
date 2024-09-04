import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    Dropdown,
    Space,
    Select,
    Button,
    Modal,
    Form,
    Input,
    message as msg,
    notification,
    DatePicker,
    Typography,
    Tooltip,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import { TfiReload } from "react-icons/tfi";
import { Add } from "@mui/icons-material";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    banHangSelector,
    getListChungTuBan,
    hoaDonSelected,
} from "../../../../store/features/banHangSlice";
import moment from "moment/moment";
import { doiTuongSelector, getListCustomer, getListProduct } from "../../../../store/features/doiTuongSilce";
import { VND, formatDate, selectTime } from "../../../../utils/func";
import { baoCaoSelector, getListCongNo, getListReportDTBH, postReportDTBH, postReportDTBHRaw, clearState, resetData, getListSalesPerson } from './../../../../store/features/baoCaoSlice';
import { useReactToPrint } from "react-to-print";
import { FaRegFilePdf } from "react-icons/fa6";
import InChiTietNoPhaiThu from "../../../../component/InChiTietNoPhaiThu/InChiTietNoPhaiThu";
import { set } from "react-hook-form";
import InTongHopDoanhThuNhanVien from "../../../../component/InTongHopDoanhThuNhanVien/InTongHopDoanhThuNhanVien";
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';

const { Text } = Typography;


const { RangePicker } = DatePicker;
const TongHopDoanhThuNhanVien = ({ checkbox = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formAddReport] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [dataSelected, setDataSelected] = useState({});

    const [messageApi, contextHolderMes] = msg.useMessage();

    const [api, contextHolder] = notification.useNotification();

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const {
        isSuccessGetListCongNo,

        isError,
        message,
        isSuccessPostReportDTBH,
        listCongNo,
        listReportDTBHData,
        reportDTBHData
    } = useSelector(baoCaoSelector);


    const [chungTuBan, setChungTuBan] = useState([]);
    const [dataConvert, setDataConvert] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filterday, setFilterday] = useState([]);
    const [valueRangepicker, setValueRangepicker] = useState([])
    const handleSearch = (value) => {
        setSearchText(value);
    };
    const handleFilterday = (dates) => {
        setValueRangepicker(dates);

        // if (dates && dates.length === 2) {
        //   const startTimestamp = dates[0].valueOf();
        //   const endTimestamp = dates[1].valueOf();
        //   console.log("Start Timestamp:", startTimestamp, typeof (startTimestamp));
        //   console.log("End Timestamp:", endTimestamp, typeof (endTimestamp));
        //   setFilterday([startTimestamp, endTimestamp]);
        //   setValueRangepicker(dates);
        // } else {
        //   setFilterday([]);
        //   setValueRangepicker([]);
        // }
    };

    console.log("reportDTBHData", reportDTBHData)

    useEffect(() => {
        dispatch(resetData());

        const timeRange = selectTime("thisMonth");


        const dataConvert = {
            "startDate": timeRange?.startDate,
            "endDate": timeRange?.endDate,
            "name": "xxx",
            "description": "xxx",
            "salespersonIds": []
        }

        form.setFieldsValue({
            rangePicker: [dayjs(timeRange?.startDate, DATE_FORMAT), dayjs(timeRange?.endDate, DATE_FORMAT)]
        });

        setValueRangepicker([dayjs(timeRange?.startDate, DATE_FORMAT), dayjs(timeRange?.endDate, DATE_FORMAT)]);

        console.log("dataConvert", dataConvert)

        dispatch(postReportDTBHRaw({ values: dataConvert }));
    }, []);

    useEffect(() => {
        if (reportDTBHData) {
            const dataConvertCurrent = reportDTBHData?.map(salesperson => {
                let tong = 0;
                salesperson.ctbans?.forEach(chungTuBanData => {
                    console.log("chungTuBanData", chungTuBanData)
                    tong += chungTuBanData.totalProductValue - chungTuBanData.totalDiscountValue;
                })


                return {
                    id: salesperson?.salesperson?.id,
                    name: salesperson?.salesperson?.name,
                    tong
                }
            })



            console.log("dataConvertCurrent", dataConvertCurrent)
            setDataConvert(dataConvertCurrent);
            setChungTuBan(dataConvertCurrent);
            dispatch(clearState());
        }
    }, [reportDTBHData]);






    useEffect(() => {
        if (isSuccessPostReportDTBH) {
            api.success({
                message: 'Tạo báo cáo thành công!',
                placement: 'bottomLeft',
                duration: 2
            });
            dispatch(clearState());
        }
        else if (isError) {
            api.error({
                message: message,
                placement: "bottomLeft",
                duration: 2,
            });

            dispatch(clearState());
        }
    }, [isError, isSuccessPostReportDTBH]);



    // useEffect(() => {
    //   console.log(searchText);
    //   if (searchText.trim() === "" && filterday.length === 0) {
    //     if (!dataConvert || (Array.isArray(dataConvert) && !dataConvert.length)) {
    //       setChungTuBan([]);
    //     } else {
    //       setChungTuBan(dataConvert);
    //     }
    //   } else {
    //     const filteredData = dataConvert.filter((data) => {
    //       const createdAtMoment = moment(data.createdAt);
    //       return (
    //         data.salesperson.toLowerCase().includes(searchText.toLowerCase()) &&
    //         (!filterday[0] || createdAtMoment.valueOf() >= filterday[0]) &&
    //         (!filterday[1] || createdAtMoment.valueOf() <= filterday[1])
    //       );
    //     });
    //     setChungTuBan(filteredData);
    //   }
    // }, [searchText, dataConvert, filterday]);

    const items = [
        {
            key: "xem",
            label: <Link className="!text-black">Xem</Link>,
        },
        {
            key: "thu-tien",
            label: <Link className="!text-black">Thu tiền</Link>,
        },
    ];

    const handleDropdownItemClick = (e, record) => {
        console.log("e.key", e.key);
        console.log("record", record);
        if (e.key === "xoa") {
            setDataSelected(record);
            setOpen(true);
        } else {
            navigate(`${e.key}/${record.key}`, { state: { id: record.key } });
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    let columns = [
        // {
        //   title: "Khách hàng",
        //   dataIndex: "salesperson",
        //   key: "salesperson",
        //   ellipsis: true,
        // },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
            ellipsis: true,
        },

        {
            title: "Nhân viên bán hàng",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },

        {
            title: "Doanh thu (thuần)",
            dataIndex: "tong",
            key: "tong",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.tong - b.tong,
            sortOrder: sortedInfo.columnKey === "tong" ? sortedInfo.order : null,
        },
        // {
        //   title: "Đã thu",
        //   dataIndex: "dathu",
        //   key: "dathu",
        //   render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

        //   // render: (val, record) => VND.format(val),
        //   sorter: (a, b) => a.dathu - b.dathu,
        //   sortOrder: sortedInfo.columnKey === "dathu" ? sortedInfo.order : null,
        // },
        // {
        //   title: "Chưa thu",
        //   dataIndex: "chuathu",
        //   key: "chuathu",
        //   render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

        //   // render: (val, record) => VND.format(val),
        //   sorter: (a, b) => a.chuathu - b.chuathu,
        //   sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
        // },
        // {
        //   title: "Tình trạng thanh toán",
        //   dataIndex: "paymentStatus",
        //   key: "paymentStatus",
        //   fixed: "right",
        //   render: (val, record) => {
        //     switch (val) {
        //       case "NOT_PAID":
        //         return "Chưa thanh toán";
        //       case "BEING_PAID":
        //         return "Thanh toán 1 phần";
        //       case "PAID":
        //         return "Đã thanh toán";
        //       default:
        //         return "Lỗi";
        //     }
        //   },
        //   filters: [
        //     {
        //       value: "NOT_PAID",
        //       text: "Chưa thanh toán",
        //     },
        //     {
        //       value: "BEING_PAID",
        //       text: "Thanh toán 1 phần",
        //     },
        //     {
        //       value: "PAID",
        //       text: "Đã thanh toán",
        //     },
        //   ],
        //   onFilter: (value, record) => record.paymentStatus.indexOf(value) === 0,
        //   filteredValue: filteredInfo.paymentStatus || null,
        // },
        // {
        //   title: "Tình trạng giao hàng",
        //   dataIndex: "deliveryStatus",
        //   key: "deliveryStatus",
        //   render: (val, record) => {
        //     switch (val) {
        //       case "NOT_DELIVERED":
        //         return "Chưa giao";
        //       case "DELIVERING":
        //         return "Đang giao";
        //       case "DELIVERED":
        //         return "Đã giao đủ";
        //       default:
        //         return "Lỗi";
        //     }
        //   },
        //   filters: [
        //     {
        //       value: "NOT_DELIVERED",
        //       text: "Chưa giao",
        //     },
        //     {
        //       value: "DELIVERING",
        //       text: "Đang giao",
        //     },
        //     {
        //       value: "DELIVERED",
        //       text: "Đã giao đủ",
        //     },
        //   ],
        //   onFilter: (value, record) => record.deliveryStatus.indexOf(value) === 0,
        //   filteredValue: filteredInfo.deliveryStatus || null,
        // },
        // {
        //   title: "Chức năng",
        //   dataIndex: "chucnang",
        //   fixed: "right",
        //   width: "10%",
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <Dropdown
        //         menu={{
        //           onClick: (e) => handleDropdownItemClick(e, record),
        //           items: items,
        //         }}
        //       >
        //         <Link
        //           to={`xem/${record.key}`}
        //           state={{ id: record.key }}
        //           className="!text-black"
        //         >
        //           Xem
        //           <DownOutlined />
        //         </Link>
        //       </Dropdown>
        //     </Space>
        //   ),
        // },
    ];

    if (checkbox) {
        columns = columns.filter(item => item.dataIndex !== "chucnang");
    }

    // useEffect(() => {
    //   if (isErrorHoaDonSelected) {
    //     api.error({
    //       message: "Chỉ thu tiền các hóa đơn của 1 khách hàng!",
    //       placement: "bottomLeft",
    //       duration: 2,
    //     });

    //     dispatch(clearState());
    //   } 
    // }, [isErrorHoaDonSelected]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRows.length >= 2 && selectedRows[0].donBanHang.salesperson.id === selectedRows[selectedRows.length - 1].donBanHang.salesperson.id) {
                setSelectedRowKeys(selectedRowKeys);
                dispatch(hoaDonSelected(selectedRows));
            }
            else if (selectedRows.length === 1) {
                setSelectedRowKeys(selectedRowKeys);
                dispatch(hoaDonSelected(selectedRows));
            }
            else if (selectedRows.length === 0) {
                setSelectedRowKeys([]);
                dispatch(hoaDonSelected([]));
            }
            else {
                api.error({
                    message: "Chỉ thu tiền các hóa đơn của 1 khách hàng!",
                    placement: "bottomLeft",
                    duration: 2,
                });
            }

            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
        },
    };

    // const onSelectChange = (newSelectedRowKeys) => {
    //   console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    //   setSelectedRowKeys(newSelectedRowKeys);
    // };

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        const dataConvert = {
            "startDate": formatDate(values.rangePicker[0].$d),
            "endDate": formatDate(values.rangePicker[1].$d),
            "name": "xxx",
            "description": "xxx",
            "salespersonIds": values?.listSalesperson ? [...values?.listSalesperson] : []
        }

        console.log("dataConvert", dataConvert)
        dispatch(postReportDTBHRaw({ values: dataConvert }));

    };

    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('onChange params', pagination, filters, sorter, extra);
        console.log("onChange params pagination", pagination);
        console.log("onChange params filters", filters);
        console.log("onChange params sorter", sorter);
        console.log("onChange params extra", extra);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    //Xuat file pdf, in file
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    //select salesperson
    const {
        listSalesPersonData,
    } = useSelector(baoCaoSelector);

    useEffect(() => {
        dispatch(getListSalesPerson());
    }, []);


    const options = [];
    useEffect(() => {
        if (listSalesPersonData.length !== 0) {
            listSalesPersonData.forEach(salesperson => {
                options.push({
                    key: salesperson.id,
                    value: salesperson.id,
                    label: salesperson.name,
                });
            })
        }
    }, [listSalesPersonData]);

    const sharedProps = {
        mode: 'multiple',
        style: {
            width: '100%',
        },
        // options,
        placeholder: 'Chọn nhân viên bán hàng',
        maxTagCount: 'responsive',
    };



    //add report

    const [listSalesperson, setListSalesperson] = useState([]);

    const onFinishAddReport = (values) => {
        console.log('Received values of form: ', values);
        // dispatch(postReportDTBH({ values }));

        const dataConvert = {
            "startDate": formatDate(valueRangepicker[0].$d),
            "endDate": formatDate(valueRangepicker[1].$d),
            "name": values.name,
            "description": values.description,
            "salespersonIds": listSalesperson ? [...listSalesperson] : []
        }

        console.log("dataConvert", dataConvert)

        dispatch(postReportDTBH({ values: dataConvert }));
        // formAddReport.resetFields();
    };


    return (
        <div className="m-4">
            <div className={`px-[20px] w-full flex justify-between pb-7 ${!checkbox && "bg-white py-7"}`}>
                <div className="flex gap-[5px] items-center">
                    <Form form={form} layout="inline" onFinish={onFinish}>
                        <Form.Item name="rangePicker" className="w-[300px] !me-0"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <RangePicker
                                onChange={(dates) => handleFilterday(dates)}

                            />

                        </Form.Item>
                        <Form.Item name="listSalesperson" className="w-[300px] !me-0">
                           
                            <Select
                                mode="tags"
                                style={{
                                    width: '100%',
                                    // height: '31.6px'
                                }}
                                {...sharedProps}
                                tokenSeparators={[',']}
                                onChange={(values) => setListSalesperson(values)}
                            >
                                {
                                    listSalesPersonData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Button
                            className="!bg-[#FAFAFA] font-bold m-0 p-0 w-[32px] h-[32px] flex justify-center items-center rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md"
                            htmlType="submit"
                        >
                            <MdOutlineSearch size={20} color="#898989" />
                        </Button>
                    </Form>

                    {contextHolderMes}
                    {contextHolder}

                    <FaRegFilePdf
                        title="Xuất file pdf"
                        onClick={handlePrint}
                        size={30}
                        className="p-2 bg-white border border-black cursor-pointer self-start"
                    />
                    <TfiReload
                        title="Cập nhật dữ liệu"
                        size={30}
                        className="p-2 bg-white border border-black cursor-pointer self-start"
                        onClick={() => {
                            // dispatch(getListChungTuBan());
                            // messageApi.open({
                            //   key: "updatable",
                            //   type: "loading",
                            //   content: "Loading...",
                            // });
                            form.resetFields();
                            clearAll();
                            // setValueRangepicker([]);
                            // setFilterday([]);
                            setSelectedRowKeys([]);
                            setChungTuBan([]);
                            // setSearchText("");
                        }}
                    />
                </div>

                
                <Modal
                    title="LƯU BÁO CÁO"
                    centered
                    open={open}
                    width={700}
                    footer=""
                    onCancel={handleCancel}
                >
                    <Form
                        form={formAddReport}
                        layout='horizontal'
                        onFinish={onFinishAddReport}
                        labelCol={{
                            flex: '200px',
                        }}
                        labelAlign="left"
                        className='mt-4'
                    >
                        <Form.Item
                            label="Tên báo cáo"
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name='description'
                        >
                            <Input
                            />
                        </Form.Item>

                        <Form.Item className='flex justify-end gap-2 mt-6 mb-0'>

                            <Button
                                className='bg-[#FF7742] font-bold text-white mr-2'
                                htmlType="reset"
                                onClick={() => setOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className='!bg-[#67CDBB] font-bold text-white'
                                htmlType="submit"
                                onClick={() => setOpen(false)}
                            >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            {chungTuBan.length !== 0 && <Table
                columns={columns}
                dataSource={chungTuBan}
                onChange={onChange}
                scroll={{
                    x: 1300,
                }}
                className="overflow-x-visible	overflow-y-visible mb-3"

                pagination={false}
                bordered
                summary={(pageData) => {
                    let totalTong = 0;
                    let totalDoanhThu = 0;
                    let totalChuaThu = 0;
                    pageData.forEach(({ tong, doanhthu, chuathu }) => {
                        totalTong += tong;
                        totalDoanhThu += doanhthu;
                        totalChuaThu += chuathu;
                    });
                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={1} colSpan={2}>Tổng</Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Text className="font-medium">{VND.format(totalTong)}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />}


            <div
                className='hidden'
            >
                <div ref={componentRef}>
                    <InTongHopDoanhThuNhanVien
                        form={form}
                        // components={components}
                        dataSource={chungTuBan}
                        columns={columns}
                        dates={valueRangepicker || [{ $d: new Date(selectTime("thisMonth")?.startDate) }, { $d: new Date(selectTime("thisMonth")?.endDate) }]}
                    // idHoaDon={chungTuBanData?.id}
                    // idCustomer={chungTuBanData?.donBanHang?.salesperson?.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default TongHopDoanhThuNhanVien;
