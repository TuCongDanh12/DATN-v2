import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, Flex, Table, Button, Select, Typography, InputNumber } from "antd";
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { doiTuongSelector, getProductGroup, updateProductGroup } from '../../../../../../store/features/doiTuongSilce';

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


const EditNhomSanPham = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    console.log("params", params)
    console.log("params.id", params.id)
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const {
        productGroupData, } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getProductGroup({ id: params.id }));
    }, []);

    useEffect(() => {
        if (productGroupData) {
            form.setFieldsValue({
                ...productGroupData
            });
        }
    }, [productGroupData]);

    const nameValue = Form.useWatch('ten-nha-cung-cap', form);

    const [dataSource, setDataSource] = useState([]);

    const [count, setCount] = useState(1);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: "ID sản phẩm",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            // sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: '30%',
            editable: false,
        },
        {
            title: "Giá mua",
            dataIndex: "priceReceived",
            sorter: (a, b) => a.priceReceived - b.priceReceived,
            editable: false,
        },
        {
            title: "Giá bán",
            dataIndex: "priceDelivery",
            sorter: (a, b) => a.priceDelivery - b.priceDelivery,
            editable: false,
        },
        {
            title: "Đơn vị tính",
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
            filters: [
                {
                    value: "CAI",
                    text: "Cái",
                },
                {
                    value: "CAY",
                    text: "Cây",
                },
                {
                    value: "CHAI",
                    text: "Chai",
                },
                {
                    value: "CHUC",
                    text: "Chục",
                },
                {
                    value: "CUON",
                    text: "Cuộn",
                },
                {
                    value: "GOI",
                    text: "Gói",
                },
                {
                    value: "HOP",
                    text: "Hộp",
                },
                {
                    value: "HU",
                    text: "Hủ",
                },
                {
                    value: "KG",
                    text: "Kg",
                },
                {
                    value: "LOC",
                    text: "Lốc",
                },
                {
                    value: "LON",
                    text: "Lon",
                },
                {
                    value: "THUNG",
                    text: "Thùng",
                },
                {
                    value: "VIEN",
                    text: "Viên",
                },
                {
                    value: "LON",
                    text: "Lon",
                },
            ],
            onFilter: (value, record) => record.unit.indexOf(value) === 0,

        },
        // {
        //     title: "% thuế GTGT",
        //     dataIndex: "tax",
        //     // sorter: (a, b) => a.name.localeCompare(b.name),
        //     editable: false,
        // },
        {
            title: "Số dư",
            dataIndex: "category",
            editable: false,
        },
        {
            title: "Ghi chú",
            dataIndex: "description",
            editable: false,
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
        // console.log(dataSource);
        const dataConvert = {
            ...values,
            id: productGroupData.id
        }
        dispatch(updateProductGroup({ values: dataConvert }));
        navigate(-1);
    };

    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-8">
                Nhóm sản phẩm {nameValue || productGroupData.name}
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
                            label="Nhóm sản phẩm"
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
                            label="% thuế GTGT"
                            name="tax"
                            rules={[
                                {
                                    required: true,
                                    message: "Trường này là bắt buộc!",
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{
                                    width: "100%",
                                }}
                                disabled={disabled}
                            />
                        </Form.Item>
                    </Flex>

                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Mô tả"
                            name='description'
                        >
                            <Input
                                disabled={disabled}

                            />
                        </Form.Item>
                    </Flex>

                </Flex>


                <div className='mt-4'>
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
                        dataSource={productGroupData.products}
                        columns={columns}
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

export default EditNhomSanPham