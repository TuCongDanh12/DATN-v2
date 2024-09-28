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
  getListSupplier,
  getListSupplierGroup,
  postSupplierGroup,
} from "../../../../store/features/doiTuongSilce";

const NhomNhaCungCap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAddNhomNhaCungCap] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openAddNhomNhaCungCap, setOpenAddNhomNhaCungCap] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();
  const [supplierGroupData, setSupplierGroupData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const {
    listSupplierGroupData,
    isSuccessGetListSupplierGroup,
    isSuccessPostSupplierGroup,
    isError,
    message,
  } = useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getListSupplierGroup());
  }, []);

  useEffect(() => {
    if (isSuccessPostSupplierGroup) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
      dispatch(getListSupplierGroup());
    } else if (isSuccessGetListSupplierGroup) {
      // messageApi.open({
      //   key: "updatable",
      //   type: "success",
      //   content: "Tải dữ liệu thành công!",
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
    isSuccessGetListSupplierGroup,
    isSuccessPostSupplierGroup,
    isError,
    message,
  ]);

  useEffect(() => {
    if (searchText.trim() === "") {
      if (
        !listSupplierGroupData ||
        (Array.isArray(listSupplierGroupData) && !listSupplierGroupData.length)
      ) {
        setSupplierGroupData([]);
      } else {
        setSupplierGroupData(listSupplierGroupData);
      }
    } else {
      const filteredData = listSupplierGroupData.filter((data) => {
        return data.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setSupplierGroupData(filteredData);
    }
  }, [searchText, supplierGroupData]);
  const items = [
    {
      key: "xem",
      label: <Link className="!text-black">Xem</Link>,
    },
    {
      key: "chinh-sua",
      label: <Link className="!text-black">Chỉnh sửa</Link>,
    },
    {
      key: "xoa",
      label: <Link className="!text-black">Xóa</Link>,
    },
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

  const handleCancelAddNhomNhaCungCap = () => {
    setOpenAddNhomNhaCungCap(false);
  };

  const columns = [
    {
      title: "ID nhóm nhà cung cấp",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      // sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Nhóm nhà cung cấp",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Số nhà cung cập trong nhóm",
      dataIndex: "size",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
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

  const onFinishAddNhomNhaCungCap = (values) => {
    console.log("Received values of form: ", values);
    dispatch(postSupplierGroup({ values }));
    formAddNhomNhaCungCap.resetFields();
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div className="m-4">
      <div className="px-[20px] w-full flex justify-between py-7 bg-white">
        <div className="flex gap-[5px] items-center">
          <Form form={form} layout="inline" onFinish={onFinish}>
            <Form.Item name="keyword" className="w-[300px] !me-0">
              <Input
                className="rounded-tr-none rounded-br-none"
                placeholder="Nhập tên nhóm nhà cung cấp"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
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

          {/* <SiMicrosoftexcel
            size={30}
            className="p-2 bg-white border border-black cursor-pointer"
          /> */}
          <TfiReload
            title="Cập nhật dữ liệu"
            size={30}
            className="p-2 bg-white border border-black cursor-pointer"
            onClick={() => {
              dispatch(getListSupplierGroup());
              messageApi.open({
                key: "updatable",
                type: "loading",
                content: "Loading...",
              });
              form.resetFields();
              setSearchText("");
            }}
          />
        </div>

        <Button
          className="!bg-[#7A77DF] font-bold text-white flex items-center gap-1"
          type="link"
          onClick={() => setOpenAddNhomNhaCungCap(true)}
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
            Bạn muốn xóa nhóm nhà cung cấp
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
          title="TẠO MỚI NHÓM NHÀ CUNG CẤP"
          centered
          open={openAddNhomNhaCungCap}
          width={700}
          footer=""
          onCancel={handleCancelAddNhomNhaCungCap}
        >
          <Form
            form={formAddNhomNhaCungCap}
            layout="horizontal"
            onFinish={onFinishAddNhomNhaCungCap}
            labelCol={{
              flex: "200px",
            }}
            labelAlign="left"
            className="mt-4"
          >
            <Form.Item
              label="Tên nhóm nhà cung cấp"
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

            <Form.Item label="Mô tả" name="description">
              <Input

              />
            </Form.Item>

            <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
              <Button
                className="!bg-[#FF7742] font-bold text-white mr-2"
                htmlType="reset"
                onClick={() => setOpenAddNhomNhaCungCap(false)}
              >
                Hủy
              </Button>
              <Button
                className="!bg-[#67CDBB] font-bold text-white"
                htmlType="submit"
                onClick={() => setOpenAddNhomNhaCungCap(false)}
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
        dataSource={supplierGroupData}
        pagination={{
          total: listSupplierGroupData.length,
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

export default NhomNhaCungCap;
