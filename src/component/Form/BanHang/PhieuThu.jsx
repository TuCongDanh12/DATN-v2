import React from 'react'
import { Form, Input, DatePicker, Flex, Table } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);

const columns = [
    // {
    //     title: "Mã hàng",
    //     dataIndex: "mahang",
    // },
    // {
    //     title: "Tên hàng",
    //     dataIndex: "tenhang",
    // },
    // {
    //     title: "ĐVT",
    //     dataIndex: "dvt",
    // },
    // {
    //     title: "Số lượng",
    //     dataIndex: "soluong",
    // },
    // {
    //     title: "Đơn giá",
    //     dataIndex: "dongia",
    // },
    // {
    //     title: "Thành tiền",
    //     dataIndex: "thanhtien",
    // },

    {
        title: "Nội dung",
        dataIndex: "noidung",
    },
    {
        title: "Số tiền",
        dataIndex: "sotien",
    },
];
const data = [
    {
        key: "1",
        // mahang: "VT00001",
        // tenhang: 'Bàn phím',
        // dvt: 'Cái',
        // soluong: 100,
        // soluongdaban: 0,
        // soluongdaxuat: 0,
        // dongia: 2200000,
        // thanhtien: 220000000,
        // phantramthuegtgt: 10,
        // tienthuegtgt: 22000000,
        noidung: "Số phải thu",
        sotien: 847000000
    },
    {
        key: "2",
        // mahang: "VT00002",
        // tenhang: 'Màn hình',
        // dvt: 'Cái',
        // soluong: 100,
        // soluongdaban: 0,
        // soluongdaxuat: 0,
        // dongia: 5500000,
        // thanhtien: 550000000,
        // phantramthuegtgt: 10,
        // tienthuegtgt: 55000000,
        noidung: "Số chưa thu",
        sotien: 0
    },
    {
        key: "3",
        // mahang: "VT00002",
        // tenhang: 'Màn hình',
        // dvt: 'Cái',
        // soluong: 100,
        // soluongdaban: 0,
        // soluongdaxuat: 0,
        // dongia: 5500000,
        // thanhtien: 550000000,
        // phantramthuegtgt: 10,
        // tienthuegtgt: 55000000,
        noidung: "Số thanh toán",
        sotien: 825825000
    },
    {
        key: "4",
        // mahang: "VT00002",
        // tenhang: 'Màn hình',
        // dvt: 'Cái',
        // soluong: 100,
        // soluongdaban: 0,
        // soluongdaxuat: 0,
        // dongia: 5500000,
        // thanhtien: 550000000,
        // phantramthuegtgt: 10,
        // tienthuegtgt: 55000000,
        noidung: "Chiết khấu thanh toán",
        sotien: 19250000
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
const PhieuThu = ({ tiengui }) => {
    return (
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
                            tiengui ? <Form.Item label="TK ngân hàng">
                                <Input className='!w-[400px]'
                                    disabled defaultValue="01026-348 / Ngân hàng TMCP Công Thương Việt Nam" />
                            </Form.Item>
                                :
                                <Form.Item label="Người nộp">
                                    <Input className='!w-[400px]'
                                        disabled defaultValue="Nguyễn Văn A" />
                                </Form.Item>
                        }

                        <Form.Item label="Người nhận">
                            <Input className='!w-[400px]'
                                disabled defaultValue="Nguyễn Tiến Dũng" />
                        </Form.Item>

                        <Form.Item label="Nhân viên bán hàng">
                            <Input className='!w-[400px]'
                                disabled defaultValue="Nguyễn Tiến Dũng" />
                        </Form.Item>

                        {/* <Form.Item label="Nội dung">
                            <Input className='!w-[400px]'
                                disabled defaultValue="..." />
                        </Form.Item> */}
                    </Flex>
                    <Flex vertical gap={5}>
                        {/* <Form.Item label="Số đơn hàng">
                            <Input className='!w-[400px]' disabled defaultValue="ĐH00001" />
                        </Form.Item>

                        <Form.Item label="Ngày đặt hàng">
                            <DatePicker
                                className='!w-[400px]'
                                disabled
                                defaultValue={dayjs("2015/01/01", dateFormat)}
                                format={dateFormat}
                            />
                        </Form.Item>

                        <Form.Item label="Hạn giao hàng">
                            <DatePicker
                                className='!w-[400px]'
                                disabled
                                defaultValue={dayjs("2015/01/01", dateFormat)}
                                format={dateFormat}
                            />
                        </Form.Item> */}

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


                        <Form.Item label="Hạn thanh toán">
                            <DatePicker
                                className='!w-[400px]'
                                disabled
                                defaultValue={dayjs("2015/01/01", dateFormat)}
                                format={dateFormat}
                            />
                        </Form.Item>

                        <Form.Item label="Điều khoản thanh toán">
                            <Input className='!w-[400px]' disabled defaultValue="Điều khoản 1" />
                        </Form.Item>

                        <Form.Item label="Nội dung">
                            <Input className='!w-[400px]'
                                disabled defaultValue="..." />
                        </Form.Item>

                        {/* <Form.Item label="Tình trạng đơn hàng">
                            <Input className='!w-[400px]' disabled defaultValue="Chưa thực hiện" />
                        </Form.Item>

                        <Form.Item label="Tình trạng giao hàng">
                            <Input className='!w-[400px]' disabled defaultValue="Chưa giao" />
                        </Form.Item> */}

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
        </div>
    )
}

export default PhieuThu