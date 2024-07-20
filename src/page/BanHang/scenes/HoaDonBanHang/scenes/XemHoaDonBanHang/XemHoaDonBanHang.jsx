import React, { useContext, useEffect, useRef, useState } from 'react'
import { Tabs, Form, Input, Flex, Table, Button, InputNumber, Select, Checkbox } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { banHangSelector, getChungTuBan, postChungTuBan, clearState } from '../../../../../../store/features/banHangSlice';
import { VND } from '../../../../../../utils/func';
import PhieuXuat from '../../../../../../component/Form/BanHang/PhieuXuat';
import PhieuThu from '../../../../../../component/Form/BanHang/PhieuThu';
import HoaDon from '../../../../../../component/Form/BanHang/HoaDon';

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useReactToPrint } from 'react-to-print';
import InHoaDonBanHang from '../../../../../../component/InHoaDonBanHang/InHoaDonBanHang';

const dateFormat = "YYYY-MM-DD";
dayjs.extend(customParseFormat);


const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    inputType,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    const inputNode = inputType === 'number' ? <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} max={record.soluongchuadat} /> : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                name={dataIndex}
                style={{
                    margin: 0,
                }}
                rules={[
                    {
                        required: true,
                        message: `Vui lòng nhập Input ${title}!`,
                    },
                ]}
            >
                {inputNode}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};


