import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, Flex, Table, Button, Select, Typography, InputNumber } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { TbFileExport } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { clearState, doiTuongSelector, getListProductGroup, getSupplier, postBankAccount, postProduct, postSupplier } from '../../../../../../store/features/doiTuongSilce';

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


const ThemTaiKhoanNganHang = ({ disabled = true }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { listSupplierData,
        supplierData,
        listProductGroupData,
        supplierGroupData,
        isSuccess
    } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getListProductGroup());
    }, []);

    const nameValue = Form.useWatch('name', form);

    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            'tenchietkhau': 'Chiết khấu 1',
            'songayduocno': '20',
            'songayhuongchietkhau': '10',
            'phantramchietkhau': '2',
            'noidung': '...',
        }
    ]);

    const [count, setCount] = useState(1);


    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Tên chiết khấu',
            dataIndex: 'tenchietkhau',
            width: '30%',
            editable: !disabled,
        },
        {
            title: 'Số ngày được nợ',
            dataIndex: 'songayduocno',
            editable: !disabled,
        },
        {
            title: 'Số ngày hưởng chiết khấu',
            dataIndex: 'songayhuongchietkhau',
            editable: !disabled,
        },
        {
            title: '% chiết khấu',
            dataIndex: 'phantramchietkhau',
            editable: !disabled,
        },
        {
            title: 'Nội dung',
            dataIndex: 'noidung',
            editable: !disabled,
        },
        {
            title: '',
            dataIndex: 'operation',
            width: '50px',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Typography.Link onClick={() => handleDelete(record.key)} className='flex justify-center'>
                        <RiDeleteBin6Line size={20} color='#1E1E1E' />
                    </Typography.Link>
                ) : null,
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
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
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
                inputType: ['songayduocno', 'songayhuongchietkhau', 'phantramchietkhau'].includes(col.dataIndex) ? 'number' : 'text',
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        console.log(dataSource);

        dispatch(postBankAccount({ values }));
        navigate(-1);
    };

    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-8">
                Tài khoản ngân hàng 
                {/* {nameValue} */}
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
                //using init set value 
                initialValues={{
                    // 'dia-chi': 'default value'
                }}
            >
                <Flex gap={100} justify='center' className='w-[100%] align-left'>
                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Số tài khoản"
                            name='accountNumber'
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


                    </Flex>
                    

                    <Flex vertical gap={5} className='w-[50%]'>
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


                {/* <div>
                    <Button
                        className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1 mb-4'
                        onClick={handleAdd}
                        disabled={disabled}
                    >
                        Thêm 1 dòng
                    </Button>

                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </div> */}

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

            {/* <div className='w-full flex justify-end gap-5'>
                    <Button
                        className='bg-[#FF7742] font-bold text-white'
                        type='link'
                        onClick={() => navigate(-1)}
                    >
                        Thoát
                    </Button>
                    <Button
                        className='!bg-[#67CDBB] font-bold text-white'
                        type='link'
                        onClick={() => navigate(-1)}
                    >
                        Xác nhận
                    </Button>
            </div> */}


        </div>
    )
}

export default ThemTaiKhoanNganHang