import { Button, Checkbox, DatePicker, Dropdown, Flex, Form, Input, Select, Space, Table } from 'antd'
import React, { useState } from 'react'
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Search from 'antd/es/input/Search';
import { Link, useNavigate } from 'react-router-dom';

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);

// const suffix = (
//     <AudioOutlined
//       style={{
//         fontSize: 16,
//         color: '#1677ff',
//       }}
//     />
//   );
const onSearch = (value, _e, info) => console.log(info?.source, value);

const columns = [
    {
        title: "Ngày hóa đơn",
        dataIndex: "ngayhoadon",
    },
    {
        title: "Số hóa đơn",
        dataIndex: "sohoadon",
    },
    {
        title: "Khách hàng",
        dataIndex: "khachhang",
    },
    {
        title: "Hạn hạch toán",
        dataIndex: "hanhachtoan",
    },
    {
        title: "Tổng",
        dataIndex: "tong",
    },
    {
        title: "Chưa thu",
        dataIndex: "chuathu",
    },
    {
        title: "Điều khoản thanh toán",
        dataIndex: "dieukhoanthanhtoan",
    },
];

const data = [
    {
        key: "1",
        ngayhoadon: "23/10/2023",
        sohoadon: "HĐ00001",
        khachhang: "SIÊU THỊ CÀ MAU",
        hanhachtoan: "22/11/2023",
        tong: "847.000.000",
        chuathu: "847.000.000",
        dieukhoanthanhtoan: "Điều khoản 1",
    },
    {
        key: "2",
        ngayhoadon: "23/10/2023",
        sohoadon: "HĐ00002",
        khachhang: "SIÊU THỊ CÀ MAU",
        hanhachtoan: "22/11/2023",
        tong: "77.000.000",
        chuathu: "77.000.000",
        dieukhoanthanhtoan: "",
    },
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
        );
    },
};

const TimKiemThuTien = () => {
    const navigate = useNavigate();

    // const [selectedOption, setSelectedOption] = useState("Tiền mặt");

    // const handleChangeSelectedOption = (e) => {
    //     console.log(e)
    //     setSelectedOption(e);
    // }
    return (
        <div className='m-4'>
            <h1 className="mx-[30px] font-bold text-[32px] mb-2">
                Thu tiền theo hóa đơn
            </h1>

            <Flex vertical gap={20} className='mx-[30px]'>
                {/* <Flex align="center" gap={5}>
                    <p>Phương thức thanh toán</p>
                    <Select
                        className="!w-[200px]"
                        defaultValue="Tiền mặt"
                        style={{ width: 120 }}
                        onChange={handleChangeSelectedOption}
                        options={[
                            { value: "Tiền mặt", label: "Tiền mặt" },
                            { value: "Tiền gửi", label: "Tiền gửi" }
                        ]}
                    />
                </Flex> */}

                <Flex gap={20}>
                    <Form.Item label="Tên khách hàng">
                        {/* mx-[30px] */}
                        <Input
                            className='!w-[400px]'
                            defaultValue="SIÊU THỊ CÀ MAU" />
                    </Form.Item>

                    <Form.Item label="Hạn hạch toán">
                        {/* mx-[30px] */}
                        {/* <DatePicker
                            className='!w-[150px]'

                            defaultValue={dayjs("2015/01/01", dateFormat)}
                            format={dateFormat}
                        /> */}
                        <DatePicker.RangePicker
                            placeholder={['', 'Till Now']}
                            allowEmpty={[false, true]}
                            onChange={(date, dateString) => {
                                console.log(date, dateString);
                            }}
                        />
                    </Form.Item>
                    <Button
                        className='!bg-white font-bold '
                    >
                        Lấy dữ liệu
                    </Button>
                </Flex>


            </Flex>

            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
            />

            <div className='w-full flex justify-end gap-5'>
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
                    onClick={() => navigate("thutien")}
                >
                    Thu tiền
                </Button>
            </div>

        </div>
    )
}

export default TimKiemThuTien