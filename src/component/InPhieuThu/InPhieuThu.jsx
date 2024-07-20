import { Form, Table, Typography } from 'antd'
import React, { useState } from 'react'
import { VND } from '../../utils/func';
import moment from 'moment';

const { Text } = Typography;


const InPhieuThu = ({ components, dataSource, columns, form, disabled, onFinish, idPhieuThu, idCustomer }) => {
    const dataSourceConvert = dataSource?.map((data, index) => {
        return {
            ...data,
            stt: index + 1
        };
    })

    const defaultColumns = [
        {
            title: "STT",
            dataIndex: "stt",
            editable: false,
            width: '8%',

        },
        {
            title: "ID hóa đơn",
            dataIndex: "id",
            key: "id",
            width: '15%',

        },
        {
            title: "Ngày hóa đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val, record) => new Date(val).toLocaleDateString("vi-VN"),
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
            ellipsis: true,
            editable: false,
        },
        {
            title: "Giá trị hóa đơn",
            dataIndex: "tong",
            key: "tong",
            render: (val, record) => VND.format(val),
        },
        // {
        //     title: "Chưa thu",
        //     dataIndex: "chuathu",
        //     key: "chuathu",
        //     render: (val, record) => VND.format(val),
        // },
        // {
        //     title: "Số lượng chưa đặt",
        //     dataIndex: "soluongchuadat",
        //     editable: false,
        // },
        // {
        //     title: "Số lượng đã xuất",
        //     dataIndex: "soluongdaxuat",
        //     editable: !disabled,
        // },
        {
            title: "Số thanh toán",
            dataIndex: "sothanhtoan",
            key: "sothanhtoan",
            render: (val, record) => VND.format(val),
            editable: true,
        },
    ];

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    //convert vnd to text
    const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';

    const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
    const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
    const chuHangTram = ('không một' + defaultNumbers).split(' ');

    const convert_block_three = (number) => {
        if (number == '000') return '';
        var _a = number + ''; //Convert biến 'number' thành kiểu string

        //Kiểm tra độ dài của khối
        switch (_a.length) {
            case 0: return '';
            case 1: return chuHangDonVi[_a];
            case 2: return convert_block_two(_a);
            case 3:
                var chuc_dv = '';
                if (_a.slice(1, 3) != '00') {
                    chuc_dv = convert_block_two(_a.slice(1, 3));
                }
                var tram = chuHangTram[_a[0]] + ' trăm';
                return tram + ' ' + chuc_dv;
            default:
                return 1
        }
    }

    function convert_block_two(number) {
        var dv = chuHangDonVi[number[1]];
        var chuc = chuHangChuc[number[0]];
        var append = '';

        // Nếu chữ số hàng đơn vị là 5
        if (number[0] > 0 && number[1] == 5) {
            dv = 'lăm'
        }

        // Nếu số hàng chục lớn hơn 1
        if (number[0] > 1) {
            append = ' mươi';

            if (number[1] == 1) {
                dv = ' mốt';
            }
        }

        return chuc + '' + append + ' ' + dv;
    }

    const dvBlock = '1 nghìn triệu tỷ'.split(' ');

    function to_vietnamese(number) {
        var str = parseInt(number) + '';
        var i = 0;
        var arr = [];
        var index = str.length;
        var result = [];
        var rsString = '';

        if (index == 0 || str == 'NaN') {
            return '';
        }

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }

        // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
        for (i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != '' && arr[i] != '000') {
                result.push(convert_block_three(arr[i]));

                // Thêm đuôi của mỗi khối
                if (dvBlock[i]) {
                    result.push(dvBlock[i]);
                }
            }
        }

        // Join mảng kết quả lại thành chuỗi string
        rsString = result.join(' ');

        // Trả về kết quả kèm xóa những ký tự thừa
        return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '');
    }

    return (
        <>

            <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">

                <div className="flex justify-center items-center">
                    {/* <div className='w-[20%]'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="company-logo" height="100" width="100" />
                    </div> */}

                    <div className="w-[100%] text-left">
                        <h2
                        // className="font-bold"
                        >CÔNG TY CỔ PHẦN SAIGONSKY</h2>
                        <p className="">
                            Địa chỉ: 208/18/55/42 đường 138, phường Tân Phú, quận 9, HCM
                        </p>
                        <p>
                            Mã số thuế: 1234567889
                        </p>
                        <p className="">
                            Email: saigonsky@gmail.com
                        </p>
                        <p className="">
                            Số điện thoại: +41-442341232
                        </p>
                    </div>
                </div>

                <h1 className="text-center font-bold text-2xl mt-2">PHIẾU THU</h1>

                <div className="grid grid-cols-2 mt-8">
                    <div>
                        <p
                        //  className="font-bold text-gray-800"
                        >
                            Tên khách hàng: {Form.useWatch('namecCustomer', form)}
                        </p>
                        <p className="">
                            Địa chỉ: {Form.useWatch('address', form)}
                        </p>
                        <p>
                            Mã số thuế: {Form.useWatch('taxCode', form)}
                        </p>
                        <p className="">
                            Mã khách hàng: {idCustomer}
                        </p>

                        <p className="">
                            Nội dung: {Form.useWatch('content', form)}
                        </p>

                    </div>

                    <div className="text-right">
                        <p className="">
                            ID phiếu thu: {idPhieuThu}
                        </p>
                        <p>
                            Ngày chứng từ: {formatDate(Form.useWatch('receiveDate', form)?.$d)}
                            {/* Ngày hóa đơn: {Form.useWatch('createdAt', form).$D} */}
                            {/* {console.log("Form.useWatch('createdAt', form)", Form.useWatch('createdAt', form))} */}
                            {/* <br />
                            Người giữ kho: {Form.useWatch('warehouseKeeperId')} */}
                        </p>
                    </div>
                </div>


                <div className='mt-2'>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSourceConvert}
                        columns={defaultColumns}

                        pagination={false}
                        summary={(pageData) => {
                            let totalTong = 0;
                            let totalChuaThu = 0;
                            let totalSoThanhToan = 0;
                            pageData.forEach(({ tong, sothanhtoan, chuathu }) => {
                                totalTong += tong;
                                totalChuaThu += chuathu;
                                totalSoThanhToan += sothanhtoan;
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} className="font-medium text-center" colSpan={5}>Tổng tiền thanh toán</Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            <Text className="font-medium text-center">{VND.format(totalSoThanhToan)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>

                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} className="font-medium text-center" colSpan={6}>Số tiền viết bằng chữ: {to_vietnamese(totalSoThanhToan)}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </div>

                <div className='flex justify-between mt-4'>
                    <div className='w-[18%] text-center'>
                        <br />
                        <p className="font-bold text-gray-800">
                            Người lập phiếu
                        </p>
                        <p className="text-gray-500 text-sm">
                            (Ký, ghi rõ họ tên)
                        </p>
                    </div>
                    <div className='w-[18%] text-center'>
                        <br />
                        <p className="font-bold text-gray-800">
                            Người nộp
                        </p>
                        <p className="text-gray-500 text-sm">
                            (Ký, ghi rõ họ tên)
                        </p>
                    </div>

            

                    <div className='w-[25%] text-center'>
                        <p className="text-sm">
                            Ngày ..... tháng ..... năm 20 ...
                        </p>
                        <p className="font-bold text-gray-800">
                            Thủ quỹ
                        </p>
                        <p className="text-gray-500 text-sm">
                            (Ký, ghi rõ họ tên)
                        </p>
                    </div>
                </div>

            </div>

        </>
    )
}

export default InPhieuThu