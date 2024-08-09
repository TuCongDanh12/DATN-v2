import React, { useState } from 'react';
import { VND } from '../../../../../../utils/func';
import { InputNumber, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const useColumns = (sortedInfo, handlePaymentChange) => {
    const navigate = useNavigate();
    const [paymentValues, setPaymentValues] = useState({}); // Trạng thái để lưu các giá trị thanh toán

    const handleMaxPayment = (id, maxValue) => {
        setPaymentValues(prev => ({ ...prev, [id]: maxValue }));
        handlePaymentChange(id, maxValue);
    };

    const handleInputChange = (id, value) => {
        setPaymentValues(prev => ({ ...prev, [id]: value }));
        handlePaymentChange(id, value);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
            render: (val, record) => (
                <span
                    onClick={() => navigate(`/ban-hang/hoa-don-ban-hang/xem/${val}`, { state: { id: val } })}
                    className="cursor-pointer font-medium text-[#1DA1F2]"
                >
                    {val}
                </span>
            ),
            sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
            title: "Ngày hóa đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: val => new Date(val).toLocaleDateString("vi-VN"),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
        },
        {
            title: "Khách cung cấp",
            dataIndex: "donMuaHang",
            key: "customer",
            ellipsis: true,
            render: (donMuaHang) => donMuaHang?.supplier?.accountName || 'N/A',
        },
        {
            title: "Giá trị hóa đơn",
            dataIndex: "finalValue",
            key: "finalValue",
            render: (val) => VND.format(val),
        },
        {
            title: "Chưa chi",
            key: "chuathu",
            render: (record) => {
                const chuaChi = record.finalValue - record.paidValue;
                return VND.format(chuaChi);
            },
        },
        {
            title: "Số thanh toán",
            key: "sothanhtoan",
            render: (record) => {
                const chuaChi = record.finalValue - record.paidValue;
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InputNumber
                            min={0}
                            max={chuaChi}
                            value={paymentValues[record.id] || 0} // Hiển thị giá trị hiện tại từ trạng thái
                            onChange={(value) => handleInputChange(record.id, value)}
                            parser={value => value.replace(/[^0-9.-]+/g, '')}
                            style={{ marginRight: 8 }}
                        />
                        <Button
                            type="link"
                            onClick={() => handleMaxPayment(record.id, chuaChi)}
                        >
                            Trả hết
                        </Button>
                    </div>
                );
            },
        },
    ];

    return columns;
};

export default useColumns;
