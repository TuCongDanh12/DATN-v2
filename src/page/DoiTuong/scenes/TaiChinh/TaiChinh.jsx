import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Table, Dropdown, Space, Select, Button, Modal, Form, Input, message as msg, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from 'react-icons/si';
import { TfiReload } from 'react-icons/tfi';
import { Add } from '@mui/icons-material';
import { MdOutlineSearch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const TaiChinh = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();

  // const {
  //   listCustomerData,
  //   isSuccessGetListCustomer,
  //   isSuccessPostCustomer,
  //   isError,
  //   message
  // } = useSelector(doiTuongSelector);

  // useEffect(() => {
  //   dispatch(getListCustomer());
  // }, []);

  // useEffect(() => {
  //   if (isSuccessPostCustomer) {
  //     api.success({
  //       message: 'Thêm dữ liệu thành công!',
  //       placement: 'bottomLeft',
  //       duration: 2
  //     });

  //     dispatch(clearState());

  //   }
  //   else if (isSuccessGetListCustomer) {
  //     messageApi.open({
  //       key: 'updatable',
  //       type: 'success',
  //       content: 'Tải dữ liệu thành công!',
  //       duration: 2,
  //     });

  //     dispatch(clearState());
  //   }
  //   if (isError) {
  //     api.error({
  //       message: message,
  //       placement: 'bottomLeft',
  //       duration: 2
  //     });

  //     dispatch(clearState());
  //   }

  // }, [isSuccessGetListCustomer, isSuccessPostCustomer, isError]);


  const items = [
    {
      key: "xem",
      label: (<Link className="!text-black">
        Xem
      </Link>),
    },
    {
      key: "chinh-sua",
      label: (<Link className="!text-black">
        Chỉnh sửa
      </Link>)
    },
    {
      key: "xoa",
      label: (<Link className="!text-black">
        Xóa
      </Link>)
    },
  ];

  const handleDropdownItemClick = (e, record) => {
    console.log("e.key", e.key);
    console.log("record", record);
    if (e.key === "xoa") {
      setDataSelected(record);
      setOpen(true);
    }
    else {
      navigate(`${e.key}/${record.key}`, { state: { id: record.key } });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns = [
    {
      title: "Nhóm tài khoản",
      dataIndex: "group",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã tài khoản",
      dataIndex: "code",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "name",
    },
    {
      title: "Đầu kỳ",
      dataIndex: "start",
    },
    {
      title: "Hiện tại",
      dataIndex: "current",
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


  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('onChange params', pagination, filters, sorter, extra);
    console.log('onChange params pagination', pagination);
    console.log('onChange params filters', filters);
    console.log('onChange params sorter', sorter);
    console.log('onChange params extra', extra);
  };

  return (
    <div className='m-4'>
      {contextHolderMes}
      <div className='flex gap-4 w-full justify-between'>
        <div className='flex-1'>
          <div className='p-4 bg-[#fff] mb-4'>
            <div className='font-bold text-xl py-2'>Tài sản ngắn hạn</div>
            <Table
              // rowSelection={{
              //     type: "checkbox",
              //     ...rowSelection,
              // }}
              columns={columns}
              // dataSource={listCustomerData}
              pagination={{
                // total: listCustomerData.length,
                defaultPageSize: 20,
                // pageSize: 20,
                defaultCurrent: 1,
                position: ['bottomRight'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={onChange}

            />
          </div>

          <div className='p-4 bg-[#fff]'>
            <div className='font-bold text-xl py-2'>Tài sản dài hạn</div>
            <Table
              // rowSelection={{
              //     type: "checkbox",
              //     ...rowSelection,
              // }}
              columns={columns}
              // dataSource={listCustomerData}
              pagination={{
                // total: listCustomerData.length,
                defaultPageSize: 20,
                // pageSize: 20,
                defaultCurrent: 1,
                position: ['bottomRight'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={onChange}

            />
          </div>
        </div>
        <div className='flex-1'>
          <div className='p-4 bg-[#fff]'>
            <div className='font-bold text-xl py-2'>Khác</div>
            <Table
              // rowSelection={{
              //     type: "checkbox",
              //     ...rowSelection,
              // }}
              columns={columns}
              // dataSource={listCustomerData}
              pagination={{
                // total: listCustomerData.length,
                defaultPageSize: 20,
                // pageSize: 20,
                defaultCurrent: 1,
                position: ['bottomRight'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={onChange}

            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaiChinh