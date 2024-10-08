import React, { useState, useEffect } from "react";
import {
  Table,
  DatePicker,
  Space,
  Button,
  Modal,
  Upload,
  Select,
  message,
} from "antd";
import { Flex } from "antd";
import * as XLSX from "xlsx";
import { FileExcelOutlined } from "@ant-design/icons";
import doiTuongService from "../../services/doiTuong.service";
import muahangService from "../../services/muahang.service";
import congNoService from "../../services/congNo.service"; // Make sure to import your service

const { RangePicker } = DatePicker;

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
  const [postfinal, setPostfinal] = useState(null);
  const fetchListBankAccount = async () => {
    try {
      const res = await doiTuongService.getListBankAccount();
      const listBankAccount = res.data.result.data;
      setListBankAccount(listBankAccount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTransactionsForBankAccount = async (bankAccountId) => {
    try {
      const response = await congNoService.getAllTransactionBank(bankAccountId);
      const data = response.data.result.data.filter(
        (item) => item.reconciled === false
      );
      console.log("table2", response.data.result.data);
      const formattedData = data.map((transaction) => ({
        key: transaction.id, // Assuming transaction has an id
        giaoDich: transaction.transactionNumber, // Adjust based on your transaction structure
        ngayGiaoDich: transaction.date, // Adjust based on your transaction structure
        soTienThu: transaction.credit, // Assuming credit represents the amount received
        soTienChi: transaction.debit, // Assuming debit represents the amount spent
        noiDung: transaction.description, // Adjust as needed
      }));

      console.log("table2", formattedData);

      setTable2Data(formattedData); // Set the retrieved data into table 2
      console.log("table2", formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchPhieuChiKhacData = async (bankAccountId) => {
    try {
      const response = await muahangService.getListPhieuChiKhac();
      const data = response.data.result.data.filter(
        (item) => item.reconciled === false
      );

      console.log('Phiếu chi khác',data)

      const filteredData = data
        .filter(
          (receipt) =>
            receipt?.bankAccount?.id === bankAccountId && !receipt.isTienMat
        )
        .map((receipt) => ({
          key: receipt.id,
          chungTu: receipt.id,
          ngayHoachToan: receipt.paymentDate,
          soTienThu: receipt.money,
          soTienChi: 0,
          noiDung: receipt.content,
        }));

      setPhieuChiData(filteredData);
      setTable1Data(filteredData);
    } catch (error) {
      console.error("Error fetching 'Phiếu Chi Khác' data:", error);
    }
  };

  const fetchPhieuChiData = async (bankAccountId) => {
    try {
      const response = await muahangService.getListPhieuChiTienGui();
      const data = response.data.result.data.filter(
        (item) => item.reconciled === false
      );
      console.log("table1", response.data.result.data);
      const filteredData = data
        .filter((receipt) => receipt.bankAccount.id === bankAccountId)
        .map((receipt) => ({
          key: receipt.id,
          chungTu: receipt.id,
          ngayHoachToan: receipt.paymentDate,
          soTienThu: receipt.chungTu.reduce((total, ch) => total + ch.money, 0),
          soTienChi: 0,
          noiDung: receipt.content,
        }));

      setPhieuChiData(filteredData);
      setTable1Data(filteredData);
      console.log("table1", filteredData);
    } catch (error) {
      console.error("Error fetching receipt data:", error);
    }
  };

  const handleBankChange = (value) => {
    // console.log('nganhang', value)
    setSelectedBank(value);
    if (receiptType === "Phiếu Chi") {
      fetchPhieuChiData(value);
    } else if (receiptType === "Phiếu Chi Khác") {
      fetchPhieuChiKhacData(value);
    }

    // Fetch transactions for the selected bank account
    fetchTransactionsForBankAccount(value);
  };

  const handleReceiptTypeChange = (value) => {
    setReceiptType(value);
    if (value === "Phiếu Chi" && selectedBank) {
      fetchPhieuChiData(selectedBank);
    } else if (value === "Phiếu Chi Khác" && selectedBank) {
      fetchPhieuChiKhacData(selectedBank);
    } else {
      setTable1Data([]);
      setTable2Data([]); // Clear table 2 data when changing receipt type
    }
  };

  useEffect(() => {
    fetchListBankAccount();
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
    { title: "Mã giao dịch", dataIndex: "Magiaodich", key: "Magiaodich" },
    { title: "Số tiền thu", dataIndex: "soTienThu", key: "soTienThu" },
    { title: "Ngày giao dịch", dataIndex: "ngayGiaoDich", key: "ngayGiaoDich" },
  ];

  // Handle file upload and read Excel data
  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newData = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row[0]) break;

        newData.push({
          key: i,
          giaoDich: row[0],
          ngayGiaoDich: row[1],
          soTienThu: row[2],
          soTienChi: row[3],
          noiDung: row[4],
        });
      }

      setTable2Data([...table2Data, ...newData]);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleFileChange(file);
      return false;
    },
    showUploadList: false,
  };
  const handleOk = () => {
    // Combine selected rows from both tables
    const combined = selectedRows1.map((row1) => {
      const row2 = selectedRows2; // Ensure you are finding the row based on the correct key
      console.log("row2", row2);
      return {
        ...row1,
        id: row2 ? row2[0].key : null,
        Magiaodich: row2 ? row2[0].giaoDich : null, // Get transaction code from table 2 if row2 exists
        ngayGiaoDich: row2 ? row2[0].ngayGiaoDich : null, // Get transaction date from table 2 if row2 exists
      };
    });
    console.log("combined", combined);
    setPostfinal(combined);
    // Update combinedData
    setCombinedData((prevCombinedData) => [...prevCombinedData, ...combined]);

    // Filter out selected rows from table1Data and table2Data
    const newTable1Data = table1Data.filter(
      (row) => !selectedRows1.includes(row)
    );
    const newTable2Data = table2Data.filter(
      (row) => !selectedRows2.includes(row)
    );

    setTable1Data(newTable1Data);
    setTable2Data(newTable2Data);

    // Close modal and reset selections
    setIsModalVisible(false);
    setSelectedRows1([]);
    setSelectedRows2([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = async () => {
    try {
      if (!postfinal || postfinal.length === 0) {
        message.error("No data to create transactions.");
        return;
      }
  
      const transactionId = postfinal[0].id;
      const id = postfinal[0].chungTu;
  
      // Check the receipt type and call the appropriate API
      if (receiptType === "Phiếu Chi") {
        await congNoService.combinedTransaction(transactionId, id);
      } else if (receiptType === "Phiếu Chi Khác") {
        await congNoService.combinedOtherTransaction(transactionId, id);
      }
  
      message.success("Đối chiếu thành công");
      // Reset states after successful transaction
      setTable1Data([]);
      setTable2Data([]);
      setSelectedRows1([]);
      setSelectedRows2([]);
      setCombinedData([]);
      setPostfinal(null);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error creating transactions:", error);
      message.error("Có lỗi xảy ra khi tạo giao dịch.");
    }
  };
  

  return (
    <div>
      <Flex gap={30}>
        <Select
          placeholder="Chọn ngân hàng"
          style={{ width: "100%" }}
          value={selectedBank}
          onChange={handleBankChange}
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
          onChange={handleReceiptTypeChange}
        >
          <Select.Option value="Phiếu Chi">Phiếu Chi</Select.Option>
          <Select.Option value="Phiếu Chi Khác">Phiếu Chi Khác</Select.Option>
        </Select>
      </Flex>
      <Flex justify="space-between" className="mx-5 mt-5">
        <div>
          <h3 className="text-xl font-bold">Sổ kế toán tiền gửi</h3>
          <Space style={{ marginBottom: 16 }}>
            <RangePicker />
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
            <RangePicker />
            <Upload {...uploadProps}>
              <Button icon={<FileExcelOutlined />}>Nhập Excel</Button>
            </Upload>
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

      <Button className="ml-5 mt-5" type="primary" onClick={handleCreate}>
        Tạo
      </Button>
    </div>
  );
};

export default TienGui;
