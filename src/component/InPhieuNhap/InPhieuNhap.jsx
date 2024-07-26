import React from 'react';
import { Table } from 'antd';
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

    if (index === 0 || str === 'NaN') {
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

const InPhieuNhap = React.forwardRef(({ chungtumua }, ref) => {
    const total = chungtumua?.totalProductValue- chungtumua?.totalDiscountValue
    const columns = [
        {
            title: 'Mã hàng',
            dataIndex: ['product', 'id'],
            key: 'product.id',
            render: (_, record) => record.product.id,
          },
          {
            title: 'Tên hàng',
            dataIndex: ['product', 'name'],
            key: 'product.name',
            render: (_, record) => record.product.name,
          },
          {
            title: 'ĐVT',
            dataIndex: ['product', 'unit'],
            key: 'product.unit',
            render: (_, record) => record.product.unit,
          },
          {
            title: 'Số lượng',
            dataIndex: 'count',
            key: 'count',
            render: (_, record) => record.count,
          },
          {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => `${record.price.toLocaleString('vi-VN')} ₫`,
          },
          {
            title: 'Thành tiền',
            key: 'totalPrice',
            render: (_, record) => `${(record.count * record.price).toLocaleString('vi-VN')} ₫`,
          },
    
        // {
        //   title: '% chiết khấu',
        //   dataIndex: 'discountRate',
        //   key: 'discountRate',
        //   render: () => discountRate,
        // },
        // {
        //   title: 'Tiền chiết khấu',
        //   dataIndex: 'tienChietKhau',
        //   key: 'tienChietKhau',
        //   render: (_, record) => calculateAmount(record).tienChietKhau.toLocaleString('vi-VN'),
        // },
        // {
        //   title: 'Tổng cộng',
        //   dataIndex: 'total',
        //   key: 'total',
        //   render: (_, record) => calculateAmount(record).total.toLocaleString('vi-VN'),
        // },
      ];
  return (
    <div ref={ref} className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
      <div className="flex justify-center items-center">
        <div className="w-[100%] text-left">
          <h2>CÔNG TY CỔ PHẦN SAIGONSKY</h2>
          <p>Địa chỉ: 208/18/55/42 đường 138, phường Tân Phú, quận 9, HCM</p>
          <p>Mã số thuế: 1234567889</p>
          <p>Email: saigonsky@gmail.com</p>
          <p>Số điện thoại: +41-442341232</p>
        </div>
      </div>

      <h1 className="text-center font-bold text-2xl mt-2">PHIẾU NHẬP KHO</h1>

      <div className="grid grid-cols-2 mt-8">
        <div>
          <p>Tên nhà cung cấp: {chungtumua?.donMuaHang?.supplier?.accountName}</p>
          <p>Địa chỉ: {chungtumua?.donMuaHang?.supplier?.address}</p>
          {/* <p>Mã số thuế: {chungtumua?.donMuaHang?.supplier?.taxCode}</p>
          <p>Mã khách hàng: {chungtumua?.donMuaHang?.supplier?.customerId}</p> */}
          {/* <p>Người nhận hàng: {chungtumua?.warehouseKeeper?.name}</p> */}
          <p>Nội dung: {chungtumua?.content}</p>
        </div>
        <div className="text-right">
          <p>ID phiếu nhập: {chungtumua?.id}</p>
          <p>Ngày giao hàng: {chungtumua?.deliveryDate}</p>
        </div>
      </div>

      <div className="mt-2">
        <Table
          columns={columns}
          dataSource={chungtumua?.productOfCtmua}
          pagination={false}
          rowKey="id"
          summary={pageData => {
            let totalThanhtien = 0;
            let totalTiencktm = 0;
            let totalTienthuegtgt = 0;
            pageData.forEach(({ thanhtien, tiencktm, tienthuegtgt }) => {
              totalThanhtien += thanhtien;
              totalTiencktm += tiencktm;
              totalTienthuegtgt += tienthuegtgt;
            });
            const tong = totalThanhtien - totalTiencktm + totalTienthuegtgt;

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>Tổng cộng tiền hàng: {chungtumua?.totalProductValue}</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>Tỷ lệ chiết khấu: {chungtumua?.donMuaHang?.discountRate}%</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>Số tiền giảm giá: {chungtumua?.donMuaHang?.discount}</Table.Summary.Cell>
                </Table.Summary.Row>
                {/* <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>Tiền thuế GTGT:</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>{totalTienthuegtgt}</Table.Summary.Cell>
                </Table.Summary.Row> */}
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>Tổng tiền thanh toán: {total}</Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={7}>Số tiền viết bằng chữ: <strong>{to_vietnamese(total)}</strong></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </div>

      <div className="flex justify-between mt-4">
        <div className="w-[25%] text-center">
          <br />
          <p className="font-bold text-gray-800">Người lập phiếu</p>
          <p className="text-gray-500 text-sm">(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="w-[25%] text-center">
          <br />
          <p className="font-bold text-gray-800">Người nhận hàng</p>
          <p className="text-gray-500 text-sm">(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="w-[25%] text-center">
          <br />
          <p className="font-bold text-gray-800">Thủ kho</p>
          <p className="text-gray-500 text-sm">(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="w-[25%] text-center">
          <p className="text-sm">Ngày ..... tháng ..... năm 20 ...</p>
          <p className="font-bold text-gray-800">Giám đốc</p>
          <p className="text-gray-500 text-sm">(Ký, ghi rõ họ tên và đóng dấu)</p>
        </div>
      </div>
    </div>
  );
});

export default InPhieuNhap;
