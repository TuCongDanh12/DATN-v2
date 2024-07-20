import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import moment from "moment/moment";
import { useReactToPrint } from "react-to-print";
import { FaRegFilePdf } from "react-icons/fa6";
import { set } from "react-hook-form";
import { clearState, congNoSelector, getListReportDCCN, getReportDCCN, postReportDCCN, postReportDCCNRaw } from "../../../../../../store/features/congNoSlice";
import { VND, formatDate } from "../../../../../../utils/func";
import { doiTuongSelector, getListCustomer } from "../../../../../../store/features/doiTuongSilce";
import InChiTietNoPhaiThu from "../../../../../../component/InChiTietNoPhaiThu/InChiTietNoPhaiThu";
const { Text } = Typography;


const { RangePicker } = DatePicker;
const ReportDCCN = ({ checkbox = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

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
        isSuccessPostReportDCCN,
        listCongNo,
        listReportDCCNData,
        reportDCCNData,
        description
    } = useSelector(congNoSelector);


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

    console.log("reportDCCNData", reportDCCNData)

    useEffect(() => {
        if (reportDCCNData) {
            const dataConvertCurrent = reportDCCNData?.map(customer => {
                return customer?.reportDccnCustomerDetails?.map(chungTuBanData => {
                    console.log("chungTuBanData", chungTuBanData)

                    let tong = chungTuBanData.collected + chungTuBanData.notCollected;

                    // let tong = 0;
                    // chungTuBanData.productOfCtban.forEach(productOfCt => {
                    //   tong += productOfCt.count * productOfCt.price;
                    //   tong += productOfCt.count * productOfCt.price * (productOfCt.product.productGroup.tax / 100);
                    // })
                    //continue ...
                    let dathu = chungTuBanData.collected;

                    let chuathu = chungTuBanData.notCollected;

                    return {
                        ...chungTuBanData?.ctban,
                        sohoadon: chungTuBanData?.ctban?.id,
                        makhachhang: customer?.customer?.id,
                        customer: customer?.customer?.name,
                        tong,
                        dathu,
                        chuathu
                    }
                })
            })



            console.log("dataConvertCurrent", dataConvertCurrent)
            setDataConvert(dataConvertCurrent);
            setChungTuBan(dataConvertCurrent);
            dispatch(clearState());
        }
    }, [reportDCCNData]);






    useEffect(() => {
        if (isSuccessPostReportDCCN) {
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
    }, [isError, isSuccessPostReportDCCN]);



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
    //         data.customer.toLowerCase().includes(searchText.toLowerCase()) &&
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
        //   dataIndex: "customer",
        //   key: "customer",
        //   ellipsis: true,
        // },
        {
            title: "ID hóa đơn",
            dataIndex: "sohoadon",
            key: "sohoadon",
            render: (val, record) => <span
                onClick={() => {
                    // navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`, { state: { id: selectedRowKeys } });
                    navigate(`/ban-hang/hoa-don-ban-hang/xem/${val}`, { state: { id: val } });
                }}
                className={`cursor-pointer font-medium text-[#1DA1F2] ${new Date(record.paymentTerm) < new Date() ? "" : ""}`}>{val}</span>,
            sorter: (a, b) => a.sohoadon - b.sohoadon,
            sortOrder: sortedInfo.columnKey === "sohoadon" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: "Ngày hóa đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#d44950] font-medium" : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,
            sorter: (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt),

                // moment(a.createdAt, "DD-MM-YYYY") - moment(b.createdAt, "DD-MM-YYYY"),
            sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
            // fixed: 'left',
        },

        {
            title: "Hạn thanh toán",
            dataIndex: "paymentTerm",
            key: "paymentTerm",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#d44950] font-medium" : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,
            sorter: (a, b) =>
        new Date(a.paymentTerm) - new Date(b.paymentTerm),

                // moment(a.paymentTerm, "DD-MM-YYYY") - moment(b.paymentTerm, "DD-MM-YYYY"),
            sortOrder: sortedInfo.columnKey === "paymentTerm" ? sortedInfo.order : null,
            // fixed: 'left',
        },
        // {
        //   title: "Nội dung",
        //   dataIndex: "content",
        //   key: "content",
        //   ellipsis: true,
        // },
        {
            title: "Giá trị hóa đơn",
            dataIndex: "tong",
            key: "tong",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#d44950] font-medium" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.tong - b.tong,
            sortOrder: sortedInfo.columnKey === "tong" ? sortedInfo.order : null,
        },
        {
            title: "Đã thu",
            dataIndex: "dathu",
            key: "dathu",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#d44950] font-medium" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.dathu - b.dathu,
            sortOrder: sortedInfo.columnKey === "dathu" ? sortedInfo.order : null,
        },
        {
            title: "Chưa thu",
            dataIndex: "chuathu",
            key: "chuathu",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#d44950] font-medium" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.chuathu - b.chuathu,
            sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
        },
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
            "customerIds": values?.listCustomer ? [...values?.listCustomer] : []
        }

        console.log("dataConvert", dataConvert)
        dispatch(postReportDCCNRaw({ values: dataConvert }));

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


    //select customer
    const {
        listCustomerData,
    } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getReportDCCN({ id: params.id }));
    }, []);


    const options = [];
    // useEffect(() => {
    //     if (listCustomerData.length !== 0) {
    //         listCustomerData.forEach(customer => {
    //             options.push({
    //                 key: customer.id,
    //                 value: customer.id,
    //                 label: customer.name,
    //             });
    //         })
    //     }
    // }, [listCustomerData]);

    const sharedProps = {
        mode: 'multiple',
        style: {
            width: '100%',
        },
        // options,
        placeholder: 'Chọn khách hàng',
        maxTagCount: 'responsive',
    };



    //add report

    const [listCustomer, setListCustomer] = useState([]);

    const onFinishAddReport = (values) => {
        console.log('Received values of form: ', values);
        // dispatch(postReportDCCN({ values }));

        const dataConvert = {
            "startDate": formatDate(valueRangepicker[0].$d),
            "endDate": formatDate(valueRangepicker[1].$d),
            "name": values.name,
            "description": values.description,
            "customerIds": listCustomer ? [...listCustomer] : []
        }

        console.log("dataConvert", dataConvert)

        dispatch(postReportDCCN({ values: dataConvert }));
        // formAddReport.resetFields();
    };


    return (
        <div className="m-4">
            <div className={`px-[20px] w-full flex justify-between pb-7 ${!checkbox && "bg-white py-7"}`}>
                <div className="flex gap-[5px] items-center">
                    <h1 className="text-[20px] font-bold">{description?.name} <span className="font-normal">(Từ {description?.startDate} đến {description?.endDate})</span></h1>
                </div>

                <div className="flex gap-4">
                    <FaRegFilePdf
                        title="Xuất file pdf"
                        onClick={handlePrint}
                        size={30}
                        className="p-2 bg-white border border-black cursor-pointer self-start"
                    />

                    <Button
                        className='bg-[#FF7742] font-bold text-white'
                        type='link'
                        onClick={() => navigate(-1)}
                    >
                        Thoát
                    </Button>
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

            {chungTuBan.map((ctb, index) =>
                <Table
                    key={index}
                    columns={columns}
                    dataSource={ctb}
                    onChange={onChange}
                    scroll={{
                        x: 1300,
                    }}
                    className="overflow-x-visible	overflow-y-visible mb-3"

                    pagination={false}
                    bordered
                    summary={(pageData) => {
                        let totalTong = 0;
                        let totalDaThu = 0;
                        let totalChuaThu = 0;
                        pageData.forEach(({ tong, dathu, chuathu }) => {
                            totalTong += tong;
                            totalDaThu += dathu;
                            totalChuaThu += chuathu;
                        });
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} className="font-medium">Tên khách hàng: {pageData[0].customer} - ID: {pageData[0].makhachhang}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text className="font-medium">{VND.format(totalTong)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <Text className="font-medium">{VND.format(totalDaThu)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>
                                        <Text className="font-medium">{VND.format(totalChuaThu)}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />
            )}

            <div
                className='hidden'
            >
                <div ref={componentRef}>
                    <InChiTietNoPhaiThu
                        form={form}
                        // components={components}
                        dataSource={chungTuBan}
                        columns={columns}
                        dates={[{ $d: description?.startDate }, { $d: description?.endDate }]}
                    // idHoaDon={chungTuBanData?.id}
                    // idCustomer={chungTuBanData?.donBanHang?.customer?.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportDCCN;
