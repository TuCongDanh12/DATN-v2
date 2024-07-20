import React from 'react';

const OrderSummary = ({ products = [] }) => {
  const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  // Function to parse currency formatted strings to numbers
  const parseCurrency = (value) => {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[^\d.-]/g, '').replace(',', '.'));
    }
    return value;
  };

  const totalThanhTien = products
    .map(product => parseCurrency(product.thanhTien))
    .reduce((total, currentValue) => total + currentValue, 0);
  const totalTienChietKhau = products
    .map(product => parseCurrency(product.tienChietKhau))
    .reduce((total, currentValue) => total + currentValue, 0);
  const totalThueGTGT = products
    .map(product => parseCurrency(product.tienThueGTGT))
    .reduce((total, currentValue) => total + currentValue, 0);
  const grandTotal = totalThanhTien - totalTienChietKhau + totalThueGTGT;

  return (
    <div className="w-[300px] my-8">
      <div className="flex justify-between">
        <p>Tổng tiền hàng</p>
        <p>{VND.format(totalThanhTien)}</p>
      </div>
      <div className="flex justify-between">
        <p>Tiền chiết khấu</p>
        <p>{VND.format(totalTienChietKhau)}</p>
      </div>
      <div className="flex justify-between border-b border-zinc-950">
        <p>Thuế GTGT</p>
        <p>{VND.format(totalThueGTGT)}</p>
      </div>
      <div className="flex justify-between font-bold text-xl">
        <p>TỔNG</p>
        <p>{VND.format(grandTotal)}</p>
      </div>
    </div>
  );
};

export default OrderSummary;