const XemHoaDonBanHang = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    console.log("params", params)
    console.log("params.id", params.id)
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const {
        chungTuBanData,
        isSuccessGetChungTuBan

    } = useSelector(banHangSelector);

    console.log("chungTuBanData", chungTuBanData);


    useEffect(() => {
        dispatch(getChungTuBan({ id: params.id }));
    }, []);

    const [productOfChungTuBans, setProductOfChungTuBans] = useState([]);

    // console.log("listProductData", listProductData);
    useEffect(() => {
        if (isSuccessGetChungTuBan) {
            const products = chungTuBanData.productOfCtban.map(productOfChungTu => {
                console.log("product", productOfChungTu)
                // const data = listProductData.filter(item => item.id === productOfChungTu.product.id);
                // console.log("data", data);

                // let soluongdaban = 0;
                // chungTuBanData.ctban.forEach(chungtuban => {
                //     chungtuban.productOfCtban.forEach(productOfCtbanItem => {
                //         if (productOfCtbanItem.product.id === product.id) {
                //             soluongdaban += productOfCtbanItem.count;
                //         }
                //     })
                // })

                return {
                    ...productOfChungTu,
                    key: productOfChungTu.id,
                    id: productOfChungTu.product.id,
                    productName: productOfChungTu.product.name,
                    unit: productOfChungTu.product.unit,
                    count: productOfChungTu.count,
                    soluongchuadat: productOfChungTu.count,
                    // soluongdaxuat: 1,
                    price: productOfChungTu.price,
                    phantramcktm: chungTuBanData.donBanHang?.discountRate,
                    tiencktm: productOfChungTu.count * productOfChungTu.price * (chungTuBanData.donBanHang?.discountRate / 100),
                    thanhtien: productOfChungTu.price * productOfChungTu.count,
                    phantramthuegtgt: productOfChungTu.product.productGroup.tax,
                    tienthuegtgt: productOfChungTu.count * productOfChungTu.price * (1 - chungTuBanData.donBanHang?.discountRate / 100) * (productOfChungTu.product.productGroup.tax / 100)
                }
            })



            console.log("products", products)

            setProductOfChungTuBans(products);
            dispatch(clearState());
        }
    }, [isSuccessGetChungTuBan]);


    const nameValue = Form.useWatch('id', form);


    const [count, setCount] = useState(1);

    const handleDelete = (key) => {
        const newData = productOfChungTuBans.filter((item) => item.key !== key);
        setProductOfChungTuBans(newData);
    };
    const defaultColumns = [
        {
            title: "Mã hàng",
            dataIndex: "id",
            editable: false,
        },
        {
            title: "Tên hàng",
            dataIndex: "productName",
            editable: false,
        },
        {
            title: "ĐVT",
            dataIndex: "unit",
            editable: false,
            render: (val, record) => {
                switch (val) {
                    case "CAI":
                        return "Cái";
                    case "CAY":
                        return "Cây";
                    case "CHAI":
                        return "Chai";
                    case "CHUC":
                        return "Chục";
                    case "CUON":
                        return "Cuộn";
                    case "GOI":
                        return "Gói";
                    case "HOP":
                        return "Hộp";
                    case "HU":
                        return "Hủ";
                    case "KG":
                        return "Kg";
                    case "LOC":
                        return "Lốc";
                    case "LON":
                        return "Lon";
                    case "THUNG":
                        return "Thùng";
                    case "VIEN":
                        return "Viên";
                    default:
                        return "Lỗi";
                }
            },
        },
        {
            title: "Số lượng",
            dataIndex: "count",
            editable: !disabled,
        },
        // {
        //     title: "Số lượng chưa đặt",
        //     dataIndex: "soluongchuadat",
        //     editable: false,
        // },
        // {
        //     title: "Số lượng đã xuất",
        //     dataIndex: "soluongdaxuat",
        //     editable: !disabled,
        // },
        {
            title: "Đơn giá",
            dataIndex: "price",
            editable: false,
            render: (val, record) => VND.format(val),

        },
        {
            title: "Thành tiền",
            dataIndex: "thanhtien",
            editable: false,
            render: (val, record) => VND.format(val),

        },
        {
            title: "% chiết khấu",
            dataIndex: "phantramcktm",
            editable: !disabled,
            // render: (val, record) => VND.format(val),
        },
        {
            title: "Tiền chiết khấu",
            dataIndex: "tiencktm",
            editable: !disabled,
            render: (val, record) => VND.format(val),

        },
        {
            title: "% thuế GTGT",
            dataIndex: "phantramthuegtgt",
            editable: false,
        },
        {
            title: "Tiền thuế GTGT",
            dataIndex: "tienthuegtgt",
            editable: false,
            render: (val, record) => VND.format(val),

        },
        // {
        //     title: '',
        //     dataIndex: 'operation',
        //     width: '50px',
        //     render: (_, record) =>
        //         productOfChungTuBans.length >= 1 ? (
        //             <Typography.Link onClick={() => handleDelete(record.key)} className='flex justify-center'>
        //                 <RiDeleteBin6Line size={20} color='#1E1E1E' />
        //             </Typography.Link>
        //         ) : null,
        // },
    ];


    const handleAdd = () => {
        const newData = {
            'key': count,
            'tenchietkhau': '.',
            'songayduocno': '.',
            'songayhuongchietkhau': '.',
            'phantramchietkhau': '.',
            'noidung': '.',
        };
        setProductOfChungTuBans([...productOfChungTuBans, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        console.log("row", row);
        row.thanhtien = row.price * row.count;
        row.tienthuegtgt = row.price * row.count * (row.phantramthuegtgt / 100);

        const newData = [...productOfChungTuBans];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setProductOfChungTuBans(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: ['count'].includes(col.dataIndex) ? 'number' : 'text',
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    //End
    const onFinish = (values) => {
        // values.createdAt = `${values.createdAt.$y}-${values.createdAt.$M + 1}-${values.createdAt.$D}`;
        // values.deliveryDate = `${values.deliveryDate.$y}-${values.deliveryDate.$M + 1}-${values.deliveryDate.$D}`;
        console.log('Received values of form: ', values);
        console.log(productOfChungTuBans);

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        let dataConvert = {
            "deliveryDate": formatDate(values.deliveryDate.$d),
            "warehouseKeeperId": values.warehouseKeeperId,
            "content": values.content,
            "receiver": values.receiver,
            "paymentTerm": formatDate(values.paymentTerm.$d),
            "donBanHangId": chungTuBanData.id,
            "products": productOfChungTuBans.map(product => {
                return {
                    productId: product.id,
                    count: product.count
                }
            })

        };

        // console.log("dataConvert",dataConvert)
        // "deliveryDate": `${values.deliveryDate.$y}-${values.deliveryDate.$M + 1}-${values.deliveryDate.$D}`,

        // console.log("dayjs(values.deliveryDate, dateFormat)",dayjs(new Date(values.deliveryDate.$d).toISOString().slice(0, 10), dateFormat))

        dispatch(postChungTuBan({ values: dataConvert }));
        navigate(-2);
    };


    // Tab

    const [phieuThuChecked, setPhieuThuChecked] = useState(false);
    // const [selectedOption, setSelectedOption] = useState("CASH");


    const onChangePhieuThu = (e) => {
        setPhieuThuChecked(e.target.checked);
    };

    const itemsTienMat = [
        {
            key: "1",
            label: "Phiếu xuất",
            children: <PhieuXuat
                components={components}
                dataSource={productOfChungTuBans}
                columns={columns}

                form={form}
                disabled={disabled}
                onFinish={onFinish} />,
        },
        {
            key: "2",
            label: "Hóa đơn",
            children: <HoaDon
                components={components}
                dataSource={productOfChungTuBans}
                columns={columns}

                form={form}
                disabled={disabled}
                onFinish={onFinish}
            />,
        },
        phieuThuChecked && {
            key: "3",
            label: "Phiếu thu",
            children: <PhieuThu />,
        },
    ];

    // const itemsTienGui = [
    //     {
    //         key: "1",
    //         label: "Phiếu xuất",
    //         children: <PhieuXuat
    //             components={components}
    //             dataSource={productOfChungTuBans}
    //             columns={columns}

    //             form={form}
    //             disabled={disabled}
    //             onFinish={onFinish} />,
    //     },
    //     {
    //         key: "2",
    //         label: "Hóa đơn",
    //         children: <HoaDon
    //             components={components}
    //             dataSource={productOfChungTuBans}
    //             columns={columns}

    //             form={form}
    //             disabled={disabled}
    //             onFinish={onFinish} />,
    //     },
    //     phieuThuChecked && {
    //         key: "3",
    //         label: "Phiếu thu",
    //         children: <PhieuThu tiengui={true} />,
    //     },
    // ];

    // const handleChangeSelectedOption = (e) => {
    //     console.log(e)
    //     setSelectedOption(e);
    // }

    const renderItems = () => {
        return itemsTienMat;

        // if (selectedOption === "CASH") {
        //     return itemsTienMat;
        // } else if (selectedOption === "TRANSFER") {
        //     return itemsTienGui;
        // }
    };




    useEffect(() => {
        if (chungTuBanData) {
            const data = {
                ...chungTuBanData,
                receiver: chungTuBanData.namecCustomer,
                salesperson: chungTuBanData?.donBanHang?.salesperson?.name,
                paymentMethod: "CASH",
                paymentTerm: dayjs(chungTuBanData.paymentTerm, dateFormat),
                createdAt: dayjs(chungTuBanData.createdAt, dateFormat),
                deliveryDate: dayjs(chungTuBanData.deliveryDate, dateFormat),
                paymentPeriod: chungTuBanData?.donBanHang?.paymentPeriod,
                discountRate: chungTuBanData?.donBanHang?.discountRate
            };

            switch (chungTuBanData.documentStatus) {
                case "UNDOCUMENTED":
                    data.documentStatus = "Chưa thực hiện";
                    break;
                case "DOCUMENTING":
                    data.documentStatus = "Đang thực hiện";
                    break;
                case "DOCUMENTED":
                    data.documentStatus = "Hoàn thành";
                    break;
                default:
                    data.documentStatus = "Lỗi";
                    break;
            }

            switch (chungTuBanData.deliveryStatus) {
                case "NOT_DELIVERED":
                    data.deliveryStatus = "Chưa giao";
                    break;
                case "DELIVERING":
                    data.deliveryStatus = "Đang giao";
                    break;
                case "DELIVERED":
                    data.deliveryStatus = "Đã giao đủ";
                    break;
                default:
                    data.deliveryStatus = "Lỗi";
                    break;
            }

            form.setFieldsValue({
                ...data
            });
        }
    }, [chungTuBanData]);


    //Xuat file pdf, in file
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });



    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-4">
                Hóa đơn bán hàng {nameValue || chungTuBanData.id}
            </h1>

            {/* <Flex gap={20}>
                <Flex gap={5} align="center" justify="center">
                    <p>Phương thức thanh toán</p>
                    <Select
                        className="!w-[200px]"
                        defaultValue="CASH"
                        style={{ width: 120 }}
                        onChange={handleChangeSelectedOption}
                        options={[
                            { value: "CASH", label: "Tiền mặt" },
                            { value: "TRANSFER", label: "Tiền gửi" }
                        ]}
                    />
                </Flex>
                <Checkbox checked={phieuThuChecked} onChange={onChangePhieuThu}>
                    Phiếu thu
                </Checkbox>

            </Flex> */}


            <Form
                form={form}
                // labelCol={{ span: 10 }}
                className='mb-4'
                labelCol={{
                    flex: '150px',
                }}
                labelAlign="left"
                labelWrap
                onFinish={onFinish}
            >

                <HoaDon
                    components={components}
                    dataSource={productOfChungTuBans}
                    columns={columns}
                    chungTuBanData={chungTuBanData}
                    isHoaDon={true}
                    form={form}
                    disabled={disabled}
                    onFinish={onFinish}
                />

                <div className='flex justify-end'>
                <div className='w-[300px] my-8'>
                        <div className='flex justify-between'>
                            <p>Tổng tiền hàng</p>
                            <p>
                                {
                                    VND.format(productOfChungTuBans.map(product => product.thanhtien).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Tiền chiết khấu
                                 {/* ({chungTuBanData?.donBanHang?.discountRate}%) */}
                                 </p>
                            <p>
                                {
                                    VND.format(productOfChungTuBans.map(product => product.tiencktm).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between border-b border-zinc-950'>
                            <p>Thuế GTGT</p>
                            <p>
                                {
                                    VND.format(productOfChungTuBans.map(product => product.tienthuegtgt).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between font-bold text-xl'>
                            <p>TỔNG</p>
                            <p>
                                {
                                    VND.format(productOfChungTuBans.map(product => product.thanhtien).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0)
                                        -
                                        productOfChungTuBans.map(product => product.tiencktm).reduce((total, currentValue) => {
                                            return total + currentValue;
                                        }, 0)
                                        +
                                        productOfChungTuBans.map(product => product.tienthuegtgt).reduce((total, currentValue) => {
                                            return total + currentValue;
                                        }, 0))
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {disabled ?
                    <div className='w-full flex justify-end mt-6 mb-0'>
                        <Button
                            className='bg-[#46FF42] font-bold text-white mr-2'
                            type='link'
                            onClick={handlePrint}
                        >
                            In hóa đơn
                        </Button>
                        <Button
                            className='bg-[#FF7742] font-bold text-white'
                            onClick={() => navigate(-1)}
                            type='link'
                        >
                            Thoát
                        </Button>
                    </div> :
                    <Form.Item className='flex justify-end gap-2 mt-6 mb-0'>

                        <Button
                            className='bg-[#FF7742] font-bold text-white mr-2'
                            htmlType="reset"
                            onClick={() => navigate(-1)}
                        >
                            Hủy
                        </Button>
                        <Button
                            className='!bg-[#67CDBB] font-bold text-white'
                            htmlType="submit"
                        // onClick={() => navigate(-1)}
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                }
            </Form>

            <div
            className='hidden'
            >
                <div ref={componentRef}>
                    <InHoaDonBanHang
                        form={form}
                        components={components}
                        dataSource={productOfChungTuBans}
                        columns={columns}
                        idHoaDon={chungTuBanData?.id}
                        idCustomer={chungTuBanData?.donBanHang?.customer?.id}
                        tilechietkhau={chungTuBanData?.donBanHang?.discountRate}
                    />
                </div>
            </div>
        </div>
    )
}

export default XemHoaDonBanHang