import React, { useContext, useEffect, useRef, useState } from 'react'
import { Tabs, Form, Input, Flex, Table, Button, InputNumber, Select, Checkbox, DatePicker, Typography } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { banHangSelector, getDonBanHang, getPhieuThuTienMat, postChungTuBan, postPhieuThuTienGui, postPhieuThuTienMat } from '../../../../../../store/features/banHangSlice';
import { clearState, doiTuongSelector, getListAccountant, getListBankAccount, getListProduct, getListSalesperson } from '../../../../../../store/features/doiTuongSilce';
import { VND } from '../../../../../../utils/func';

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from 'moment';
import InPhieuThu from '../../../../../../component/InPhieuThu/InPhieuThu';
import { useReactToPrint } from 'react-to-print';
const { Text } = Typography;

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
    const inputNode = inputType === 'number' ? <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} max={record.chuathu} /> : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;

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


const XemPhieuThuTienMat = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    console.log("params", params)
    console.log("params.id", params.id)
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const {
        // donBanHangData,
        // isSuccessGetDonBanHang,
        phieuThuTienMatData


    } = useSelector(banHangSelector);

    console.log("phieuThuTienMatData", phieuThuTienMatData);

    const [dataHoaDonSelected, setDataHoaDonSelected] = useState([]);

    const {
        listBankAccountData,
        listAccountantData,
        listSalespersonData,
    } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getPhieuThuTienMat({ id: params.id }));
        dispatch(getListBankAccount());
        // dispatch(getListAccountant());
        dispatch(getListSalesperson());
    }, []);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});

    // console.log("listProductData", listProductData);
    useEffect(() => {
        if (phieuThuTienMatData) {
            const convertData = phieuThuTienMatData?.chungTuCuaPhieuThu?.map(hoaDon => {
                return {
                    ...hoaDon,
                    sothanhtoan: hoaDon.money,
                    customer: phieuThuTienMatData?.customer?.name,
                    tong: hoaDon.ctban.finalValue
                }
            })

            setDataHoaDonSelected(convertData);


            // let content = `${phieuThuTienMatData[0].id}`;

            // if (phieuThuTienMatData.length > 1) {
            //     for (let i = 1; i < phieuThuTienMatData.length; ++i) {
            //         content += `, ${phieuThuTienMatData[i].id}`
            //     }
            // }

            const data = {
                // ...phieuThuTienMatData[0].donBanHang,
                // receiver: donBanHangData.namecCustomer,
                paymentMethod: phieuThuTienMatData.paymentMethod,
                address: phieuThuTienMatData?.customer?.address,
                salespersonID: phieuThuTienMatData?.salesperson?.id,
                submitter: phieuThuTienMatData?.submitter,
                bankAccountId: "",
                // createdAt: dayjs(new Date(phieuThuTienMatData.createdAt).toISOString().slice(0, 10), dateFormat),
                // receiveDate: dayjs(new Date(phieuThuTienMatData.receiveDate).toISOString().slice(0, 10), dateFormat),
                taxCode: phieuThuTienMatData?.customer?.taxCode,
                namecCustomer: phieuThuTienMatData?.customer?.name,
                content: phieuThuTienMatData?.content
                // paymentTerm: dayjs(new Date().toISOString().slice(0, 10), dateFormat),
                // deliveryDate: dayjs(new Date().toISOString().slice(0, 10), dateFormat)
            };


            console.log("dataa", data)

            form.setFieldsValue({
                ...data
            });
        }
    }, [phieuThuTienMatData]);

    useEffect(() => {
        if (phieuThuTienMatData?.receiveDate) {
            const data = {
                receiveDate: dayjs(new Date(phieuThuTienMatData.receiveDate).toISOString().slice(0, 10), dateFormat)
            }
            form.setFieldsValue({
                ...data
            });
        }

    }, [phieuThuTienMatData?.receiveDate]);

    useEffect(() => {
        if (phieuThuTienMatData?.createdAt) {
            const data = {
                createdAt: dayjs(new Date(phieuThuTienMatData.createdAt).toISOString().slice(0, 10), dateFormat)
            }
            form.setFieldsValue({
                ...data
            });
        }

    }, [phieuThuTienMatData?.createdAt]);


    const nameValue = Form.useWatch('id', form);


    const [count, setCount] = useState(1);

    const handleDelete = (key) => {
        const newData = dataHoaDonSelected.filter((item) => item.key !== key);
        setDataHoaDonSelected(newData);
    };
    const defaultColumns = [
        {
            title: "ID hóa đơn",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            render: (val, record) => <span
                onClick={() => {
                    // navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`, { state: { id: selectedRowKeys } });
                    navigate(`/ban-hang/hoa-don-ban-hang/xem/${val}`, { state: { id: val } });
                }}
                className={`cursor-pointer font-medium text-[#1DA1F2] ${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "DELIVERED" ? "" : ""}`}>{val}</span>,
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: "Ngày hóa đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val, record) => new Date(val).toLocaleDateString("vi-VN"),
            sorter: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),

            // moment(a.createdAt, "DD-MM-YYYY") - moment(b.createdAt, "DD-MM-YYYY"),
            sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
            // fixed: 'left',
            editable: false,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            ellipsis: true,
            editable: false,
        },
        {
            title: "Giá trị hóa đơn",
            dataIndex: "tong",
            key: "tong",
            render: (val, record) => VND.format(val),
            sorter: (a, b) => a.tong - b.tong,
            sortOrder: sortedInfo.columnKey === "tong" ? sortedInfo.order : null,
        },
        // {
        //     title: "Chưa thu",
        //     dataIndex: "chuathu",
        //     key: "chuathu",
        //     render: (val, record) => VND.format(val),
        //     sorter: (a, b) => a.chuathu - b.chuathu,
        //     sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
        // },
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
            title: "Số thanh toán",
            dataIndex: "sothanhtoan",
            key: "sothanhtoan",
            render: (val, record) => VND.format(val),
            editable: true,
        },
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
        setDataHoaDonSelected([...dataHoaDonSelected, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        console.log("row", row);
        row.thanhtien = row.price * row.count;
        row.tienthuegtgt = row.price * row.count * (row.phantramthuegtgt / 100);

        const newData = [...dataHoaDonSelected];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataHoaDonSelected(newData);
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
                inputType: ['sothanhtoan'].includes(col.dataIndex) ? 'number' : 'text',
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
        console.log(dataHoaDonSelected);

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

        if (values.paymentMethod === "CASH") {
            let dataConvert = {
                "receiveDate": formatDate(values.receiveDate.$d),
                "content": values.content,
                "submitter": values.submitter,
                "customerId": dataHoaDonSelected[0].donBanHang.customer.id,
                "salespersonID": values.salespersonID,
                "chungTuDto": dataHoaDonSelected.map(hoaDon => {
                    return {
                        "money": hoaDon.sothanhtoan,
                        "content": hoaDon.content,
                        "ctbanId": hoaDon.id
                    }
                })
            }

            console.log("dataConvert", dataConvert)

            dispatch(postPhieuThuTienMat({ values: dataConvert }));
            navigate(-2);

        }
        else {
            let dataConvert = {
                "receiveDate": formatDate(values.receiveDate.$d),
                "content": values.content,
                "submitter": values.submitter,
                "customerId": dataHoaDonSelected[0].donBanHang.customer.id,
                "salespersonID": 1,
                "chungTuDto": dataHoaDonSelected.map(hoaDon => {
                    return {
                        "money": hoaDon.sothanhtoan,
                        "content": hoaDon.content,
                        "ctbanId": hoaDon.id
                    }
                }),
                "bankAccountId": values.bankAccountId
            }

            console.log("dataConvert", dataConvert)

            dispatch(postPhieuThuTienGui({ values: dataConvert }));
            navigate(-2);
        }

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



    //Xuat file pdf, in file
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-4">
                Phiếu thu tiền {Form.useWatch('paymentMethod', form) === "CASH" ? "mặt" : "gửi"} {phieuThuTienMatData?.id}
            </h1>


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
                            name='namecCustomer'
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

                        <Form.Item
                            label="Mã số thuế"
                            name='taxCode'
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


                        <Form.Item
                            label="Phương thức thanh toán"
                            name='paymentMethod'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Select
                                disabled={disabled}
                            >
                                <Select.Option value={"CASH"}>Tiền mặt</Select.Option>
                                <Select.Option value={"TRANSFER"}>Tiền gửi</Select.Option>
                            </Select>
                        </Form.Item>


                        {/* <Form.Item
                            label="Nhân viên bán hàng"
                            name='salespersonID'
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
                        </Form.Item> */}

                        {Form.useWatch('paymentMethod', form) === "TRANSFER" &&
                            <Form.Item
                                label="Số tài khoản"
                                name='bankAccountId'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Trường này là bắt buộc!',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={disabled}
                                    onChange={(value) => {
                                        const dataFilter = listBankAccountData.filter(item => item.id === value);
                                        console.log("dataFilter", dataFilter)

                                        const data = {
                                            accountName: dataFilter[0]?.accountName,
                                            bankName: dataFilter[0]?.bankName,
                                            branch: dataFilter[0]?.branch
                                        };

                                        console.log("dataa", data)

                                        form.setFieldsValue({
                                            ...data
                                        });
                                    }}
                                >
                                    {
                                        listBankAccountData.map(item => <Select.Option value={item.id} key={item.id}>{item.accountNumber}</Select.Option>)
                                    }
                                </Select>

                            </Form.Item>}
                        {Form.useWatch('paymentMethod', form) === "TRANSFER" &&
                            <Form.Item
                                label="Tên ngân hàng"
                                name='bankName'
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
                            </Form.Item>
                        }

                        {Form.useWatch('paymentMethod', form) === "CASH" &&
                            <Form.Item
                                label="Người nộp"
                                name='submitter'
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
                            </Form.Item>
                        }
                    </Flex>

                    <Flex vertical gap={5} className='w-[50%]'>

                        {Form.useWatch('paymentMethod', form) === "TRANSFER" &&
                            <Form.Item
                                label="Chi nhánh"
                                name='branch'
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
                            </Form.Item>
                        }


                        {Form.useWatch('paymentMethod', form) === "TRANSFER" &&
                            <Form.Item
                                label="Chủ tài khoản"
                                name='accountName'
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
                            </Form.Item>}










                        {Form.useWatch('paymentMethod', form) === "CASH" &&
                            <Form.Item
                                label="Người nhận"
                                name='salespersonID'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Trường này là bắt buộc!',
                                    },
                                ]}
                            >
                                <Select
                                    disabled={disabled}
                                >
                                    {/* {
                                        listAccountantData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                    } */}
                                    {
                                        listSalespersonData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>}

                        <Form.Item
                            label="Nội dung"
                            name='content'
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
                        </Form.Item>



                        <Form.Item
                            label="Ngày hạch toán"
                            name="createdAt"
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <DatePicker
                                className='!w-full'
                                disabled={true}
                            // format={dateFormat}
                            />
                        </Form.Item>


                        <Form.Item
                            label="Ngày chứng từ"
                            name="receiveDate"
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
                    </Flex>

                </Flex>

                <div className='flex justify-start flex-col mb-8'>
                    <div className='min-w-[300px]'>
                        <div className='flex'>
                            <p>Tham chiếu đến chứng từ bán hàng:</p>
                            <p>
                                {
                                    phieuThuTienMatData?.chungTuCuaPhieuThu?.map(ct => <span
                                        className='px-2 text-[#1DA1F2] font-medium	cursor-pointer'
                                        onClick={() => navigate(`/ban-hang/chung-tu-ban-hang/xem/${ct?.ctban?.id}`, { state: { id: ct?.ctban?.id } })}
                                    >{ct?.ctban?.id}</span>)
                                }
                            </p>
                        </div>
                    </div>
                    <div className='min-w-[300px]'>
                        <div className='flex'>
                            <p>Tham chiếu đến hóa đơn bán hàng:</p>
                            <p>
                                {
                                    phieuThuTienMatData?.chungTuCuaPhieuThu?.map(ct => <span
                                        className='px-2 text-[#1DA1F2] font-medium	cursor-pointer'
                                        onClick={() => navigate(`/ban-hang/hoa-don-ban-hang/xem/${ct?.ctban?.id}`, { state: { id: ct?.ctban?.id } })}
                                    >{ct?.ctban?.id}</span>)
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataHoaDonSelected}
                        columns={columns}
                        onChange={onChange}

                        pagination={false}
                        summary={(pageData) => {
                            let totalTong = 0;
                            let totalChuaThu = 0;
                            let totalSoThanhToan = 0;
                            pageData.forEach(({ tong, sothanhtoan, chuathu }) => {
                                totalTong += tong;
                                totalChuaThu += chuathu;
                                totalSoThanhToan += sothanhtoan;
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="font-bold">Tổng</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text className="font-bold">{VND.format(totalTong)}</Text>
                                        </Table.Summary.Cell>
                                        {/* <Table.Summary.Cell index={2}>
                                            <Text className="font-bold">{VND.format(totalChuaThu)}</Text>
                                        </Table.Summary.Cell> */}
                                        <Table.Summary.Cell index={3}>
                                            <Text className="font-bold">{VND.format(totalSoThanhToan)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </div>

                <div className='flex justify-end'>
                    <div className='w-[300px] my-8'>
                        {/* <div className='flex justify-between font-bold text-xl'>
                            <p>TỔNG</p>
                            <p>
                                {
                                    VND.format(dataHoaDonSelected.map(hoaDon => hoaDon.sothanhtoan).reduce((total, currentValue) => {
                                        return total + currentValue;
                                    }, 0)
                                        // +
                                        // dataHoaDonSelected.map(product => product.tienthuegtgt).reduce((total, currentValue) => {
                                        //     return total + currentValue;
                                        // }, 0)
                                    )
                                }
                            </p>
                        </div> */}
                    </div>
                </div>

                {disabled ?
                    <div className='w-full flex justify-end mt-6 mb-0'>
                        <Button
                            className='bg-[#46FF42] font-bold text-white mr-2'
                            type='link'
                            onClick={handlePrint}
                        >
                            In phiếu thu
                        </Button>
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

            <div
                className='hidden'
            >
                <div ref={componentRef}>
                    <InPhieuThu
                        form={form}
                        components={components}
                        dataSource={dataHoaDonSelected}
                        columns={columns}
                        // idHoaDon={chungTuBanData?.id}
                        idCustomer={phieuThuTienMatData?.customer?.id}
                        idPhieuThu={phieuThuTienMatData?.id}
                    />
                </div>
            </div>
        </div>
    )
}

export default XemPhieuThuTienMat