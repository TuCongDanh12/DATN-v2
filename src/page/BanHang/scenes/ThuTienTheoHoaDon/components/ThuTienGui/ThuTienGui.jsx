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
  DatePicker,
  Tabs,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import { TfiReload } from "react-icons/tfi";
import { Add } from "@mui/icons-material";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { banHangSelector, clearState, getListPhieuThuTienGui } from "../../../../../../store/features/banHangSlice";
import { VND } from "../../../../../../utils/func";

const { RangePicker } = DatePicker;
const ThuTienGui = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dataSelected, setDataSelected] = useState({});

  const [messageApi, contextHolderMes] = msg.useMessage();

  const [api, contextHolder] = notification.useNotification();

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    isSuccessGetListPhieuThuTienGui,
    isSuccessPostPhieuThuTienGui,

    isError,
    message,

    listPhieuThuTienGuiData,
    // phieuThuTienGuiData,
  } = useSelector(banHangSelector);

  useEffect(() => {
    dispatch(getListPhieuThuTienGui());
  }, []);

  const [chungTuBan, setChungTuBan] = useState([]);
  const [dataConvert, setDataConvert] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterday, setFilterday] = useState([]);
  const [valueRangepicker, setValueRangepicker] = useState([])
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleFilterday = (dates) => {
    if (dates && dates.length === 2) {
      const startTimestamp = dates[0].valueOf();
      const endTimestamp = dates[1].valueOf();
      console.log("Start Timestamp:", startTimestamp, typeof (startTimestamp));
      console.log("End Timestamp:", endTimestamp, typeof (endTimestamp));
      setFilterday([startTimestamp, endTimestamp]);
      setValueRangepicker(dates);
    } else {
      setFilterday([]);
      setValueRangepicker([]);
    }
  };


  useEffect(() => {
    if (isSuccessPostPhieuThuTienGui) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
    } else if (isSuccessGetListPhieuThuTienGui) {
      // messageApi.open({
      //   key: "updatable",
      //   type: "success",
      //   content: "Tải dữ liệu thành công!",
      //   duration: 2,
      // });
      const dataConvertCurrent = listPhieuThuTienGuiData.map(phieuThuTienGuiData => {
        console.log("phieuThuTienGuiData", phieuThuTienGuiData)

        let tong = 0;
        tong += phieuThuTienGuiData?.chungTuCuaPhieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
          return total + currentValue;
        }, 0)

        // phieuThuTienGuiData.productOfCtban.forEach(productOfCt => {
        //   tong += productOfCt.count * productOfCt.price;
        //   tong += productOfCt.count * productOfCt.price * (productOfCt.product.productGroup.tax / 100);
        // })
        //continue ...
        // let dathu = 0;
        // let chuathu = tong - dathu;

        return {
          ...phieuThuTienGuiData,
          customer: phieuThuTienGuiData.customer.name,
          tong,
          // dathu,
          // chuathu
        }
      })

      console.log("dataConvertCurrent", dataConvertCurrent)
      setDataConvert(dataConvertCurrent);
      setChungTuBan(dataConvertCurrent);
      dispatch(clearState());
    }
    else if (isError) {
      api.error({
        message: message,
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
    }
  }, [isSuccessPostPhieuThuTienGui, isSuccessGetListPhieuThuTienGui, isError]);

  useEffect(() => {
    if (searchText.trim() === "" && filterday.length === 0) {
      if (!dataConvert || (Array.isArray(dataConvert) && !dataConvert.length)) {
        setChungTuBan([]);
      } else {
        setChungTuBan(dataConvert);
      }
    } else {
      const filteredData = dataConvert.filter((data) => {
        const createdAtMoment = moment(data.createdAt);
        return (
          data.customer.toLowerCase().includes(searchText.toLowerCase()) &&
          (!filterday[0] || createdAtMoment.valueOf() >= filterday[0]) &&
          (!filterday[1] || createdAtMoment.valueOf() <= filterday[1])
        );
      });
      setChungTuBan(filteredData);
    }
  }, [searchText, dataConvert, filterday]);

  const items = [
    {
      key: "xem-phieu-thu-tien-gui",
      label: <Link className="!text-black">Xem</Link>,
    },
    // {
    //   key: "chinh-sua",
    //   label: <Link className="!text-black">Chỉnh sửa</Link>,
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
      title: "ID phiếu thu",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      render: (val, record) => <span
        onClick={() => {
          // navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`, { state: { id: selectedRowKeys } });
          navigate(`/ban-hang/thu-tien-theo-hoa-don/xem-phieu-thu-tien-gui/${val}`, { state: { id: val } });
        }}
        className={`cursor-pointer font-medium text-[#1DA1F2] ${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "DELIVERED" ? "" : ""}`}>{val}</span>,
      ellipsis: true,
      width: '10%',
    },
    {
      title: "Ngày hạch toán",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val, record) => new Date(val).toLocaleDateString("vi-VN"),
      sorter: (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt),

        // moment(a.createdAt, "DD-MM-YYYY") - moment(b.createdAt, "DD-MM-YYYY"),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
      // fixed: 'left',
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Số tiền",
      dataIndex: "tong",
      key: "tong",
      render: (val, record) => VND.format(val),
      sorter: (a, b) => a.tong - b.tong,
      sortOrder: sortedInfo.columnKey === "tong" ? sortedInfo.order : null,
    },
    // {
    //   title: "Đã lập chứng từ",
    //   dataIndex: "dathu",
    //   key: "dathu",
    //   render: (val, record) => VND.format(val),
    //   sorter: (a, b) => a.dathu - b.dathu,
    //   sortOrder: sortedInfo.columnKey === "dathu" ? sortedInfo.order : null,
    // },
    // {
    //   title: "Chưa thu",
    //   dataIndex: "chuathu",
    //   key: "chuathu",
    //   render: (val, record) => VND.format(val),
    //   sorter: (a, b) => a.chuathu - b.chuathu,
    //   sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
    // },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "documentStatus",
    //   key: "documentStatus",
    //   render: (val, record) => {
    //     switch (val) {
    //       case "UNDOCUMENTED":
    //         return "Chưa thực hiện";
    //       case "DOCUMENTING":
    //         return "Đang thực hiện";
    //       case "DOCUMENTED":
    //         return "Hoàn thành";
    //       default:
    //         return "Lỗi";
    //     }
    //   },
    //   filters: [
    //     {
    //       value: "UNDOCUMENTED",
    //       text: "Chưa thực hiện",
    //     },
    //     {
    //       value: "DOCUMENTING",
    //       text: "Đang thực hiện",
    //     },
    //     {
    //       value: "DOCUMENTED",
    //       text: "Hoàn thành",
    //     },
    //   ],
    //   onFilter: (value, record) => record.documentStatus.indexOf(value) === 0,
    //   filteredValue: filteredInfo.documentStatus || null,
    // },
    // {
    //   title: "Tình trạng giao hàng",
    //   dataIndex: "deliveryStatus",
    //   key: "deliveryStatus",
    //   render: (val, record) => {
    //     switch (val) {
    //       case "NOT_DELIVERED":
    //         return "Chưa giao";
    //       case "DELIVERING":
    //         return "Đang giao";
    //       case "DELIVERED":
    //         return "Đã giao đủ";
    //       default:
    //         return "Lỗi";
    //     }
    //   },
    //   filters: [
    //     {
    //       value: "NOT_DELIVERED",
    //       text: "Chưa giao",
    //     },
    //     {
    //       value: "DELIVERING",
    //       text: "Đang giao",
    //     },
    //     {
    //       value: "DELIVERED",
    //       text: "Đã giao đủ",
    //     },
    //   ],
    //   onFilter: (value, record) => record.deliveryStatus.indexOf(value) === 0,
    //   filteredValue: filteredInfo.deliveryStatus || null,
    // },
    {
      title: "Chức năng",
      dataIndex: "chucnang",
      fixed: "right",
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
              to={`xem-phieu-thu-tien-gui/${record.key}`}
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
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log('onChange params', pagination, filters, sorter, extra);
    console.log("onChange params pagination", pagination);
    console.log("onChange params filters", filters);
    console.log("onChange params sorter", sorter);
    console.log("onChange params extra", extra);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  return (
    <div className="">
      <div className="px-[20px] w-full flex justify-between py-7 bg-white">
        <div className="flex gap-[5px] items-center">
          <Form form={form} layout="inline" onFinish={onFinish}>
            <RangePicker
              value={valueRangepicker}
              format='DD-MM-YYYY'
              onChange={(dates) => handleFilterday(dates)}
              className="!me-[5px]"
            />
            <Form.Item name="keyword" className="w-[300px] !me-0">
              <Input
                className="rounded-tr-none rounded-br-none"
                placeholder="Nhập tên khách hàng"
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
              dispatch(getListPhieuThuTienGui());
              messageApi.open({
                key: "updatable",
                type: "loading",
                content: "Loading...",
              });
              form.resetFields();
              clearAll();
              setValueRangepicker([]);
              setFilterday([]);
              setSelectedRowKeys([]);
              setSearchText("");
            }}
          />
        </div>

        <Button
          className="!bg-[#7A77DF] font-bold text-white flex items-center gap-1"
          type="link"
          onClick={() => navigate("/ban-hang/thu-tien-theo-hoa-don/tim-kiem")}
        >
          <Add />Thêm
        </Button>

        {/* <Modal
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
        </Modal> */}
      </div>


      <Table
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        columns={columns}
        dataSource={chungTuBan}
        pagination={{
          // total: listPhieuThuTienGuiData.length,
          defaultPageSize: 20,
          // // pageSize: 20,
          // defaultCurrent: 1,
          position: ["bottomRight"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
        scroll={{
          x: 1300,
        }}
        className="overflow-x-visible	overflow-y-visible"
      />
    </div>
  );
};

export default ThuTienGui;
