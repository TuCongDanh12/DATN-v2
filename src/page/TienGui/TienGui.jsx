import React, { useState, useEffect } from "react";
import { Table, DatePicker, Space, Button, Modal, Upload, Select } from "antd";
import { Flex } from "antd";
import * as XLSX from "xlsx";
import { FileExcelOutlined } from "@ant-design/icons";
import doiTuongService from "../../services/doiTuong.service";
import muahangService from "../../services/muahang.service";
const { RangePicker } = DatePicker;

const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Fake API to fetch data for table 1



const TienGui = () => {
  const [table1Data, setTable1Data] = useState([]);
  const [table2Data, setTable2Data] = useState([]);
  const [selectedRows1, setSelectedRows1] = useState([]);
  const [selectedRows2, setSelectedRows2] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listBankAccount, setListBankAccount] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [phieuChiData, setPhieuChiData] = useState([]);
  const [receiptType, setReceiptType] = useState(null);

  const fetchListBankAccount = async () => {
    try {
      const res = await doiTuongService.getListBankAccount();
      const listBankAccount = res.data.result.data;
      setListBankAccount(listBankAccount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPhieuChiKhacData = async (bankAccountId) => {
    try {
      const response = await muahangService.getListPhieuChiKhac(); // Call the new API for "Phiếu Chi Khác"
      const data = response.data.result.data;

      // Filter data by bank account ID and isTienMat
      const filteredData = data
        .filter((receipt) => 
          receipt.bankAccount.id === bankAccountId && !receipt.isTienMat // Filter logic
        )
        .map((receipt) => ({
          key: receipt.id,
          chungTu: receipt.id,
          ngayHoachToan: receipt.paymentDate,
          soTienThu: receipt.money, // Assuming you want to show the money here
          soTienChi: 0,
          noiDung: receipt.content,
        }));

      setPhieuChiData(filteredData);
      setTable1Data(filteredData); // Update table1Data to display the filtered receipts
    } catch (error) {
      console.error("Error fetching 'Phiếu Chi Khác' data:", error);
    }
  };


  const fetchPhieuChiData = async (bankAccountId) => {
    try {
      const response = await muahangService.getListPhieuChiTienGui();
      const data = response.data.result.data;

      // Filter data by bank account ID
      const filteredData = data
        .filter((receipt) => receipt.bankAccount.id === bankAccountId)
        .map((receipt) => ({
          key: receipt.id,
          chungTu: receipt.id, // Concatenate content of chungTu
          ngayHoachToan: receipt.paymentDate, // Adjust to your desired field
          soTienThu: receipt.chungTu.reduce((total, ch) => total + ch.money, 0), // Sum money from all chungTu
          soTienChi: 0, // Set to 0 or your desired logic
          noiDung: receipt.content, // Example content from the receipt
        }));

      setPhieuChiData(filteredData);
      setTable1Data(filteredData); // Update table1Data to display the filtered receipts
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };

  // Modify handleBankChange to pass the selected bank ID to fetchPhieuChiData
  const handleBankChange = (value) => {
    setSelectedBank(value);

    // Check if the selected receipt type is "Phiếu Chi"
    if (receiptType === "Phiếu Chi") {
      fetchPhieuChiData(value); // Fetch and filter the receipts based on the selected bank account
    }
  };

  // Adjust handleReceiptTypeChange to reset table1Data when changing types
  const handleReceiptTypeChange = (value) => {
    setReceiptType(value);

    if (value === "Phiếu Chi" && selectedBank) {
      fetchPhieuChiData(selectedBank); // Fetch filtered receipts based on selected bank
    } else if (value === "Phiếu Chi Khác" && selectedBank) {
      fetchPhieuChiKhacData(selectedBank); // Fetch filtered "Phiếu Chi Khác" receipts based on selected bank
    } else {
      setTable1Data([]); // Clear table data if another receipt type is selected
    }
  };

  useEffect(() => {
    // fetchTable1Data().then((data) => setTable1Data(data));
    fetchListBankAccount();
    // fetchTable2Data().then((data) => setTable2Data(data));
  }, []);

  const columns1 = [
    { title: "Chứng từ", dataIndex: "chungTu", key: "chungTu" },
    {
      title: "Ngày hoạch toán",
      dataIndex: "ngayHoachToan",
      key: "ngayHoachToan",
    },
    { title: "Số tiền thu", dataIndex: "soTienThu", key: "soTienThu" },
    { title: "Số tiền chi", dataIndex: "soTienChi", key: "soTienChi" },
    { title: "Nội dung", dataIndex: "noiDung", key: "noiDung" },
  ];

  const columns2 = [
    { title: "Giao dịch", dataIndex: "giaoDich", key: "giaoDich" },
    { title: "Ngày giao dịch", dataIndex: "ngayGiaoDich", key: "ngayGiaoDich" },
    { title: "Số tiền thu", dataIndex: "soTienThu", key: "soTienThu" },
    { title: "Số tiền chi", dataIndex: "soTienChi", key: "soTienChi" },
    { title: "Nội dung", dataIndex: "noiDung", key: "noiDung" },
  ];

  const combinedColumns = [
    { title: "Chứng từ", dataIndex: "chungTu", key: "chungTu" },
    {
      title: "Ngày hoạch toán",
      dataIndex: "ngayHoachToan",
      key: "ngayHoachToan",
    },
    { title: "Số tiền thu", dataIndex: "soTienThu", key: "soTienThu" },
    { title: "Giao dịch", dataIndex: "giaoDich", key: "giaoDich" },
    { title: "Ngày giao dịch", dataIndex: "ngayGiaoDich", key: "ngayGiaoDich" },
    {
      title: "Số tiền giao dịch",
      dataIndex: "soTienGiaoDich",
      key: "soTienGiaoDich",
    },
  ];

  const onTable1RangeChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      const filteredData = table1Data.filter((record) => {
        const date = new Date(record.ngayHoachToan);
        return date >= start && date <= end;
      });
      setTable1Data(filteredData);
    } else {
     
    }
  };

  const onTable2RangeChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      const filteredData = table2Data.filter((record) => {
        const date = new Date(record.ngayGiaoDich);
        return date >= start && date <= end;
      });
      setTable2Data(filteredData);
    } else {
    
    }
  };

  // Combine data from both tables on OK click
  const handleOk = () => {
    const combined = selectedRows1.map((row1, index) => ({
      chungTu: row1.chungTu,
      ngayHoachToan: row1.ngayHoachToan,
      soTienThu: row1.soTienThu,
      giaoDich: selectedRows2[index]?.giaoDich,
      ngayGiaoDich: selectedRows2[index]?.ngayGiaoDich,
      soTienGiaoDich: selectedRows2[index]?.soTienThu,
    }));

    setCombinedData([...combinedData, ...combined]);

    // Remove selected rows from table 1 and table 2
    setTable1Data(table1Data.filter((item) => !selectedRows1.includes(item)));
    setTable2Data(table2Data.filter((item) => !selectedRows2.includes(item)));

    // Reset selections
    setSelectedRows1([]);
    setSelectedRows2([]);

    setIsModalVisible(false); // Close modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle file upload and read Excel data
  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Process the data, starting from row 2 (index 1)
      const newData = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row[0]) break; // Stop if the first cell (Giao dịch) is empty

        newData.push({
          key: i, // Generate a unique key
          giaoDich: row[0],
          ngayGiaoDich: row[1],
          soTienThu: row[2],
          soTienChi: row[3],
          noiDung: row[4],
        });
      }

      setTable2Data([...table2Data, ...newData]); // Update table 2 data
    };
    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleFileChange(file);
      return false; // Prevent automatic upload
    },
    showUploadList: false,
  };

  return (
    <div>
      <Flex gap={30}>
        <Select
          placeholder="Chọn ngân hàng"
          style={{ width: "100%" }}
          value={selectedBank}
          onChange={handleBankChange} // Cập nhật ngân hàng
          className="mx-5 mt-5 !w-[250px]"
        >
          {listBankAccount.map((bank) => (
            <Select.Option key={bank.id} value={bank.id}>
              {`${bank.bankName} - ${bank.accountName}`}
            </Select.Option>
          ))}
        </Select>
        <Select
          className="mt-5 !w-[200px]"
          placeholder="Chọn loại phiếu"
          onChange={handleReceiptTypeChange} // Kết nối hàm xử lý
        >
          <Select.Option value="Phiếu Chi">Phiếu Chi</Select.Option>
          <Select.Option value="Phiếu Chi Khác">Phiếu Chi Khác</Select.Option>
        </Select>
      </Flex>
      <Flex justify="space-between" className="mx-5 mt-5">
        <div>
          <h3 className="text-xl font-bold">Sổ kế toán tiền gửi</h3>
          <Space style={{ marginBottom: 16 }}>
            <RangePicker onChange={onTable1RangeChange} />
            {/* <Button
              icon={<FileExcelOutlined />}
              onClick={() => exportToExcel(selectedRows1, 'SoKeToanTienGui')}
            >
              Xuất Excel
            </Button> */}
          </Space>
          <Table
            rowSelection={{
              type: "checkbox",
              onChange: (selectedRowKeys, selectedRows) =>
                setSelectedRows1(selectedRows),
            }}
            columns={columns1}
            dataSource={table1Data}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 550 }}
            className="!w-[620px]"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold">Sổ phụ ngân hàng</h3>
          <Space style={{ marginBottom: 16 }}>
            <RangePicker onChange={onTable2RangeChange} />
            <Upload {...uploadProps}>
              <Button icon={<FileExcelOutlined />}>Nhập Excel</Button>
            </Upload>
            {/* <Button
              icon={<FileExcelOutlined />}
              onClick={() => exportToExcel(selectedRows2, 'SoPhuNganHang')}
            >
              Xuất Excel
            </Button> */}
          </Space>
          <Table
            rowSelection={{
              type: "checkbox",
              onChange: (selectedRowKeys, selectedRows) =>
                setSelectedRows2(selectedRows),
            }}
            columns={columns2}
            dataSource={table2Data}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Flex>

      <Button
        className="ml-5"
        type="primary"
        onClick={() => setIsModalVisible(true)}
        disabled={selectedRows1.length === 0 || selectedRows2.length === 0}
      >
        Thêm
      </Button>

      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn tổng hợp và xóa dữ liệu đã chọn không?</p>
      </Modal>

      <div className="mt-5 mx-5">
        <h3 className="text-xl font-bold">Bảng tổng hợp</h3>
        <Table
          columns={combinedColumns}
          dataSource={combinedData}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Button className="ml-5 mt-5" type="primary">
        Xác nhận
      </Button>
    </div>
  );
};

export default TienGui;
