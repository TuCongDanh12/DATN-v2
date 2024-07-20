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
  getListProduct,
} from "../../../../store/features/doiTuongSilce";
import { VND } from "../../../../utils/func";

const SanPham = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const [searchText, setSearchText] = useState("");
  const [productData, setProductData] = useState([]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const {
    listProductData,
    isSuccessGetListProduct,
    isSuccessPostProduct,
    isError,
    message,
    isSuccessUpdateProduct
  } = useSelector(doiTuongSelector);

  useEffect(() => {
    dispatch(getListProduct());
  }, []);

  useEffect(() => {
    if (listProductData) {
      setProductData(listProductData);
    }
  }, [listProductData]);


  useEffect(() => {
    if (isSuccessPostProduct) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });
      dispatch(getListProduct());
      dispatch(clearState());
    }
    else if (isSuccessUpdateProduct) {
      api.success({
        message: 'Cập nhật dữ liệu thành công!',
        placement: 'bottomLeft',
        duration: 2
      });
      dispatch(getListProduct());

      // dispatch(getListCustomerGroup());
      dispatch(clearState());
    }
    else if (isSuccessGetListProduct) {
      // messageApi.open({
      //     key: 'updatable',
      //     type: 'success',
      //     content: 'Tải dữ liệu thành công!',
      //     duration: 2,
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
  }, [isSuccessGetListProduct, isSuccessPostProduct, isError, message, isSuccessUpdateProduct]);

  useEffect(() => {
    if (searchText.trim() === "") {
      if (
        !listProductData ||
        (Array.isArray(listProductData) && !listProductData.length)
      ) {
        setProductData([]);
      } else {
        setProductData(listProductData);
      }
    } else {
      const filteredData = listProductData.filter((data) => {
        return data.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setProductData(filteredData);
    }
  }, [searchText, productData]);

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

  const columns = [
    {
      title: "ID sản phẩm",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
      fixed: "left",
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Giá mua",
      dataIndex: "priceReceived",
      key: "priceReceived",
      sorter: (a, b) => a.priceReceived - b.priceReceived,
      render: (val, record) => VND.format(val),
      sortOrder:
        sortedInfo.columnKey === "priceReceived" ? sortedInfo.order : null,
    },
    {
      title: "Giá bán",
      dataIndex: "priceDelivery",
      key: "priceDelivery",
      sorter: (a, b) => a.priceDelivery - b.priceDelivery,
      render: (val, record) => VND.format(val),
      sortOrder:
        sortedInfo.columnKey === "priceDelivery" ? sortedInfo.order : null,
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
      render: (val, record) => {
        switch (val) {
          case "CAI":
            return "Cái";
          case "CAY":
            return "Cây";
          case "CHAI":
            return "Chai";
          case "CHUC":
            return "Chục";
          case "CUON":
            return "Cuộn";
          case "GOI":
            return "Gói";
          case "HOP":
            return "Hộp";
          case "HU":
            return "Hủ";
          case "KG":
            return "Kg";
          case "LOC":
            return "Lốc";
          case "LON":
            return "Lon";
          case "THUNG":
            return "Thùng";
          case "VIEN":
            return "Viên";
          default:
            return "Lỗi";
        }
      },
      filters: [
        {
          value: "CAI",
          text: "Cái",
        },
        {
          value: "CAY",
          text: "Cây",
        },
        {
          value: "CHAI",
          text: "Chai",
        },
        {
          value: "CHUC",
          text: "Chục",
        },
        {
          value: "CUON",
          text: "Cuộn",
        },
        {
          value: "GOI",
          text: "Gói",
        },
        {
          value: "HOP",
          text: "Hộp",
        },
        {
          value: "HU",
          text: "Hủ",
        },
        {
          value: "KG",
          text: "Kg",
        },
        {
          value: "LOC",
          text: "Lốc",
        },
        {
          value: "LON",
          text: "Lon",
        },
        {
          value: "THUNG",
          text: "Thùng",
        },
        {
          value: "VIEN",
          text: "Viên",
        },
        {
          value: "LON",
          text: "Lon",
        },
      ],
      onFilter: (value, record) => record.unit.indexOf(value) === 0,
      filteredValue: filteredInfo.unit || null,
    },
    // {
    //     title: "% thuế GTGT",
    //     dataIndex: "tax",
    //     // sorter: (a, b) => a.name.localeCompare(b.name),
    // },
    {
      title: "Số dư",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category - b.category,
      sortOrder: sortedInfo.columnKey === "category" ? sortedInfo.order : null,
      // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tổng hàng trong kho",
      dataIndex: "tonghangtrongkho",
      key: "tonghangtrongkho",
      sorter: (a, b) => a.tonghangtrongkho - b.tonghangtrongkho,
      sortOrder: sortedInfo.columnKey === "tonghangtrongkho" ? sortedInfo.order : null,
      // sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Chức năng",
      dataIndex: "chucnang",
      width: "10%",
      fixed: "right",
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
              dispatch(getListProduct());
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
            Bạn muốn xóa khách hàng
            <br /> <strong>"{dataSelected.name}"</strong>?
          </div>

          <div className="flex justify-end gap-2 mb-0">
            <Button
              className="bg-[#FF7742] font-bold text-white mr-2"
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
      </div>

      <Table
        // rowSelection={{
        //     type: "checkbox",
        //     ...rowSelection,
        // }}
        columns={columns}
        dataSource={productData}
        pagination={{
          total: listProductData.length,
          defaultPageSize: 20,
          // pageSize: 20,
          defaultCurrent: 1,
          position: ["bottomRight"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{
          x: 1300,
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default SanPham;
