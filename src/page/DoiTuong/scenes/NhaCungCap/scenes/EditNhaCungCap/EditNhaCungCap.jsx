import React, { useEffect, useState } from 'react';
import { Tabs, Form, Typography } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doiTuongSelector, getListSupplierGroup, getSupplier } from '../../../../../../store/features/doiTuongSilce';
import SupplierForm from './SupplierForm';
import ProductTable from './ProductTable';
import { EditableRow, EditableCell } from './EditableRow';

const { TabPane } = Tabs;

const EditNhaCungCap = ({ disabled = false }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { listSupplierGroupData, supplierData } = useSelector(doiTuongSelector);

    useEffect(() => {
        dispatch(getSupplier({ id: params.id }));
        dispatch(getListSupplierGroup());
    }, [dispatch, params.id]);

    useEffect(() => {
        if (supplierData) {
            form.setFieldsValue({
                ...supplierData
            });
            setProducts(supplierData.products || []);
        }
    }, [supplierData, form]);

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
    const [products, setProducts] = useState([]);

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

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

    const handleAddProducts = (selectedProducts) => {
        setProducts([...products, ...selectedProducts]);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = [
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
    ].map((col) => {
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

    return (
        <div className="m-6">
            <h1 className="font-bold text-[32px] mb-8">
                Nhà cung cấp {supplierData?.name}
            </h1>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Chung" key="1">
                    <SupplierForm
                        form={form}
                        listSupplierGroupData={listSupplierGroupData}
                        supplierData={supplierData}
                        disabled={disabled}
                        handleAdd={handleAdd}
                        dataSource={dataSource}
                        components={components}
                        columns={columns}
                        navigate={navigate}
                    />
                </TabPane>

                <TabPane tab="Sản phẩm" key="2">
                    <ProductTable
                        products={products}
                        onAddProducts={handleAddProducts}
                        disabled={disabled}
                        supplierId={params.id}
                        navigate={navigate}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default EditNhaCungCap;