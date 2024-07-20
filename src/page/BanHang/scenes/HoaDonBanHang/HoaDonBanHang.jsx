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
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { SiMicrosoftexcel } from "react-icons/si";
import { TfiReload } from "react-icons/tfi";
import { Add } from "@mui/icons-material";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  banHangSelector,
  clearState,
  getListChungTuBan,
  hoaDonSelected,
} from "../../../../store/features/banHangSlice";
import moment from "moment/moment";
import { doiTuongSelector, getListProduct } from "../../../../store/features/doiTuongSilce";
import { VND } from "../../../../utils/func";
const { RangePicker } = DatePicker;
const HoaDonBanHang = ({ checkbox = false }) => {
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
    isSuccessGetListChungTuBan,
    isSuccessPostChungTuBan,

    isError,
    message,

    listChungTuBanData,
    chungTuBanData,
    listHoaDonSelected,
    isErrorHoaDonSelected
  } = useSelector(banHangSelector);

  useEffect(() => {
    dispatch(getListChungTuBan());
    checkbox && setFilteredInfo({
      "paymentStatus": [
        "NOT_PAID",
        "BEING_PAID"
      ]
    });
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
    if (isSuccessPostChungTuBan) {
      api.success({
        message: "Thêm dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
    } else if (isSuccessGetListChungTuBan) {
      // messageApi.open({
      //   key: "updatable",
      //   type: "success",
      //   content: "Tải dữ liệu thành công!",
      //   duration: 2,
      // });
      const dataConvertCurrent = listChungTuBanData.map(chungTuBanData => {
        console.log("chungTuBanData", chungTuBanData)

        let tong = chungTuBanData.totalProductValue - chungTuBanData.totalDiscountValue + chungTuBanData.totalTaxValue;
        // chungTuBanData.productOfCtban.forEach(productOfCt => {
        //   tong += productOfCt.count * productOfCt.price;
        //   tong += productOfCt.count * productOfCt.price * (productOfCt.product.productGroup.tax / 100);
        // })
        //continue ...
        // let dathu = 0;
        let dathu = 0;
        // dathu += chungTuBanData?.phieuThu?.map(pt => pt.money).reduce((total, currentValue) => {
        //   return total + currentValue;
        // }, 0)
        dathu += chungTuBanData?.phieuThuTienMat?.map(pt => pt.money).reduce((total, currentValue) => {
          return total + currentValue;
        }, 0)
        dathu += chungTuBanData?.phieuThuTienGui?.map(pt => pt.money).reduce((total, currentValue) => {
          return total + currentValue;
        }, 0)
        let chuathu = tong - dathu;

        return {
          ...chungTuBanData,
          customer: chungTuBanData.donBanHang.customer.name,
          idCustomer: chungTuBanData.donBanHang.customer.id,
          tong,
          dathu,
          chuathu
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
  }, [isSuccessPostChungTuBan, isSuccessGetListChungTuBan, isError]);

  useEffect(() => {
    console.log(searchText);
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
      key: "xem",
      label: <Link className="!text-black">Xem</Link>,
    },
    {
      key: "timkiem/thutien",
      label: <Link className="!text-black">Thu tiền</Link>,
    },
  ];

  const handleDropdownItemClick = (e, record) => {
    console.log("e.key", e.key);
    console.log("record", record);
    if (e.key === "xoa") {
      setDataSelected(record);
      setOpen(true);
    }
    else if (e.key === "xem") {
      navigate(`${e.key}/${record.key}`, { state: { id: record.key } });

    }
    else {
      dispatch(hoaDonSelected([record]));
      navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`);
      // navigate(`${e.key}/${record.key}`, { state: { id: record.key } });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  let columns = [
    {
      title: "ID hóa đơn",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      render: (val, record) => <span
        onClick={() => {
          // navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`, { state: { id: selectedRowKeys } });
          navigate(`/ban-hang/hoa-don-ban-hang/xem/${val}`, { state: { id: val } });
        }}
        className={`cursor-pointer font-medium text-[#1DA1F2] ${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "" : ""}`}>{val}</span>,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Ngày hóa đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,
      sorter: (a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt),

        // moment(a.createdAt, "DD-MM-YYYY") - moment(b.createdAt, "DD-MM-YYYY"),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
      // fixed: 'left',
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "paymentTerm",
      key: "paymentTerm",
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{new Date(val).toLocaleDateString("vi-VN")}</span>,
      sorter: (a, b) =>
        new Date(a.paymentTerm) - new Date(b.paymentTerm),

        // moment(a.paymentTerm, "DD-MM-YYYY") - moment(b.paymentTerm, "DD-MM-YYYY"),
      sortOrder: sortedInfo.columnKey === "paymentTerm" ? sortedInfo.order : null,
      // fixed: 'left',
    },
    {
      title: "ID khách hàng",
      dataIndex: "idCustomer",
      key: "idCustomer",
      sorter: (a, b) => a.idCustomer - b.idCustomer,
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{val}</span>,
      sortOrder: sortedInfo.columnKey === "idCustomer" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{val}</span>,

      key: "customer",
      ellipsis: true,
    },
    // {
    //   title: "Nội dung",
    //   dataIndex: "content",
    //   key: "content",
    //   ellipsis: true,
    // },
    {
      title: "Giá trị hóa đơn",
      dataIndex: "tong",
      key: "tong",
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{VND.format(val)}</span>,
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
    {
      title: "Chưa thu",
      dataIndex: "chuathu",
      key: "chuathu",
      render: (val, record) => <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{VND.format(val)}</span>,
      sorter: (a, b) => a.chuathu - b.chuathu,
      sortOrder: sortedInfo.columnKey === "chuathu" ? sortedInfo.order : null,
    },
    {
      title: "Tình trạng thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      fixed: "right",
      render: (val, record) => {
        switch (val) {
          case "NOT_PAID":
            return <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{"Chưa thanh toán"}</span>;
          case "BEING_PAID":
            return <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{"Thanh toán 1 phần"}</span>;
          case "PAID":
            return <span className={`${new Date(record.paymentTerm) < new Date() && record.paymentStatus !== "PAID" ? "text-[#d44950] font-medium" : ""}`}>{"Đã thanh toán"}</span>;
          default:
            return "Lỗi";
        }
      },
      filters: [
        {
          value: "NOT_PAID",
          text: "Chưa thanh toán",
        },
        {
          value: "BEING_PAID",
          text: "Thanh toán 1 phần",
        },
        {
          value: "PAID",
          text: "Đã thanh toán",
        },
      ],
      onFilter: (value, record) => record.paymentStatus.indexOf(value) === 0,
      filteredValue: filteredInfo.paymentStatus || null,
      ellipsis: true,
    },
    // {
    //   title: "Tình trạng giao hàng",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
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
    //   onFilter: (value, record) => record.paymentStatus.indexOf(value) === 0,
    //   filteredValue: filteredInfo.paymentStatus || null,
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
              items: (record.paymentStatus === "PAID" && items.filter(item => item.key === "xem")) || items,
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

  if (checkbox) {
    columns = columns.filter(item => item.dataIndex !== "chucnang");
  }
  else {
    columns = columns.filter(item => item.dataIndex !== "idCustomer");
  }

  // useEffect(() => {
  //   if (isErrorHoaDonSelected) {
  //     api.error({
  //       message: "Chỉ thu tiền các hóa đơn của 1 khách hàng!",
  //       placement: "bottomLeft",
  //       duration: 2,
  //     });

  //     dispatch(clearState());
  //   } 
  // }, [isErrorHoaDonSelected]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length >= 2 && selectedRows[0].donBanHang.customer.id === selectedRows[selectedRows.length - 1].donBanHang.customer.id) {
        setSelectedRowKeys(selectedRowKeys);
        dispatch(hoaDonSelected(selectedRows));
      }
      else if (selectedRows.length === 1) {
        setSelectedRowKeys(selectedRowKeys);
        dispatch(hoaDonSelected(selectedRows));
      }
      else if (selectedRows.length === 0) {
        setSelectedRowKeys([]);
        dispatch(hoaDonSelected([]));
      }
      else {
        api.error({
          message: "Chỉ thu tiền các hóa đơn của 1 khách hàng!",
          placement: "bottomLeft",
          duration: 2,
        });
      }

      console.log("listHoaDonSelected", listHoaDonSelected);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  // const onSelectChange = (newSelectedRowKeys) => {
  //   console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };

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
    <div className="m-4">
      <div className={`px-[20px] w-full flex justify-between pb-7 ${!checkbox && "bg-white py-7"}`}>
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
              dispatch(getListChungTuBan());
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
              checkbox && setFilteredInfo({
                "paymentStatus": [
                  "NOT_PAID",
                  "BEING_PAID"
                ]
              });
              setSearchText("");
            }}
          />
        </div>

        {
          checkbox ?
            <Button
              className="!bg-[#7A77DF] font-bold text-white flex items-center gap-1"
              type="link"
              disabled={!selectedRowKeys.length}
              onClick={() => {

                navigate(`/ban-hang/thu-tien-theo-hoa-don/timkiem/thutien`, { state: { id: selectedRowKeys } });
              }}
            >
              Thu tiền
            </Button>
            :
            <></>
        }

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

      {
        checkbox ?
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}

            columns={columns}
            dataSource={chungTuBan}
            pagination={{
              // total: listChungTuBanData.length,
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
          /> :
          <Table
            columns={columns}
            dataSource={chungTuBan}
            pagination={{
              // total: listChungTuBanData.length,
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
      }

      {/* <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}

        columns={columns}
        dataSource={chungTuBan}
        pagination={{
          // total: listChungTuBanData.length,
          defaultPageSize: 20,
          // // pageSize: 20,
          // defaultCurrent: 1,
          position: ["bottomRight"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={onChange}
       
        className="overflow-x-visible	overflow-y-visible"
      /> */}
    </div>
  );
};

export default HoaDonBanHang;
