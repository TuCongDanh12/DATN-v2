import React from 'react';


const calculateTotal = (products) => {
  return products.reduce((acc, product) => acc + (product.price * product.count), 0);
};

const OrderSummary = ({ discount, discountRate, data }) => {
  const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  const totalAmount = calculateTotal(data);
  const discountAmount = totalAmount * (discountRate / 100);
  const finalAmount = (totalAmount - discountAmount - discount) > 0 ? totalAmount - discountAmount - discount : 0;



  return (
    <div className="w-[300px] my-8">
      <div className="flex justify-between">
        <p>Tổng tiền hàng</p>
        <p>{VND.format(totalAmount)}</p>
      </div>
      <div className="flex justify-between">
        <p>Tiền chiết khấu</p>
        <p>{VND.format(discountAmount)}</p>
      </div>
      <div className="flex justify-between border-b border-zinc-950">
        <p>Tiền khuyến mãi</p>
        <p>{VND.format(discount)}</p>
      </div>
      <div className="flex justify-between font-bold text-xl">
        <p>TỔNG</p>
        <p>{VND.format(finalAmount)}</p>
      </div>
    </div>
  );
};

export default OrderSummary;