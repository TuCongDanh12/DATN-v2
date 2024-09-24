import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, Flex, Table, Button, Select, Typography, InputNumber, Modal, notification } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { doiTuongSelector, getListCustomerGroup, getCustomer, clearState, updateCustomer, postDieuKhoanThanhToan, postCktm, updateDieuKhoanThanhToan, updateCktm, deleteCktm, deleteDieuKhoanThanhToan } from '../../../../../../store/features/doiTuongSilce';
import { FaCheck } from "react-icons/fa";
import { VND } from '../../../../../../utils/func';
import { MdOutlineDelete } from "react-icons/md";


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
    const inputNode = inputType === 'number' ? <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} /> : <Input ref={inputRef} onPressEnter={save} onBlur={save} />;

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


const EditKhachHang = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    console.log("params", params)
    console.log("params.id", params.id)
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const {
        customerData,
        listCustomerGroupData,
        isSuccessPostDieuKhoanThanhToan,
        isSuccessPostCktm,
        isError,
        message,
        isSuccessUpdateDieuKhoanThanhToan,
        isSuccessUpdateCktm,
        isSuccessDeleteDieuKhoanThanhToan,
        isSuccessDeleteCktm
    } = useSelector(doiTuongSelector);
    console.log("customerData", customerData);

    const [dataSource, setDataSource] = useState([]);

    const [dataSource2, setDataSource2] = useState([]);


    useEffect(() => {
        dispatch(getCustomer({ id: params.id }));
        dispatch(getListCustomerGroup());
    }, []);

    useEffect(() => {
        if (customerData) {
            form.setFieldsValue({
                ...customerData
            });

            setDataSource(customerData.dieuKhoans);
            setDataSource2(customerData.cktms);
        }
    }, [customerData]);

    const [api, contextHolder] = notification.useNotification();


    useEffect(() => {
        if (isSuccessPostDieuKhoanThanhToan) {
            api.success({
                message: 'Thêm dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });

            dispatch(clearState());
            dispatch(getCustomer({ id: params.id }));
        }
        else if (isSuccessPostCktm) {
            api.success({
                message: 'Thêm dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });

            dispatch(clearState());
            dispatch(getCustomer({ id: params.id }));
        }
        else if (isSuccessUpdateDieuKhoanThanhToan) {
            api.success({
                message: 'Cập nhật dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });
            dispatch(getCustomer({ id: params.id }));
            dispatch(clearState());
        }
        else if (isSuccessUpdateCktm) {
            api.success({
                message: 'Cập nhật dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });
            dispatch(getCustomer({ id: params.id }));
            dispatch(clearState());
        }
        else if(isSuccessDeleteDieuKhoanThanhToan){
            api.success({
                message: 'Xóa dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });
            dispatch(getCustomer({ id: params.id }));
            dispatch(clearState());
        }
        else if(isSuccessDeleteCktm){
            api.success({
                message: 'Xóa dữ liệu thành công!',
                placement: 'bottomLeft',
                duration: 2
            });
            dispatch(getCustomer({ id: params.id }));
            dispatch(clearState());
        }
        if (isError) {
            api.error({
                message: message,
                placement: 'bottomLeft',
                duration: 2
            });

            dispatch(clearState());
        }
    }, [
        isSuccessPostCktm,
        isSuccessPostDieuKhoanThanhToan,
        isError,
        message,
        isSuccessUpdateDieuKhoanThanhToan,
        isSuccessUpdateCktm,
        isSuccessDeleteDieuKhoanThanhToan,
        isSuccessDeleteCktm
    ]);

    const nameValue = Form.useWatch('name', form);


    const [count, setCount] = useState(1);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    let defaultColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            ellipsis: true,
            width: '7%',
        },
        {
            title: 'Tên điều khoản thanh toán',
            dataIndex: 'name',
            editable: !disabled,
            ellipsis: true,
        },
        {
            title: 'Số ngày được nợ',
            dataIndex: 'paymentPeriod',
            editable: !disabled,
            ellipsis: true,
            width: '12%',
        },
        {
            title: 'Số lượng SP tối thiểu',
            dataIndex: 'minOrderQuantity',
            editable: !disabled,
            ellipsis: true,
            width: '12%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            editable: !disabled,
            ellipsis: true,
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'operation',
            width: '100px',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Typography.Link
                        onClick={() => {
                            // handleDelete(record.key)
                            console.log("record", record)
                            const dataConvert = {
                                "name": record.name,
                                "description": record.description,
                                "paymentPeriod": record.paymentPeriod,
                                "minProductValue": record.minProductValue,
                                "id": record.id
                            }
                            dispatch(updateDieuKhoanThanhToan({ values: dataConvert }));
                        }

                        }
                        className='flex justify-center'>
                        <FaCheck size={20} color='#1E1E1E' />
                    </Typography.Link>
                ) : null,
        },
        {
            title: 'Xóa',
            dataIndex: 'delete',
            width: '60px',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Typography.Link
                        onClick={() => {
                            // handleDelete(record.key)
                            // console.log("record", record)
                            // const dataConvert = {
                            //     // "name": record.name,
                            //     // "description": record.description,
                            //     // "paymentPeriod": record.paymentPeriod,
                            //     // "minProductValue": record.minProductValue,
                            //     "id": record.id
                            // }
                            // dispatch(deleteDieuKhoanThanhToan({ values: dataConvert }));
                            setDataSelected(record);
                            setOpenDeleteDieuKhoanThanhToan(true);
                        }

                        }
                        className='flex justify-center'>
                        <MdOutlineDelete size={30} color='#1E1E1E' />
                    </Typography.Link>
                ) : null,
        },
    ];


    let defaultColumns2 = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            ellipsis: true,
            width: '7%',
        },
        {
            title: 'Tên chiết khấu',
            dataIndex: 'name',
            editable: !disabled,
            ellipsis: true,
        },
        {
            title: 'Số tiền tối thiểu để nhận được chiết khấu',
            dataIndex: 'minProductValue',
            editable: !disabled,
            ellipsis: true,
            render: (val, record) => VND.format(val),
            width: '12%',
        },
        {
            title: '% chiết khấu',
            dataIndex: 'discountRate',
            editable: !disabled,
            width: '12%',

        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            editable: !disabled,
            ellipsis: true,
        },
        {
            title: 'Chỉnh sửa',
            dataIndex: 'operation',
            width: '100px',
            render: (_, record) =>
                dataSource2.length >= 1 ? (
                    <Typography.Link
                        onClick={() => {
                            // handleDelete(record.key)
                            console.log("record", record)
                            const dataConvert = {
                                "name": record.name,
                                "description": record.description,
                                "discountRate": record.discountRate,
                                "minProductValue": record.minProductValue,
                                "id": record.id
                            }
                            dispatch(updateCktm({ values: dataConvert }));
                        }}
                        className='flex justify-center'>
                        <FaCheck size={20} color='#1E1E1E' />
                    </Typography.Link>
                ) : null,
        },
        {
            title: 'Xóa',
            dataIndex: 'delete',
            width: '60px',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Typography.Link
                        onClick={() => {
                            // handleDelete(record.key)
                            // console.log("record", record)
                            // const dataConvert = {
                            //     // "name": record.name,
                            //     // "description": record.description,
                            //     // "paymentPeriod": record.paymentPeriod,
                            //     // "minProductValue": record.minProductValue,
                            //     "id": record.id
                            // }
                            // dispatch(deleteCktm({ values: dataConvert }));
                            setDataSelected(record);
                            setOpenDeleteChietKhauThuongMai(true);
                        }

                        }
                        className='flex justify-center'>
                        <MdOutlineDelete size={30} color='#1E1E1E' />
                    </Typography.Link>
                ) : null,
        },
    ];


    if (disabled) {
        defaultColumns = defaultColumns.filter(item => item.dataIndex !== "operation" && item.dataIndex !== "delete");
        defaultColumns2 = defaultColumns2.filter(item => item.dataIndex !== "operation" && item.dataIndex !== "delete");
    }

    const handleAdd = () => {
        const newData = {
            'key': count,
            'tenchietkhau': '.',
            'songayduocno': '.',
            'songayhuongchietkhau': '.',
            'discountRate': '.',
            'noidung': '.',
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const handleSave2 = (row) => {
        const newData = [...dataSource2];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource2(newData);
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
                inputType: ['paymentPeriod', 'minOrderQuantity'].includes(col.dataIndex) ? 'number' : 'text',
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const columns2 = defaultColumns2.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: ['discountRate', 'minProductValue'].includes(col.dataIndex) ? 'number' : 'text',
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave2,
            }),
        };
    });



    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // console.log(dataSource);
        const dataConvert = {
            ...values,
            id: customerData.id
        }
        dispatch(updateCustomer({ values: dataConvert }));
        navigate(-1);
    };


    //add dieu khoan thanh toan
    const [openAddDieuKhoanThanhToan, setOpenAddDieuKhoanThanhToan] = useState(false);
    const [formAddDieuKhoanThanhToan] = Form.useForm();

    const handleCancelAddDieuKhoanThanhToan = () => {
        setOpenAddDieuKhoanThanhToan(false);
    }

    const onFinishAddDieuKhoanThanhToan = (values) => {
        console.log('Received values of form: ', values);

        const dataConvert = {
            ...values,
            "customerId": customerData.id,
        }
        formAddDieuKhoanThanhToan.resetFields();
        dispatch(postDieuKhoanThanhToan({ values: dataConvert }));
    };

    //add chiet khau thương mại
    const [openAddChietKhauThuongMai, setOpenAddChietKhauThuongMai] = useState(false);
    const [formAddChietKhauThuongMai] = Form.useForm();

    const handleCancelAddChietKhauThuongMai = () => {
        setOpenAddChietKhauThuongMai(false);
    }

    const onFinishAddChietKhauThuongMai = (values) => {
        console.log('Received values of form: ', values);

        const dataConvert = {
            ...values,
            "customerId": customerData.id
        }
        dispatch(postCktm({ values: dataConvert }));
        formAddChietKhauThuongMai.resetFields();
    };

    //delete
    const [dataSelected, setDataSelected] = useState({});

    //delete ĐKTT
    const [openDeleteDieuKhoanThanhToan, setOpenDeleteDieuKhoanThanhToan] = useState(false);

    const handleCancelDeleteDieuKhoanThanhToan = () => {
        setOpenDeleteDieuKhoanThanhToan(false);
    };

    //delete CKTT
    const [openDeleteChietKhauThuongMai, setOpenDeleteChietKhauThuongMai] = useState(false);

    const handleCancelDeleteChietKhauThuongMai = () => {
        setOpenDeleteChietKhauThuongMai(false);
    };



    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-8">
                Khách hàng {nameValue || customerData.name}
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
                            label="Nhóm khách hàng"
                            name='customerGroup'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Select
                                disabled={true}
                            >
                                {
                                    listCustomerGroupData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Tên khách hàng"
                            name='name'
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
                                disabled={disabled}
                            />
                        </Form.Item>


                    </Flex>

                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Số điện thoại"
                            name='phone'
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
                            label="Email"
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input
                                placeholder="abc@gmail.com"
                                disabled={disabled}

                            />
                        </Form.Item>


                        <Form.Item
                            label="Ghi chú"
                            name='note'
                        >
                            <Input
                                disabled={disabled}

                            />
                        </Form.Item>
                    </Flex>

                </Flex>


                <div>
                    <div className='flex gap-4'>
                        <Button
                            className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1 mb-4'
                            onClick={() => setOpenAddDieuKhoanThanhToan(true)}
                            disabled={disabled}
                        >
                            Thêm điều khoản thanh toán
                        </Button>

                        <Modal
                            title="THÊM ĐIỀU KHOẢN THANH TOÁN"
                            centered
                            open={openAddDieuKhoanThanhToan}
                            width={700}
                            footer=''
                            onCancel={handleCancelAddDieuKhoanThanhToan}
                        >
                            <Form
                                form={formAddDieuKhoanThanhToan}
                                layout='horizontal'
                                onFinish={onFinishAddDieuKhoanThanhToan}
                                labelCol={{
                                    flex: '200px',
                                }}
                                labelAlign="left"
                                className='mt-4'
                            >
                                <Form.Item
                                    label="Tên điều khoản thanh toán"
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
                                    label="Số ngày được nợ"
                                    name='paymentPeriod'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trường này là bắt buộc!',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{
                                            width: '100%',
                                        }} />
                                </Form.Item>

                                <Form.Item
                                    label="Số lượng sản phẩm tối thiểu"
                                    name='minOrderQuantity'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trường này là bắt buộc!',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{
                                            width: '100%',
                                        }} />
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
                                        onClick={() => setOpenAddDieuKhoanThanhToan(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className='!bg-[#67CDBB] font-bold text-white'
                                        htmlType="submit"
                                        onClick={() => setOpenAddDieuKhoanThanhToan(false)}
                                    >
                                        Xác nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>

                        <Button
                            className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1 mb-4'
                            onClick={() => setOpenAddChietKhauThuongMai(true)}
                            disabled={disabled}
                        >
                            Thêm chiết khấu thương mại
                        </Button>

                        <Modal
                            title="THÊM CHIẾT KHẤU THƯƠNG MẠI"
                            centered
                            open={openAddChietKhauThuongMai}
                            width={700}
                            footer=''
                            onCancel={handleCancelAddChietKhauThuongMai}
                        >
                            <Form
                                form={formAddChietKhauThuongMai}
                                layout='horizontal'
                                onFinish={onFinishAddChietKhauThuongMai}
                                labelCol={{
                                    flex: '200px',
                                }}
                                labelAlign="left"
                                className='mt-4'
                            >
                                <Form.Item
                                    label="Tên chiết khấu"
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
                                    label="Số tiền tối thiểu"
                                    name='minProductValue'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trường này là bắt buộc!',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        addonAfter='đ'
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{
                                            width: '100%',
                                        }} />
                                </Form.Item>

                                <Form.Item
                                    label="% chiết khấu"
                                    name='discountRate'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Trường này là bắt buộc!',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        style={{
                                            width: '100%',
                                        }} />
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
                                        onClick={() => setOpenAddChietKhauThuongMai(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className='!bg-[#67CDBB] font-bold text-white'
                                        htmlType="submit"
                                        onClick={() => setOpenAddChietKhauThuongMai(false)}
                                    >
                                        Xác nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>



                        <Modal
                            title=""
                            centered
                            open={openDeleteDieuKhoanThanhToan}
                            width={500}
                            footer=""
                            onCancel={handleCancelDeleteDieuKhoanThanhToan}
                        >
                            <div className="m-8 mt-10 text-center">
                                Bạn muốn xóa điều khoản thanh toán
                                <br /> <strong>"{dataSelected.name}"</strong>?
                            </div>

                            <div className="flex justify-end gap-2 mb-0">
                                <Button
                                    className="!bg-[#FF7742] font-bold text-white mr-2"
                                    onClick={() => {
                                        setDataSelected({});
                                        setOpenDeleteDieuKhoanThanhToan(false);
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    className="!bg-[#67CDBB] font-bold text-white"
                                    onClick={() => {
                                        const dataConvert = {
                                            "id": dataSelected.id
                                        }
                                        console.log("id", dataConvert)
                                        dispatch(deleteDieuKhoanThanhToan({ values: dataConvert }));
                                        setDataSelected({});
                                        setOpenDeleteDieuKhoanThanhToan(false);
                                    }}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Modal>





                        <Modal
                            title=""
                            centered
                            open={openDeleteChietKhauThuongMai}
                            width={500}
                            footer=""
                            onCancel={handleCancelDeleteChietKhauThuongMai}
                        >
                            <div className="m-8 mt-10 text-center">
                                Bạn muốn xóa chiết khấu thương mại
                                <br /> <strong>"{dataSelected.name}"</strong>?
                            </div>

                            <div className="flex justify-end gap-2 mb-0">
                                <Button
                                    className="!bg-[#FF7742] font-bold text-white mr-2"
                                    onClick={() => {
                                        setDataSelected({});
                                        setOpenDeleteChietKhauThuongMai(false);
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    className="!bg-[#67CDBB] font-bold text-white"
                                    onClick={() => {
                                        const dataConvert = {
                                            "id": dataSelected.id
                                        }
                                        console.log("id", dataConvert)
                                        dispatch(deleteCktm({ values: dataConvert }));
                                        setDataSelected({});
                                        setOpenDeleteChietKhauThuongMai(false);
                                    }}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Modal>

                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        className='mb-4'
                    />

                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource2}
                        columns={columns2}
                        pagination={false}
                    />
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

export default EditKhachHang