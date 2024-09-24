import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Dropdown,
  Space,
  Select,
  Button,
  Modal,
  Form,
  Input,
  message as msg,
  notification,
  InputNumber,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import { TfiReload } from "react-icons/tfi";
import { Add } from "@mui/icons-material";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  clearState,
  doiTuongSelector,
  getListProductGroup,
  getListSupplier,
  getListSupplierGroup,
  postProductGroup,
  postSupplierGroup,
} from "../../../../store/features/doiTuongSilce";

const NhomSanPham = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAddNhomSanPham] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openAddNhomSanPham, setOpenAddNhomSanPham] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [productGroupData, setProductGroupData] = useState([]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const {
    listProductGroupData,
    isSuccessGetListProductGroup,
    isSuccessPostProductGroup,
    isError,
    message,
    isSuccessUpdateProductGroup
  } = useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getListProductGroup());
  }, []);

  useEffect(() => {
    setProductGroupData(listProductGroupData);
  }, [listProductGroupData]);

  useEffect(() => {
    if (isSuccessPostProductGroup) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
      dispatch(getListProductGroup());
    } 
    else if(isSuccessUpdateProductGroup){
      api.success({
        message: 'Cập nhật dữ liệu thành công!',
        placement: 'bottomLeft',
        duration: 2
      });
      dispatch(getListProductGroup());

      // dispatch(getListCustomerGroup());
      dispatch(clearState());
    }
    else if (isSuccessGetListProductGroup) {
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
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
    }
  }, [
    isSuccessGetListProductGroup,
    isSuccessPostProductGroup,
    isError,
    message,
    isSuccessUpdateProductGroup
  ]);

  useEffect(() => {
    if (searchText.trim() === "") {
      if (
        !listProductGroupData ||
        (Array.isArray(listProductGroupData) && !listProductGroupData.length)
      ) {
        setProductGroupData([]);
      } else {
        setProductGroupData(listProductGroupData);
      }
    } else {
      const filteredData = listProductGroupData.filter((data) => {
        return data.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setProductGroupData(filteredData);
    }
  }, [searchText, productGroupData]);

  const items = [
    {
      key: "xem",
      label: <Link className="!text-black">Xem</Link>,
    },
    {
      key: "chinh-sua",
      label: <Link className="!text-black">Chỉnh sửa</Link>,
    },
    // {
    //   key: "xoa",
    //   label: <Link className="!text-black">Xóa</Link>,
    // },
  ];

  const handleDropdownItemClick = (e, record) => {
    console.log("e.key", e.key);
    console.log("record", record);
    if (e.key === "xoa") {
      setDataSelected(record);
      setOpen(true);
    } else {
      navigate(`${e.key}/${record.key}`, { state: { id: record.key } });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCancelAddNhomSanPham = () => {
    setOpenAddNhomSanPham(false);
  };

  const columns = [
    {
      title: "ID nhóm sản phẩm",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Số sản phẩm trong nhóm",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size - b.size,
      sortOrder: sortedInfo.columnKey === "size" ? sortedInfo.order : null,
    },
    {
      title: "% thuế GTGT",
      dataIndex: "tax",
      key: "tax",
      sorter: (a, b) => a.tax - b.tax,
      sortOrder: sortedInfo.columnKey === "tax" ? sortedInfo.order : null,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
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
            }}
          >
            <Link
              to={`xem/${record.key}`}
              state={{ id: record.key }}
              className="!text-black"
            >
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
    console.log("Received values of form: ", values);
  };

  const onFinishAddNhomSanPham = (values) => {
    console.log("Received values of form: ", values);
    dispatch(postProductGroup({ values }));
    formAddNhomSanPham.resetFields();
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  return (
    <div className="m-4">
      <div className="px-[20px] w-full flex justify-between py-7 bg-white">
        <div className="flex gap-[5px] items-center">
          <Form form={form} layout="inline" onFinish={onFinish}>
            <Form.Item 
             value={searchText}
             onChange={(e) => handleSearch(e.target.value)}
            name="keyword" className="w-[300px] !me-0">
              <Input
                className="rounded-tr-none rounded-br-none"
                placeholder="Nhập từ khóa"
              />
            </Form.Item>

            <Button
              className="!bg-[#FAFAFA] font-bold m-0 p-0 w-[32px] h-[32px] flex justify-center items-center rounded-tl-none rounded-bl-none rounded-tr-md rounded-br-md"
              htmlType="submit"
            >
              <MdOutlineSearch size={20} color="#898989" />
            </Button>
          </Form>

          {contextHolderMes}
          {contextHolder}

          {/* <SiMicrosoftexcel size={30} className='p-2 bg-white border border-black cursor-pointer' /> */}
          <TfiReload
            title="Cập nhật dữ liệu"
            size={30}
            className="p-2 bg-white border border-black cursor-pointer"
            onClick={() => {
              dispatch(getListProductGroup());
              messageApi.open({
                key: "updatable",
                type: "loading",
                content: "Loading...",
              });
              form.resetFields();
              clearAll();
              setSearchText("");
            }}
          />
        </div>

        <Button
          className="!bg-[#7A77DF] font-bold text-white flex items-center gap-1"
          type="link"
          onClick={() => setOpenAddNhomSanPham(true)}
        >
          <Add />
          Thêm
        </Button>

        <Modal
          title=""
          centered
          open={open}
          width={500}
          footer=""
          onCancel={handleCancel}
        >
          <div className="m-8 mt-10 text-center">
            Bạn muốn xóa nhóm sản phẩm
            <br /> <strong>"{dataSelected.name}"</strong>?
          </div>

          <div className="flex justify-end gap-2 mb-0">
            <Button
              className="!bg-[#FF7742] font-bold text-white mr-2"
              onClick={() => {
                setDataSelected({});
                setOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              className="!bg-[#67CDBB] font-bold text-white"
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
          title="TẠO MỚI NHÓM SẢN PHẨM"
          centered
          open={openAddNhomSanPham}
          width={700}
          footer=""
          onCancel={handleCancelAddNhomSanPham}
        >
          <Form
            form={formAddNhomSanPham}
            layout="horizontal"
            onFinish={onFinishAddNhomSanPham}
            labelCol={{
              flex: "200px",
            }}
            labelAlign="left"
            className="mt-4"
          >
            <Form.Item
              label="Tên nhóm sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="% thuế GTGT"
              name="tax"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item label="Ghi chú" name="description">
              <Input />
            </Form.Item>

            <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
              <Button
                className="!bg-[#FF7742] font-bold text-white mr-2"
                htmlType="reset"
                onClick={() => setOpenAddNhomSanPham(false)}
              >
                Hủy
              </Button>
              <Button
                className="!bg-[#67CDBB] font-bold text-white"
                htmlType="submit"
                onClick={() => setOpenAddNhomSanPham(false)}
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
        dataSource={productGroupData}
        pagination={{
          total: listProductGroupData.length,
          defaultPageSize: 20,
          // pageSize: 20,
          position: ["bottomRight"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default NhomSanPham;
