import React from 'react';
import { Table, Input, Form, message } from 'antd';

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
      if (values[dataIndex] === undefined || values[dataIndex] === '') {
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
        toggleEdit();
      } else if (dataIndex === 'count' && values[dataIndex] > record.originalCount) {
        message.error('Số lượng không được lớn hơn số lượng cần thiết');
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
      } else {
        toggleEdit();
        handleSave({ ...record, ...values });
      }
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

const OrderTable = ({ dataSource, handleSave, discount, discountRate }) => {
  const calculateAmount = (record) => {
    const thanhTien = (record.count - record.delivered) * record.price;
    const tienChietKhau = (thanhTien * discountRate) / 100;
    const total = thanhTien - tienChietKhau;

    return {
      thanhTien,
      tienChietKhau,
      total,
    };
  };

  const columns = [
    {
      title: 'Mã hàng',
      dataIndex: ['product', 'id'],
      key: 'product.id',
      render: (_, record) => record.product.id,
    },
    {
      title: 'Tên hàng',
      dataIndex: ['product', 'name'],
      key: 'product.name',
      render: (_, record) => record.product.name,
    },
    {
      title: 'ĐVT',
      dataIndex: ['product', 'unit'],
      key: 'product.unit',
      render: (_, record) => record.product.unit,
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      editable: true,
      render: (_, record) => record.count - record.delivered,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `${text.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
      render: (_, record) => calculateAmount(record).thanhTien.toLocaleString('vi-VN'),
    },
    {
      title: '% chiết khấu',
      dataIndex: 'discountRate',
      key: 'discountRate',
      render: () => discountRate,
    },
    {
      title: 'Tiền chiết khấu',
      dataIndex: 'tienChietKhau',
      key: 'tienChietKhau',
      render: (_, record) => calculateAmount(record).tienChietKhau.toLocaleString('vi-VN'),
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => calculateAmount(record).total.toLocaleString('vi-VN'),
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
      dataSource={dataSource.map(item => ({ ...item, key: item.id }))}
      columns={mappedColumns}
      pagination={false}
    />
  );
};

export default OrderTable;
