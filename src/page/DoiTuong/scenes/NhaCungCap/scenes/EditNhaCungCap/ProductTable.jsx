import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Checkbox, message } from 'antd';
import doiTuongService from '../../../../../../services/doiTuong.service';

const ProductTable = ({ products, onAddProducts, supplierId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (isModalVisible) {
            doiTuongService.getListProduct()
                .then(response => {
                    setAllProducts(response.data.result.data);
                })
                .catch(error => {
                    console.error("Error fetching products: ", error);
                });
        }
    }, [isModalVisible]);

    const handleAddProducts = async () => {
        const productIds = selectedProducts.map(product => product.id);
        const values = {
            id: supplierId,
            productIds,
        };

        try {
            await doiTuongService.addProductForSup({ values });
            message.success("Thêm sản phẩm thành công!");
            onAddProducts(selectedProducts);
            setIsModalVisible(false);
            setSelectedProducts([]);
        } catch (error) {
            message.error("Thêm sản phẩm thất bại!");
            console.error("Error adding products: ", error);
        }
    };

    const columns = [
        {
            title: 'ID sản phẩm',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            key: 'unit',
        },
    ];

    const productColumns = [
        {
            title: 'ID sản phẩm',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Chọn',
            dataIndex: 'select',
            key: 'select',
            render: (text, record) => (
                <Checkbox
                    checked={selectedProducts.some(product => product.id === record.id)}
                    onChange={e => {
                        const checked = e.target.checked;
                        if (checked) {
                            setSelectedProducts([...selectedProducts, record]);
                        } else {
                            setSelectedProducts(selectedProducts.filter(product => product.id !== record.id));
                        }
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Thêm sản phẩm
            </Button>
            <Table
                columns={columns}
                dataSource={products}
                pagination={false}
                style={{ marginTop: '16px' }}
            />
            <Modal
                title="Chọn sản phẩm"
                visible={isModalVisible}
                onOk={handleAddProducts}
                onCancel={() => setIsModalVisible(false)}
            >
                <Table
                    columns={productColumns}
                    dataSource={allProducts}
                    pagination={false}
                />
            </Modal>
        </>
    );
};

export default ProductTable;
