import { Form, Table, Typography } from 'antd'
import React, { useState } from 'react'
import { VND } from '../../utils/func';

const { Text } = Typography;


const InChiTietDoanhThuNhanVien = ({ components, dataSource, columns, form, disabled, onFinish, idHoaDon, idCustomer, dates }) => {
    const dataSourceConvert = dataSource.map((data, index) => {
        return {
            ...data,
            stt: index + 1
        };
    })

    let defaultColumns = [
        // {
        //   title: "Khách hàng",
        //   dataIndex: "salesperson",
        //   key: "salesperson",
        //   ellipsis: true,
        // },
        {
            title: "ID hóa đơn",
            dataIndex: "sohoadon",
            key: "sohoadon",
            ellipsis: true,
        },
        {
            title: "Ngày hóa đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] " : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,

            // fixed: 'left',
        },

        {
            title: "Hạn thanh toán",
            dataIndex: "paymentTerm",
            key: "paymentTerm",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] " : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,

            // fixed: 'left',
        },

        // {
        //   title: "Nội dung",
        //   dataIndex: "content",
        //   key: "content",
        //   ellipsis: true,
        // },
        {
            title: "Giá trị hóa đơn",
            dataIndex: "tong",
            key: "tong",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] " : ""}`}>{VND.format(val)}</span>,


        },
        {
            title: "Doanh thu (thuần)",
            dataIndex: "doanhthu",
            key: "doanhthu",
            render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] " : ""}`}>{VND.format(val)}</span>,

        },
        // {
        //   title: "Đã thu",
        //   dataIndex: "dathu",
        //   key: "dathu",
        //   render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] font-medium" : ""}`}>{VND.format(val)}</span>,

        //   // render: (val, record) => VND.format(val),
        //   sorter: (a, b) => a.dathu - b.dathu,
        //   sortOrder: sortedInfo.columnKey === "dathu" ? sortedInfo.order : null,
        // },
        // {
        //   title: "Chưa thu",
        //   dataIndex: "chuathu",
        //   key: "chuathu",
        //   render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() ? "text-[#000] font-medium" : ""}`}>{VND.format(val)}</span>,

        //   // render: (val, record) => VND.format(val),
        //   sorter: (a, b) => a.chuathu - b.chuathu,
        //   sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
        // },
        // {
        //   title: "Tình trạng thanh toán",
        //   dataIndex: "paymentStatus",
        //   key: "paymentStatus",
        //   fixed: "right",
        //   render: (val, record) => {
        //     switch (val) {
        //       case "NOT_PAID":
        //         return "Chưa thanh toán";
        //       case "BEING_PAID":
        //         return "Thanh toán 1 phần";
        //       case "PAID":
        //         return "Đã thanh toán";
        //       default:
        //         return "Lỗi";
        //     }
        //   },
        //   filters: [
        //     {
        //       value: "NOT_PAID",
        //       text: "Chưa thanh toán",
        //     },
        //     {
        //       value: "BEING_PAID",
        //       text: "Thanh toán 1 phần",
        //     },
        //     {
        //       value: "PAID",
        //       text: "Đã thanh toán",
        //     },
        //   ],
        //   onFilter: (value, record) => record.paymentStatus.indexOf(value) === 0,
        //   filteredValue: filteredInfo.paymentStatus || null,
        // },
        // {
        //   title: "Tình trạng giao hàng",
        //   dataIndex: "deliveryStatus",
        //   key: "deliveryStatus",
        //   render: (val, record) => {
        //     switch (val) {
        //       case "NOT_DELIVERED":
        //         return "Chưa giao";
        //       case "DELIVERING":
        //         return "Đang giao";
        //       case "DELIVERED":
        //         return "Đã giao đủ";
        //       default:
        //         return "Lỗi";
        //     }
        //   },
        //   filters: [
        //     {
        //       value: "NOT_DELIVERED",
        //       text: "Chưa giao",
        //     },
        //     {
        //       value: "DELIVERING",
        //       text: "Đang giao",
        //     },
        //     {
        //       value: "DELIVERED",
        //       text: "Đã giao đủ",
        //     },
        //   ],
        //   onFilter: (value, record) => record.deliveryStatus.indexOf(value) === 0,
        //   filteredValue: filteredInfo.deliveryStatus || null,
        // },
        // {
        //   title: "Chức năng",
        //   dataIndex: "chucnang",
        //   fixed: "right",
        //   width: "10%",
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <Dropdown
        //         menu={{
        //           onClick: (e) => handleDropdownItemClick(e, record),
        //           items: items,
        //         }}
        //       >
        //         <Link
        //           to={`xem/${record.key}`}
        //           state={{ id: record.key }}
        //           className="!text-black"
        //         >
        //           Xem
        //           <DownOutlined />
        //         </Link>
        //       </Dropdown>
        //     </Space>
        //   ),
        // },
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

                {/* <div className="flex justify-center items-center">
                    <div className='w-[20%]'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="company-logo" height="100" width="100" />
                    </div>

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
                </div> */}

                <h1 className="text-center font-bold text-2xl mt-2">DOANH THU BÁN HÀNG CHI TIẾT THEO TỪNG NHÂN VIÊN</h1>

                <div className="text-center font-bold">Từ ngày {formatDate(dates[0]?.$d || new Date())} đến ngày {formatDate(dates[1]?.$d || new Date())}</div>
                {/* <div className="text-center font-bold">Tháng 5 năm 2024</div> */}

                {/* <div className="grid grid-cols-2 mt-8">
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

                    </div>

                    <div className="text-right">
                        <p className="">
                            ID hóa đơn: {idHoaDon}
                        </p>
                        <p>
                            Ngày hóa đơn: {formatDate(Form.useWatch('createdAt', form)?.$d)}
                            <br />
                            Hạn thanh toán: {formatDate(Form.useWatch('paymentTerm', form)?.$d)}
                        </p>
                    </div>
                </div> */}


                <div className='mt-2'>
                    {dataSource.map((ctb, index) =>
                        <Table
                            key={index}
                            columns={defaultColumns}
                            dataSource={ctb}
                            // onChange={onChange}
                            className="overflow-x-visible	overflow-y-visible mb-3"

                            pagination={false}
                            bordered
                            summary={(pageData) => {
                                let totalTong = 0;
                                let totalDoanhThu = 0;
                                let totalChuaThu = 0;
                                pageData.forEach(({ tong, doanhthu, chuathu }) => {
                                    totalTong += tong;
                                    totalDoanhThu += doanhthu;
                                    totalChuaThu += chuathu;
                                });
                                return (
                                    <>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={3} className="font-medium">Tên nhân viên bán hàng: {pageData[0]?.salesperson} - ID: {pageData[0]?.manhanvienbanhang}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <Text className="font-medium">{VND.format(totalTong)}</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <Text className="font-medium">{VND.format(totalDoanhThu)}</Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </>
                                );
                            }}
                        />
                    )}
                    {/* <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        summary={(pageData) => {
                            let totalTong = 0;
                            let totalDaThu = 0;
                            let totalChuaThu = 0;
                            pageData.forEach(({ tong, dathu, chuathu }) => {
                                totalTong += tong;
                                totalDaThu += dathu;
                                totalChuaThu += chuathu;
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={2} className="font-medium">Tổng</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text className="font-medium">{VND.format(totalTong)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}>
                                            <Text className="font-medium">{VND.format(totalDaThu)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            <Text className="font-medium">{VND.format(totalChuaThu)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    /> */}
                </div>

                <div className='flex justify-between mt-4'>
                    <div className='w-[30%] text-center'>
                        <br />
                        <p className="font-bold text-gray-800">
                            Người lập phiếu
                        </p>
                        <p className="text-gray-500 text-sm">
                            (Ký và ghi rõ họ tên)
                        </p>
                    </div>

                    <div className='w-[30%] text-center'>
                        <p className="text-sm">
                            Ngày ..... tháng ..... năm 20 ...
                        </p>
                        <p className="font-bold text-gray-800">
                            Giám đốc
                        </p>
                        <p className="text-gray-500 text-sm">
                            (Ký, ghi rõ họ tên và đóng dấu)
                        </p>
                    </div>
                </div>

            </div>

        </>
    )
}

export default InChiTietDoanhThuNhanVien