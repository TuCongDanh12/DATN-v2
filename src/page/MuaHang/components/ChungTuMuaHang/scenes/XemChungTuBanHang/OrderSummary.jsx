import React from 'react';


const calculateTotal = (products) => {
  return products.reduce((acc, product) => acc + (product.price * product.count), 0);
};

const OrderSummary = ({ totalDiscountValue,totalProductValue}) => {
  const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  
  const finalAmount = (totalProductValue - totalDiscountValue) > 0 ? totalProductValue - totalDiscountValue : 0;



  return (
    <div className="w-[300px] my-8">
      <div className="flex justify-between">
        <p>Tổng tiền hàng</p>
        <p>{VND.format(totalProductValue)}</p>
      </div>

      <div className="flex justify-between border-b border-zinc-950">
        <p>Tổng giảm giá</p>
        <p>{VND.format(totalDiscountValue)}</p>
      </div>
      <div className="flex justify-between font-bold text-xl">
        <p>Thành tiền</p>
        <p>{VND.format(finalAmount)}</p>
      </div>
    </div>
  );
};

export default OrderSummary;