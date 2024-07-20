import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Table, Dropdown, Space, Select, Button, Modal, Form, Input, message as msg, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from 'react-icons/si';
import { TfiReload } from 'react-icons/tfi';
import { Add } from '@mui/icons-material';
import { MdOutlineSearch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { clearState, doiTuongSelector, getListCustomerGroup, getListSupplier, getListSupplierGroup, postCustomerGroup, postSupplierGroup } from '../../../../store/features/doiTuongSilce';

const NhomKhachHang = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAddNhomKhachHang] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openAddNhomKhachHang, setOpenAddNhomKhachHang] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();
  const [customerGroupData, setCustomerGroupData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const {
    listCustomerGroupData,
    listSupplierGroupData,
    isSuccessGetListCustomerGroup,
    isSuccessPostCustomerGroup,
    isError,
    message,
    isSuccessUpdateCustomerGroup
  } = useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getListCustomerGroup());
  }, []);

  useEffect(() => {
    setCustomerGroupData(listCustomerGroupData);
  }, [listCustomerGroupData]);

  useEffect(() => {
    if (isSuccessPostCustomerGroup) {
      api.success({
        message: 'Thêm dữ liệu thành công!',
        placement: 'bottomLeft',
        duration: 2
      });

      dispatch(clearState());
      dispatch(getListCustomerGroup());
    }
    else if(isSuccessUpdateCustomerGroup){
      api.success({
        message: 'Cập nhật dữ liệu thành công!',
        placement: 'bottomLeft',
        duration: 2
      });

      dispatch(getListCustomerGroup());
      dispatch(clearState());
    }
    else if (isSuccessGetListCustomerGroup) {
      // messageApi.open({
      //   key: 'updatable',
      //   type: 'success',
      //   content: 'Tải dữ liệu thành công!',
      //   duration: 2,
      // });

      dispatch(clearState());
    }
    if (isError) {
      api.error({
        message: message,
        placement: 'bottomLeft',
        duration: 2
      });

      dispatch(clearState());
    }

  }, [
    isSuccessGetListCustomerGroup,
    isSuccessPostCustomerGroup,
    isError,
    message,
    isSuccessUpdateCustomerGroup
  ]);

  useEffect(() => {
    if (searchText.trim() === "") {
      if (
        !listCustomerGroupData ||
        (Array.isArray(listCustomerGroupData) && !listCustomerGroupData.length)
      ) {
        setCustomerGroupData([]);
      } else {
        setCustomerGroupData(listCustomerGroupData);
      }
    } else {
      const filteredData = listCustomerGroupData.filter((data) => {
        return data.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setCustomerGroupData(filteredData);
    }
  }, [searchText, customerGroupData]);


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
    // {
    //   key: "xoa",
    //   label: (<Link className="!text-black">
    //     Xóa
    //   </Link>)
    // },
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

  const handleCancelAddNhomKhachHang = () => {
    setOpenAddNhomKhachHang(false);
  }

  const columns = [
    {
      title: "ID nhóm khách hàng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      // sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,

    },
    {
      title: "Số khách hàng trong nhóm",
      dataIndex: "size",

    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      ellipsis: true,

    },
    {
      title: "Chức năng",
      dataIndex: "chucnang",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Dropdown
            menu={{
              onClick: (e) => handleDropdownItemClick(e, record),
              items: items,
            }}>
            <Link to={`xem/${record.key}`} state={{ id: record.key }} className="!text-black">
              Xem
              <DownOutlined />
            </Link>
          </Dropdown>
        </Space>
      ),
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

  const onFinishAddNhomKhachHang = (values) => {
    console.log('Received values of form: ', values);
    dispatch(postCustomerGroup({ values }));
    formAddNhomKhachHang.resetFields();
  };


  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <div className='m-4'>
      <div className='px-[20px] w-full flex justify-between py-7 bg-white'>
        <div className='flex gap-[5px] items-center'>
          <Form
            form={form}
            layout='inline'
            onFinish={onFinish}
          >

            <Form.Item
              name='keyword'
              className='w-[300px] !me-0'
            >
              <Input
                className='rounded-tr-none rounded-br-none'
                placeholder="Nhập từ khóa"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form.Item>

            <Button
              className='!bg-[#FAFAFA] font-bold m-0 p-0 w-[32px] h-[32px] flex justify-center items-center rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md'
              htmlType="submit"
            >
              <MdOutlineSearch size={20} color='#898989' />
            </Button>
          </Form>

          {contextHolderMes}
          {contextHolder}

          {/* <SiMicrosoftexcel size={30} className='p-2 bg-white border border-black cursor-pointer' /> */}
          <TfiReload
            title="Cập nhật dữ liệu"
            size={30} className='p-2 bg-white border border-black cursor-pointer'
            onClick={() => {
              dispatch(getListCustomerGroup());
              messageApi.open({
                key: 'updatable',
                type: 'loading',
                content: 'Loading...',
              });
              form.resetFields();
              setSearchText("");
            }}
          />
        </div>

        <Button
          className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1'
          type='link'
          onClick={() => setOpenAddNhomKhachHang(true)}
        >
          <Add />Thêm
        </Button>

        <Modal
          title=""
          centered
          open={open}
          width={500}
          footer=''
          onCancel={handleCancel}
        >
          <div className='m-8 mt-10 text-center'>Bạn muốn xóa nhóm khách hàng<br /> <strong>"{dataSelected.name}"</strong>?</div>

          <div className='flex justify-end gap-2 mb-0'>
            <Button
              className='bg-[#FF7742] font-bold text-white mr-2'
              onClick={() => {
                setDataSelected({});
                setOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              className='!bg-[#67CDBB] font-bold text-white'
              onClick={() => {
                //dispatch(deleteNhaCungCap({id:dataSelected.key}));
                setDataSelected({});
                setOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </Modal>

        <Modal
          title="TẠO MỚI NHÓM KHÁCH HÀNG"
          centered
          open={openAddNhomKhachHang}
          width={700}
          footer=''
          onCancel={handleCancelAddNhomKhachHang}
        >
          <Form
            form={formAddNhomKhachHang}
            layout='horizontal'
            onFinish={onFinishAddNhomKhachHang}
            labelCol={{
              flex: '200px',
            }}
            labelAlign="left"
            className='mt-4'
          >
            <Form.Item
              label="Tên nhóm khách hàng"
              name='name'
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc!',
                },
              ]}
            >
              <Input
              />
            </Form.Item>

            <Form.Item
              label="Ghi chú"
              name='note'
            >
              <Input
              />
            </Form.Item>

            <Form.Item className='flex justify-end gap-2 mt-6 mb-0'>

              <Button
                className='bg-[#FF7742] font-bold text-white mr-2'
                htmlType="reset"
                onClick={() => setOpenAddNhomKhachHang(false)}
              >
                Hủy
              </Button>
              <Button
                className='!bg-[#67CDBB] font-bold text-white'
                htmlType="submit"
                onClick={() => setOpenAddNhomKhachHang(false)}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <Table
        // rowSelection={{
        //     type: "checkbox",
        //     ...rowSelection,
        // }}
        columns={columns}
        dataSource={customerGroupData}
        pagination={{
          total: listCustomerGroupData.length,
          defaultPageSize: 20,
          // pageSize: 20,
          position: ['bottomRight'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        onChange={onChange}
      />
    </div>
  )
}

export default NhomKhachHang