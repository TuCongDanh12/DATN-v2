import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Checkbox, message, Input, Select } from 'antd';
import doiTuongService from '../../../../../../services/doiTuong.service';
import copy from 'copy-to-clipboard';

const { Search } = Input;
const { Option } = Select;

const ProductTable = ({ products, onAddProducts, supplierId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [groupProducts, setGroupProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    useEffect(() => {
        if (isModalVisible) {
            doiTuongService.getListProduct()
                .then(response => {
                    setAllProducts(response.data.result.data);
                    setFilteredProducts(response.data.result.data);
                })
                .catch(error => {
                    console.error("Error fetching products: ", error);
                });
            
            // Fetch group products for filtering
            doiTuongService.getListProductGroup()
                .then(response => {
                    setGroupProducts(response.data.result.data);
                })
                .catch(error => {
                    console.error("Error fetching group products: ", error);
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

    const handleSearch = (text) => {
        setSearchText(text);
        filterProducts(text, selectedGroup);
    };

    const handleGroupChange = (value) => {
        setSelectedGroup(value);
        filterProducts(searchText, value);
    };

    const filterProducts = (text, group) => {
        let filtered = allProducts;
        if (text) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(text.toLowerCase())
            );
        }
        if (group) {
            filtered = filtered.filter(product => 
                product.productGroup.id === group
            );
        }
        setFilteredProducts(filtered);
    };

    const copyToClipboard = (text) => {
        copy(text);
        message.success("Sao chép ID thành công!");
    };

    const columns = [
        {
            title: 'ID sản phẩm',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            render: (text) => (
                <a onClick={() => copyToClipboard(text)}>{text}</a>
            ),
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
            render: (text) => (
                <a onClick={() => copyToClipboard(text)}>{text}</a>
            ),
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
                <div style={{ marginBottom: '16px' }}>
                    <Search
                        placeholder="Tìm kiếm sản phẩm"
                        onSearch={handleSearch}
                        onChange={e => handleSearch(e.target.value)}
                        value={searchText}
                        style={{ width: '60%', marginRight: '8px' }}
                    />
                    <Select
                        placeholder="Lọc theo nhóm sản phẩm"
                        onChange={handleGroupChange}
                        value={selectedGroup}
                        style={{ width: '38%' }}
                    >
                        <Option value="">Tất cả</Option>
                        {groupProducts.map(group => (
                            <Option key={group.id} value={group.id}>
                                {group.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <Table
                    columns={productColumns}
                    dataSource={filteredProducts}
                    pagination={false}
                />
            </Modal>
        </>
    );
};

export default ProductTable;
