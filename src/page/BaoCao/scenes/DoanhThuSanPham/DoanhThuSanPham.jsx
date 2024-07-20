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
import { baoCaoSelector, getListCongNo, getListReportDTBH, postReportDTBH, postReportDTBHRaw, clearState, getListSalesPerson } from './../../../../store/features/baoCaoSlice';
import { useReactToPrint } from "react-to-print";
import { FaRegFilePdf } from "react-icons/fa6";
import InChiTietNoPhaiThu from "../../../../component/InChiTietNoPhaiThu/InChiTietNoPhaiThu";
import { set } from "react-hook-form";
import InTongHopDoanhThuNhanVien from "../../../../component/InTongHopDoanhThuNhanVien/InTongHopDoanhThuNhanVien";
import { getChartProduct, tongQuanSelector, resetData } from "../../../../store/features/tongQuanSlice";
import InDoanhThuSanPham from "../../../../component/InDoanhThuSanPham/InDoanhThuSanPham";
import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';

const { Text } = Typography;


const { RangePicker } = DatePicker;
const DoanhThuSanPham = ({ checkbox = false }) => {
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
        // chartProductData
    } = useSelector(baoCaoSelector);

    const {
        isSuccessGetChartRevenue,
        isSuccessGetChartProduct,
        chartRevenueData,
        chartProductData,
    } = useSelector(tongQuanSelector);


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

    console.log("chartProductData", chartProductData)

    useEffect(() => {
        dispatch(resetData());

        const timeRange = selectTime("thisMonth");

        const dataConvert = {
            "startDate": timeRange?.startDate,
            "endDate": timeRange?.endDate,
            // "name": "xxx",
            // "description": "xxx",
            // "salespersonIds": values?.listProductSelected ? [...values?.listProductSelected] : []
        }

        form.setFieldsValue({
            rangePicker: [dayjs(timeRange?.startDate, DATE_FORMAT), dayjs(timeRange?.endDate, DATE_FORMAT)]
        });

        setValueRangepicker([dayjs(timeRange?.startDate, DATE_FORMAT), dayjs(timeRange?.endDate, DATE_FORMAT)]);

        console.log("dataConvert", dataConvert)

        dispatch(getChartProduct({ values: dataConvert }));
    }, []);

    useEffect(() => {
        if (chartProductData) {
            const dataConvertCurrent = chartProductData?.map(product => {
                return {
                    id: product?.product?.id,
                    name: product?.product?.name,
                    count: product?.count,
                    doanhthugop: product?.totalProductValue,
                    chietkhau: product?.totalDiscountValue,
                    doanhthurong: product?.totalProductValue - product?.totalDiscountValue,
                }
            })


            console.log("dataConvertCurrent", dataConvertCurrent)
            setDataConvert(dataConvertCurrent);
            setChungTuBan(dataConvertCurrent);
            dispatch(clearState());
        }
    }, [chartProductData]);









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
            width: "10%"
        },

        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },

        {
            title: "Số lượng bán",
            dataIndex: "count",
            key: "count",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{val}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.count - b.count,
            sortOrder: sortedInfo.columnKey === "count" ? sortedInfo.order : null,
        },

        {
            title: "Doanh thu trước chiết khấu",
            dataIndex: "doanhthugop",
            key: "doanhthugop",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.doanhthugop - b.doanhthugop,
            sortOrder: sortedInfo.columnKey === "doanhthugop" ? sortedInfo.order : null,
        },


        {
            title: "Tiền chiết khấu",
            dataIndex: "chietkhau",
            key: "chietkhau",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.chietkhau - b.chietkhau,
            sortOrder: sortedInfo.columnKey === "chietkhau" ? sortedInfo.order : null,
        },

        {
            title: "Doanh thu (thuần)",
            dataIndex: "doanhthurong",
            key: "doanhthurong",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000]" : ""}`}>{VND.format(val)}</span>,

            // render: (val, record) => VND.format(val),
            sorter: (a, b) => a.doanhthurong - b.doanhthurong,
            sortOrder: sortedInfo.columnKey === "doanhthurong" ? sortedInfo.order : null,
        },
    ];

    if (checkbox) {
        columns = columns.filter(item => item.dataIndex !== "chucnang");
    }

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        const dataConvert = {
            "startDate": formatDate(values.rangePicker[0].$d),
            "endDate": formatDate(values.rangePicker[1].$d),
            // "name": "xxx",
            // "description": "xxx",
            // "salespersonIds": values?.listProductSelected ? [...values?.listProductSelected] : []
        }

        console.log("dataConvert", dataConvert)
        dispatch(getChartProduct({ values: dataConvert }));

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


    //select product
    const {
        listProductData,
    } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getListProduct());
    }, []);


    const options = [];
    useEffect(() => {
        if (listProductData.length !== 0) {
            listProductData.forEach(product => {
                options.push({
                    key: product.id,
                    value: product.id,
                    label: product.name,
                });
            })
        }
    }, [listProductData]);

    const sharedProps = {
        mode: 'multiple',
        style: {
            width: '100%',
        },
        // options,
        placeholder: 'Chọn sản phẩm',
        maxTagCount: 'responsive',
    };



    //add report

    const [listProductSelected, setListProductSelected] = useState([]);

    const onFinishAddReport = (values) => {
        console.log('Received values of form: ', values);
        // dispatch(postReportDTBH({ values }));

        const dataConvert = {
            "startDate": formatDate(valueRangepicker[0].$d),
            "endDate": formatDate(valueRangepicker[1].$d),
            "name": values.name,
            "description": values.description,
            "salespersonIds": listProductSelected ? [...listProductSelected] : []
        }

        console.log("dataConvert", dataConvert)


        dispatch(postReportDTBH({ values: dataConvert }));
        // formAddReport.resetFields();
    };


    //
    useEffect(() => {
        if (chartProductData.length !== 0 && listProductData.length !== 0) {

            const dataConvertCurrent = listProductData?.map(ProductData => {
                const productCurrent = chartProductData?.filter(product => product?.product?.id === ProductData?.id);

                if (productCurrent.length !== 0) {
                    return {
                        id: productCurrent[0]?.product?.id,
                        name: productCurrent[0]?.product?.name,
                        count: productCurrent[0]?.count,
                        doanhthugop: productCurrent[0]?.totalProductValue,
                        chietkhau: productCurrent[0]?.totalDiscountValue,
                        doanhthurong: productCurrent[0]?.totalProductValue - productCurrent[0]?.totalDiscountValue,
                    }
                }

                return {
                    id: ProductData?.id,
                    name: ProductData?.name,
                    count: 0,
                    doanhthugop: 0,
                    chietkhau: 0,
                    doanhthurong: 0,
                }
            })

            dataConvertCurrent.sort(function (a, b) { return b["count"] - a["count"] })

            if (listProductSelected.length !== 0) {
                const dataConvertCurrentFilter = dataConvertCurrent.filter(item => listProductSelected.includes(item?.id));

                setDataConvert(dataConvertCurrentFilter);
                setChungTuBan(dataConvertCurrentFilter);
            }
            else {
                console.log("dataConvertCurrent", dataConvertCurrent)
                setDataConvert(dataConvertCurrent);
                setChungTuBan(dataConvertCurrent);
            }


            dispatch(clearState());
        }
    }, [chartProductData, listProductData]);




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
                            {/* <RangePicker
                value={valueRangepicker}
                format='DD-MM-YYYY'
                className="!me-[5px]"
              /> */}
                            <RangePicker
                                onChange={(dates) => handleFilterday(dates)}

                            />

                        </Form.Item>
                        <Form.Item name="listProductSelected" className="w-[300px] !me-0">
                            {/* <Input
                className="rounded-tr-none rounded-br-none"
                placeholder="Nhập tên khách hàng"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              /> */}
                            <Select
                                mode="tags"
                                style={{
                                    width: '100%',
                                    // height: '31.6px'
                                }}
                                {...sharedProps}
                                tokenSeparators={[',']}
                                onChange={(values) => setListProductSelected(values)}
                            >
                                {
                                    listProductData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
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

                {/* <Button
                    className="!bg-[#7A77DF] font-bold text-white flex items-center gap-1"
                    type="link"
                    disabled={chungTuBan.length === 0}
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Lưu báo cáo
                </Button> */}

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
                    let totalCount = 0;
                    let totaldoanhthugop = 0;
                    let totalchietkhau = 0;
                    let totaldoanhthurong = 0;
                    pageData.forEach(({ count, doanhthugop, chietkhau, doanhthurong }) => {
                        totalCount += count;
                        totaldoanhthugop += doanhthugop;
                        totalchietkhau += chietkhau;
                        totaldoanhthurong += doanhthurong;
                    });
                    return (
                        <>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={1} colSpan={2}>Tổng</Table.Summary.Cell>
                                <Table.Summary.Cell index={2}>
                                    <Text className="font-medium">{totalCount}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3}>
                                    <Text className="font-medium">{VND.format(totaldoanhthugop)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    <Text className="font-medium">{VND.format(totalchietkhau)}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5}>
                                    <Text className="font-medium">{VND.format(totaldoanhthurong)}</Text>
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
                    <InDoanhThuSanPham
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

export default DoanhThuSanPham;
