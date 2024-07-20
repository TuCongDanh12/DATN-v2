import React, { useState } from 'react'
import { Form, Input, DatePicker, Flex, Table, Button, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useNavigate } from 'react-router-dom';

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);

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
    {
        title: "Số thanh toán",
        dataIndex: "sothanhtoan",
    }
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
        sothanhtoan: "847.000.000"
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
        sothanhtoan: "77.000.000"
    },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
        );
    },
};

const ThuTien = ({ tiengui }) => {
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState("Tiền mặt");

    const handleChangeSelectedOption = (e) => {
        console.log(e)
        setSelectedOption(e);
    }

    return (
        <div className='m-4'>
            <h1 className="mx-[30px] font-bold text-[32px] mb-2">
                Phiếu thu tiền mặt khách hàng  PTTM00001
            </h1>
            <Flex gap={20} className='mx-[30px] mb-4'>
                <Flex gap={5} align="center" justify="center">
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
                </Flex>
            </Flex>
            <div>
                <Form labelCol={{ span: 10 }} className='mb-4'>

                    <Flex gap={200}>
                        <Flex vertical gap={5}>
                            <Form.Item label="Tên khách hàng">
                                <Input
                                    className='!w-[400px]'
                                    disabled defaultValue="SIÊU THỊ CÀ MAU" />
                            </Form.Item>

                            <Form.Item label="Địa chỉ">
                                <Input
                                    className='!w-[400px]'
                                    disabled
                                    defaultValue="1-2 Bãy Thiện, Thành phố Cà Mau, Tỉnh Cà Mau, Việt Nam"
                                />
                            </Form.Item>

                            <Form.Item label="Mã số thuế">
                                <Input
                                    className='!w-[400px]'
                                    disabled defaultValue="2000106948-001" />
                            </Form.Item>


                            {
                                selectedOption === "Tiền mặt" ?
                                    <Form.Item label="Người nộp">
                                        <Input className='!w-[400px]'
                                            disabled defaultValue="Nguyễn Văn A" />
                                    </Form.Item>
                                    :
                                    <Form.Item label="TK ngân hàng">
                                        <Input className='!w-[400px]'
                                            disabled defaultValue="01026-348 / Ngân hàng TMCP Công Thương Việt Nam" />
                                    </Form.Item>
                            }

                            <Form.Item label="Người nhận">
                                <Input className='!w-[400px]'
                                    disabled defaultValue="Nguyễn Tiến Dũng" />
                            </Form.Item>


                            {/* <Form.Item label="Nội dung">
                            <Input className='!w-[400px]'
                                disabled defaultValue="..." />
                        </Form.Item> */}
                        </Flex>
                        <Flex vertical gap={5}>
                            <Form.Item label="Số chứng từ">
                                <Input className='!w-[400px]' disabled defaultValue="TTM00001" />
                            </Form.Item>

                            <Form.Item label="Ngày hạch toán">
                                <DatePicker
                                    className='!w-[400px]'
                                    disabled
                                    defaultValue={dayjs("2015/01/01", dateFormat)}
                                    format={dateFormat}
                                />
                            </Form.Item>

                            <Form.Item label="Ngày chứng từ">
                                <DatePicker
                                    className='!w-[400px]'
                                    disabled
                                    defaultValue={dayjs("2015/01/01", dateFormat)}
                                    format={dateFormat}
                                />
                            </Form.Item>

                            <Form.Item label="Nội dung">
                                <Input className='!w-[400px]'
                                    disabled defaultValue="..." />
                            </Form.Item>
                        </Flex>
                    </Flex>
                </Form>
                <div>
                    {/* <Divider /> */}

                    <Table
                        // rowSelection={{
                        //     type: "checkbox",
                        //     ...rowSelection,
                        // }}
                        columns={columns}
                        dataSource={data}
                    />
                </div>

                <div className='w-[300px] m-8'>
                    <div className='flex justify-between'>
                        <p>Tổng tiền hàng</p>
                        <p>770.000.000</p>
                    </div>
                    <div className='flex justify-between border-b border-zinc-950'>
                        <p>Thuế GTGT</p>
                        <p>77.000.000</p>
                    </div>
                    <div className='flex justify-between font-bold'>
                        <p>TỔNG</p>
                        <p>847.000.000</p>
                    </div>
                </div>

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
                        onClick={() => navigate(-2)}
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ThuTien