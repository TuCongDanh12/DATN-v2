import React from 'react';
import { Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

const OrderActions = ({ disabled, loading, onClick }) => {
  const navigate = useNavigate();

  return (
    <>
      {disabled ? (
        <div className="w-full flex justify-end mt-6 mb-0">
          <Button className="!bg-[#FF7742] font-bold text-white" type="link" onClick={() => navigate(-1)}>
            Thoát
          </Button>
        </div>
      ) : (
        <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
          <Button className="!bg-[#FF7742] font-bold text-white mr-2" htmlType="reset" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button 
            className="!bg-[#67CDBB] font-bold text-white" 
            htmlType="button" 
            onClick={onClick} 
            loading={loading}
          >
            Xác nhận
          </Button>
        </Form.Item>
      )}
    </>
  );
};

export default OrderActions;
