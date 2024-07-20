import React from 'react';
import { Table, Input, Form } from 'antd';

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const inputRef = React.useRef(null);
  const [editing, setEditing] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form form={form} style={{ margin: 0 }}>
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      </Form>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const OrderTable = ({ dataSource, handleSave }) => {
  const columns = [
    {
      title: 'Mã hàng',
      dataIndex: 'maHang',
      key: 'maHang',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'tenHang',
      key: 'tenHang',
    },
    {
      title: 'ĐVT',
      dataIndex: 'dvt',
      key: 'dvt',
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      editable: true,
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'soLuongDaBan',
      key: 'soLuongDaBan',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
    },
    {
      title: '% chiết khấu',
      dataIndex: 'phanTramChietKhau',
      key: 'phanTramChietKhau',
      editable: true,
    },
    {
      title: 'Tiền chiết khấu',
      dataIndex: 'tienChietKhau',
      key: 'tienChietKhau',
    },
    {
      title: '% thuế GTGT',
      dataIndex: 'phanTramThueGTGT',
      key: 'phanTramThueGTGT',
      editable: true,
    },
    {
      title: 'Tiền thuế GTGT',
      dataIndex: 'tienThueGTGT',
      key: 'tienThueGTGT',
    },
  ];

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const mappedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Table
      components={components}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={mappedColumns}
      pagination={false}
    />
  );
};

export default OrderTable;
