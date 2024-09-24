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
  getListBankAccount,
  getListSupplier,
  getListSupplierGroup,
  postBankAccount,
  postSupplierGroup,
} from "../../../../store/features/doiTuongSilce";

const TaiKhoanNganHang = () => {
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
  const [bankAccountData, setBankAccountData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const { listBankAccountData, isSuccessPostBankAccount, isError, message,
    isSuccessUpdateBankAccount
   } =
    useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getListBankAccount());
  }, []);

  useEffect(() => {
    setBankAccountData(listBankAccountData);
  }, [listBankAccountData]);

  useEffect(() => {
    if (isSuccessPostBankAccount) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
      dispatch(getListBankAccount());
    }
    else if(isSuccessUpdateBankAccount){
      api.success({
        message: 'Cập nhật dữ liệu thành công!',
        placement: 'bottomLeft',
        duration: 2
      });
      dispatch(getListBankAccount());

      // dispatch(getListCustomerGroup());
      dispatch(clearState());
    }
    else if (listBankAccountData) {
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
  }, [isSuccessPostBankAccount, isError, message, isSuccessUpdateBankAccount]);

  useEffect(() => {
    console.log("DAY NE", searchText);
    if (searchText.trim() === "") {
      if (
        !listBankAccountData ||
        (Array.isArray(listBankAccountData) && !listBankAccountData.length)
      ) {
        setBankAccountData([]);
      } else {
        setBankAccountData(listBankAccountData);
      }
    } else {
      const filteredData = listBankAccountData.filter((data) => {
        return data.bankName.toLowerCase().includes(searchText.toLowerCase());
      });
      setBankAccountData(filteredData);
    }
  }, [searchText, bankAccountData]);

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
      // setDataSelected(record);
      // setOpenAddNhomSanPham(true);
    }
  };

  console.log("dataSelected", dataSelected);

  useEffect(() => {
    formAddNhomSanPham.setFieldsValue({
      ...dataSelected,
    });
  }, [dataSelected]);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCancelAddNhomSanPham = () => {
    setOpenAddNhomSanPham(false);
  };

  const columns = [
    {
      title: "Số tài khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
      sorter: (a, b) => a.accountNumber - b.accountNumber,
      sortOrder:
        sortedInfo.columnKey === "accountNumber" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
      sortOrder: sortedInfo.columnKey === "bankName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chi nhánh",
      dataIndex: "branch",
      key: "branch",
      sorter: (a, b) => a.branch.localeCompare(b.branch),
      sortOrder: sortedInfo.columnKey === "branch" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
      sortOrder:
        sortedInfo.columnKey === "accountName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
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
            {/* <Link className="!text-black">
                            Chỉnh sửa
                            <DownOutlined />
                        </Link> */}
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
    dispatch(postBankAccount({ values }));
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
              name="keyword"
              className="w-[300px] !me-0"
            >
              <Input
                className="rounded-tr-none rounded-br-none"
                placeholder="Nhập tên ngân hàng"
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
              dispatch(getListBankAccount());
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
          // onClick={() => setOpenAddNhomSanPham(true)}
          onClick={() => navigate("them")}
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
            Bạn muốn xóa số tài khoản
            <br /> <strong>"{dataSelected.accountNumber}"</strong>?
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
          title="TẠO MỚI TÀI KHOẢN NGÂN HÀNG"
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
              label="Số tài khoản"
              name="accountNumber"
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
              label="Tên ngân hàng"
              name="bankName"
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
              label="Chi nhánh"
              name="branch"
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
              label="Chủ tài khoản"
              name="accountName"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
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
        dataSource={bankAccountData}
        pagination={{
          total: listBankAccountData.length,
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

export default TaiKhoanNganHang;
