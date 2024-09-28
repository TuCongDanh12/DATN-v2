import React from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";

const TableBaoCao = ({ reports }) => {
    const navigate = useNavigate();

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên báo cáo",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Thời gian",
            dataIndex: "time",
            key: "time",
            render: (_, record) => `${record.startDate} - ${record.endDate}`,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button className='!text-white-500' type="primary" onClick={() => navigate(`/bao-cao/bao-cao-mua-hang/${record.id}`)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={reports}
            rowKey="id"
            pagination={false}
        />
    );
};

export default TableBaoCao;
