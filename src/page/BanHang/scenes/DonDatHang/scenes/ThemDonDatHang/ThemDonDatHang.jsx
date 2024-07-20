import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, Flex, Table, Button, Select, Typography, InputNumber, notification, DatePicker } from "antd";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { banHangSelector, clearState, getDonBanHang, postDonBanHang } from '../../../../../../store/features/banHangSlice';
import { VND, formatDate } from '../../../../../../utils/func';
import { doiTuongSelector, getListCustomer, getListProduct, getListSalesperson, getDieuKhoanThanhToanCustomer, getCktmCustomer } from '../../../../../../store/features/doiTuongSilce';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";


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
    const inputNode = inputType === 'number' ? <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} max={record.soluongtonkho} /> : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;

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
                        message: `Please Input ${title}!`,
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


const ThemDonDatHang = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    console.log("params", params)
    console.log("params.id", params.id)
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();


    const {
        donBanHangData,
        isSuccessGetDonBanHang,
        isSuccessPostDonBanHang,
        isError,
        message,
    } = useSelector(banHangSelector);

    console.log("donBanHangData", donBanHangData);

    const {
        listCustomerData,
        isSuccessGetListCustomer,
        isSuccessPostCustomer,
        isSuccessUpdateCustomer,
        listSalespersonData,
        listProductData,
        isSuccessGetListProduct,
        dieuKhoanThanhToanCustomerData,
        cktmCustomerData,
    } = useSelector(doiTuongSelector);



    useEffect(() => {
        dispatch(getListCustomer());
        dispatch(getListSalesperson());
        dispatch(getListProduct());
    }, []);

    useEffect(() => {
        if (isSuccessPostDonBanHang) {
            // api.success({
            //     message: "Thêm dữ liệu thành công!",
            //     placement: "bottomLeft",
            //     duration: 2,
            // });
            // dispatch(clearState());
            navigate(-1);
        }
        else if (isError) {
            api.error({
                message: message,
                placement: "bottomLeft",
                duration: 2,
            });

            dispatch(clearState());
        }
    }, [isSuccessPostDonBanHang, isError]);



    useEffect(() => {
        if (donBanHangData) {
            const data = {
                ...donBanHangData,
                // saleDate: new Date(donBanHangData?.saleDate),
                // deliveryTerm: new Date(donBanHangData?.deliveryTerm),

                saleDate: dayjs(new Date(donBanHangData?.saleDate).toISOString()?.slice(0, 10), dateFormat),
                deliveryTerm: dayjs(new Date(donBanHangData?.deliveryTerm).toISOString()?.slice(0, 10), dateFormat),
            };

            switch (donBanHangData.documentStatus) {
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

            switch (donBanHangData.deliveryStatus) {
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
    }, [donBanHangData]);


    useEffect(() => {
        if (donBanHangData?.customerId && listCustomerData) {
            // dispatch(getDieuKhoanThanhToanCustomer({ id: donBanHangData?.customerId }));
            // dispatch(getCktmCustomer({ id: donBanHangData?.customerId }));

            // listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.address

            form.setFieldsValue({
                address: listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.address,
                namecCustomer: listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.name,
            });

        }
    }, [listCustomerData, donBanHangData]);

    useEffect(() => {
        if (donBanHangData?.customerId) {
            dispatch(getDieuKhoanThanhToanCustomer({ id: donBanHangData?.customerId }));
            dispatch(getCktmCustomer({ id: donBanHangData?.customerId }));
        }
    }, [donBanHangData?.customerId]);

    useEffect(() => {
        if (donBanHangData?.paymentPeriod && dieuKhoanThanhToanCustomerData) {
            const dktt = dieuKhoanThanhToanCustomerData?.filter(item => item?.paymentPeriod === donBanHangData?.paymentPeriod);
            console.log("dkttdktt", dktt)

            if (dktt.length === 0) {
                form.setFields([
                    {
                        name: 'paymentPeriod',
                        errors: ['Không tìm thấy dữ liệu!'],
                    },
                ]);
            }

            form.setFieldsValue({
                paymentPeriod: dktt[0]?.paymentPeriod
            });
        }
    }, [donBanHangData, dieuKhoanThanhToanCustomerData]);

    useEffect(() => {
        if (donBanHangData?.discountRate && cktmCustomerData) {
            const cktm = cktmCustomerData?.filter(item => item?.discountRate === donBanHangData?.discountRate);
            console.log("cktmcktm", cktm)
            if (cktm.length === 0) {
                form.setFields([
                    {
                        name: 'discountRate',
                        errors: ['Không tìm thấy dữ liệu!'],
                    },
                ]);
            }
            // else {
            //     let totalProduct = donBanHangData?.products?.map(item=>item.count)?.reduce((total, currentValue) => {
            //         return total + currentValue;
            //     }, 0)

            //     if(totalProduct<cktm[0]?.minProductValue){
            //         form.setFields([
            //             {
            //                 name: 'discountRate',
            //                 errors: ['Số lượng sản phẩm không phù hợp với CKTM!'],
            //             },
            //         ]);
            //     }
            // }
            form.setFieldsValue({
                discountRate: cktm[0]?.discountRate
            });
        }
    }, [donBanHangData, cktmCustomerData]);


    const [productOfDonBanHangs, setProductOfDonBanHangs] = useState([]);

    useEffect(() => {
        if (listProductData) {

            const products = donBanHangData?.products?.map(product => {
                const productCurrent = listProductData?.filter(item => item.id === product.productId);

                // if (productCurrent.length === 0 && listProductData.length !== 0) {
                //     api.error({
                //         message: `${product.name} với id = ${product.productId} không tìm thấy dữ liệu!`,
                //         placement: "bottomLeft",
                //         duration: 100,
                //     });

                //     return {}
                // }

                console.log("productCurrent", productCurrent)

                // let soluongtonkho = 0;
                // donBanHangData.ctban.forEach(chungtuban => {
                //     chungtuban.productOfCtban.forEach(productOfCtbanItem => {
                //         if (productOfCtbanItem.product.id === product.product.id) {
                //             console.log("...", productOfCtbanItem.count)
                //             soluongtonkho += productOfCtbanItem.count;
                //         }
                //     })
                // })

                return {
                    ...product,
                    key: product.productId,
                    id: product.productId,
                    count: product.count,
                    productName: productCurrent[0]?.name,
                    unit: productCurrent[0]?.unit,
                    soluongtonkho: productCurrent[0]?.category,
                    // soluongdaxuat: 1,
                    price: productCurrent[0]?.priceDelivery,
                    phantramcktm: donBanHangData?.discountRate,
                    tiencktm: product.count * productCurrent[0]?.priceDelivery * (donBanHangData?.discountRate / 100),
                    thanhtien: productCurrent[0]?.priceDelivery * product.count,
                    phantramthuegtgt: productCurrent[0]?.productGroupInfo?.tax,
                    tienthuegtgt: product.count * productCurrent[0]?.priceDelivery * (1 - donBanHangData?.discountRate / 100) * (productCurrent[0]?.productGroupInfo?.tax / 100)
                }
            })



            console.log("products", products)

            setProductOfDonBanHangs(products);



            // listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.address

            // form.setFieldsValue({
            //     address: listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.address,
            //     namecCustomer: listCustomerData.filter(item => item.id === donBanHangData?.customerId)[0]?.name,
            // });



        }
    }, [listProductData]);

    // console.log("listProductData", listProductData);


    const nameValue = Form.useWatch('id', form);

    const [dataSource, setDataSource] = useState([
        // {
        //     key: '0',
        //     'tenchietkhau': 'Chiết khấu 1',
        //     'songayduocno': '20',
        //     'songayhuongchietkhau': '10',
        //     'phantramchietkhau': '2',
        //     'noidung': '...',
        // }
    ]);

    const [count, setCount] = useState(1);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
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
        {
            title: "Tồn kho chưa đặt",
            dataIndex: "soluongtonkho",
            editable: false,
        },
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
            editable: false,
            // render: (val, record) => VND.format(val),
        },
        {
            title: "Tiền chiết khấu",
            dataIndex: "tiencktm",
            editable: false,
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
        //         dataSource.length >= 1 ? (
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
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        row.thanhtien = row.price * row.count;
        row.tiencktm = row.price * row.count * (row.phantramcktm / 100);
        row.tienthuegtgt = (row.thanhtien - row.tiencktm) * (row.phantramthuegtgt / 100);
        const newData = [...productOfDonBanHangs];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setProductOfDonBanHangs(newData);
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

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        console.log(productOfDonBanHangs);

        let dataConvert = {
            "saleDate": formatDate(values.saleDate.$d),
            "content": values.content,
            // "paymentStatus": values.paymentStatus,
            "deliveryStatus": "NOT_DELIVERED",
            // "documentStatus": values.documentStatus,
            "deliveryTerm": formatDate(values.deliveryTerm.$d),
            "salespersonId": values.salesperson,
            "customerId": values.customerId,
            "paymentPeriod": values.paymentPeriod,
            "discountRate": values.discountRate,
            "products": productOfDonBanHangs.map(product => {
                return {
                    productId: product.id,
                    count: product.count
                }
            })
        }

        console.log("dataConvert", dataConvert)
        dispatch(postDonBanHang({ values: dataConvert }));
    };

    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-8">
                Đơn đặt hàng {nameValue || donBanHangData.id}
            </h1>

            {contextHolder}

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
                <Flex gap={100} justify='center' className='w-[100%] align-left'>
                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Tên khách hàng"
                            name='customerId'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Select
                                disabled={true}
                                onChange={(value) => {
                                    const dataFilter = listCustomerData.filter(item => item.id === value);
                                    console.log("dataFilter", dataFilter)

                                    const data = {
                                        address: dataFilter[0]?.address,
                                        // customerId: dataFilter[0]?.name,
                                        branch: dataFilter[0]?.branch
                                    };

                                    console.log("dataa", data)

                                    form.setFieldsValue({
                                        ...data
                                    });
                                }}
                            >
                                {
                                    listCustomerData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name='address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input
                                disabled={true}
                            />
                        </Form.Item>

                        {/* <Form.Item
                            label="Mã số thuế"
                            name="code"
                        >
                            <Input
                                disabled={disabled}
                            />
                        </Form.Item> */}

                        <Form.Item
                            label="Người nhận hàng"
                            name="namecCustomer"
                        >
                            <Input
                                disabled={disabled}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Nhân viên bán hàng"
                            name='salesperson'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Select
                                disabled={disabled}
                                // onChange={(value) => {
                                //     const dataFilter = listSalespersonData.filter(item => item.id === value);
                                //     console.log("dataFilter", dataFilter)

                                //     const data = {
                                //         salesperson: dataFilter[0]?.name,
                                //     };

                                //     console.log("dataa", data)

                                //     form.setFieldsValue({
                                //         ...data
                                //     });
                                // }}
                            >
                                {/* {
                                        listAccountantData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                    } */}
                                {
                                    listSalespersonData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Nội dung"
                            name='content'
                        >
                            <Input
                                disabled={disabled}

                            />
                        </Form.Item>
                    </Flex>

                    <Flex vertical gap={5} className='w-[50%]'>
                        {/* <Form.Item
                            label="Số đơn hàng"
                            name='id'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input
                                disabled={disabled}

                            />
                        </Form.Item> */}

                        <Form.Item
                            label="Ngày đặt hàng"
                            name='saleDate'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <DatePicker
                                className='!w-full'
                                disabled={disabled}
                            // format={dateFormat}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hạn giao hàng"
                            name='deliveryTerm'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <DatePicker
                                className='!w-full'
                                disabled={disabled}
                            // format={dateFormat}
                            />
                        </Form.Item>


                        <Form.Item
                            label="Điều khoản thanh toán"
                            name='paymentPeriod'
                        >
                            <Select
                                disabled={disabled}
                                onChange={(value) => {
                                    if (value > -1) {
                                        form.setFields([
                                            {
                                                name: 'paymentPeriod',
                                                errors: [],
                                            },
                                        ]);
                                    }
                                    // let totalProduct = donBanHangData?.products?.map(item => item?.count)?.reduce((total, currentValue) => {
                                    //     return total + currentValue;
                                    // }, 0)

                                    // const dktt = dieuKhoanThanhToanCustomerData?.filter(item => item?.paymentPeriod === value);

                                    // if (totalProduct < dktt[0]?.minOrderQuantity) {
                                    //     form.setFields([
                                    //         {
                                    //             name: 'discountRate',
                                    //             errors: ['Số lượng sản phẩm không phù hợp với CKTM!'],
                                    //         },
                                    //     ]);
                                    // }
                                    // else {
                                    //     form.setFields([
                                    //         {
                                    //             name: 'discountRate',
                                    //             errors: ['cc'],
                                    //         },
                                    //     ]);
                                    // }
                                }}
                            >
                                {
                                    dieuKhoanThanhToanCustomerData?.map(item => <Select.Option value={item?.paymentPeriod} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Chiết khấu thương mại"
                            name='discountRate'
                        >
                            <Select
                                disabled={disabled}
                                onChange={(value) => {
                                    if (value > -1) {
                                        form.setFields([
                                            {
                                                name: 'discountRate',
                                                errors: [],
                                            },
                                        ]);
                                    }
                                    const data = productOfDonBanHangs?.map(product => {
                                        return {
                                            ...product,
                                            phantramcktm: value,
                                            tiencktm: product.count * product.price * (value / 100),
                                            thanhtien: product.price * product.count,
                                            tienthuegtgt: product.count * product.price * (1 - value / 100) * (product.phantramthuegtgt / 100)
                                        }
                                    })

                                    setProductOfDonBanHangs(data);

                                    // let totalProduct = donBanHangData?.products?.map(item => item?.count * item?.price)?.reduce((total, currentValue) => {
                                    //     return total + currentValue;
                                    // }, 0)

                                    // const cktm = cktmCustomerData?.filter(item => item?.discountRate === value);

                                    // if (totalProduct < cktm[0]?.minProductValue) {
                                    //     form.setFields([
                                    //         {
                                    //             name: 'discountRate',
                                    //             errors: ['Số lượng sản phẩm không phù hợp với CKTM!'],
                                    //         },
                                    //     ]);
                                    // }
                                    // else {
                                    //     form.setFields([
                                    //         {
                                    //             name: 'discountRate',
                                    //             errors: [],
                                    //         },
                                    //     ]);
                                    // }
                                }}
                            >
                                {
                                    cktmCustomerData?.map(item => <Select.Option value={item?.discountRate} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        {/* <Form.Item
                            label="Tình trạng đơn hàng"
                            name='documentStatus'
                        >
                            <Input
                                disabled={disabled}

                            />
                        </Form.Item> */}

                        <Form.Item
                            label="Tình trạng giao hàng"
                            name='deliveryStatus'
                        >
                            <Input
                                disabled={true}

                            />
                        </Form.Item>
                    </Flex>

                </Flex>


                {/* <div className='flex justify-start'>
                    <div className='min-w-[300px] mb-8'>
                        {donBanHangData?.ctban?.length !== 0 && <div className='flex'>
                            <p>Tham chiếu đến chứng từ bán hàng:</p>
                            <p>
                                {
                                    donBanHangData?.ctban?.map(ct => <span
                                        className='px-2 text-[#1DA1F2] font-medium	cursor-pointer'
                                        onClick={() => navigate(`/ban-hang/chung-tu-ban-hang/xem/${ct.id}`, { state: { id: ct.id } })}
                                    >{ct.id}</span>)
                                }
                            </p>
                        </div>}
                    </div>
                </div> */}


                <div>
                    {/* <Button
                        className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1 mb-4'
                        onClick={handleAdd}
                        disabled={disabled}
                    >
                        Thêm 1 dòng
                    </Button> */}

                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={productOfDonBanHangs}
                        columns={columns}
                        pagination={false}
                    />
                </div>

                <div className='flex justify-end'>
                    <div className='w-[300px] my-8'>
                        <div className='flex justify-between'>
                            <p>Tổng tiền hàng</p>
                            <p>
                                {
                                    VND.format(productOfDonBanHangs.map(product => product.thanhtien).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Tiền chiết khấu</p>
                            <p>
                                {
                                    VND.format(productOfDonBanHangs.map(product => product.tiencktm).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between border-b border-zinc-950'>
                            <p>Thuế GTGT</p>
                            <p>
                                {
                                    VND.format(productOfDonBanHangs.map(product => product.tienthuegtgt).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0))
                                }
                            </p>
                        </div>
                        <div className='flex justify-between font-bold text-xl'>
                            <p>TỔNG</p>
                            <p>
                                {
                                    VND.format(productOfDonBanHangs.map(product => product.thanhtien).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0)
                                        -
                                        productOfDonBanHangs.map(product => product.tiencktm).reduce((total, currentValue) => {
                                            return total + currentValue;
                                        }, 0)
                                        +
                                        productOfDonBanHangs.map(product => product.tienthuegtgt).reduce((total, currentValue) => {
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
                            className='bg-[#FF7742] font-bold text-white'
                            type='link'
                            onClick={() => navigate(-1)}
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
        </div>
    )
}

export default ThemDonDatHang