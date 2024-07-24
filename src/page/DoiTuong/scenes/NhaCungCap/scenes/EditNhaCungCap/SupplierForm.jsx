import React from 'react';
import { Form, Input, Select, Flex, Button, Table} from "antd";

const SupplierForm = ({ form, listSupplierGroupData, supplierData, disabled, handleAdd, dataSource, components, columns, navigate }) => {
    return (
        <div>
            <Form
                form={form}
                className='mb-4'
                labelCol={{
                    flex: '150px',
                }}
                labelAlign="left"
                labelWrap
                onFinish={(values) => console.log('Received values of form: ', values)}
            >
                <Flex gap={100} justify='center' className='w-[100%] align-left'>
                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Nhóm nhà cung cấp"
                            name='supplierGroup'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Select disabled={disabled}>
                                {
                                    listSupplierGroupData.map(item => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Tên nhà cung cấp"
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name='address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name='phoneNumber'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input placeholder="abc@gmail.com" disabled={disabled} />
                        </Form.Item>
                    </Flex>

                    <Flex vertical gap={5} className='w-[50%]'>
                        <Form.Item
                            label="Tên người liên hệ"
                            name='representative'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>
                        <Form.Item
                            label="Ngân hàng"
                            name='bankName'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Chủ tài khoản"
                            name='accountName'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Số tài khoản"
                            name='accountNumber'
                            rules={[
                                {
                                    required: true,
                                    message: 'Trường này là bắt buộc!',
                                },
                            ]}
                        >
                            <Input disabled={disabled} />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name='description'
                        >
                            <Input disabled={disabled} />
                        </Form.Item>
                    </Flex>
                </Flex>

                <div>
                    <Button
                        className='!bg-[#7A77DF] font-bold text-white flex items-center gap-1 mb-4'
                        onClick={handleAdd}
                        disabled={disabled}
                    >
                        Thêm 1 dòng
                    </Button>

                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </div>

                {disabled ?
                    <div className='w-full flex justify-end mt-6 mb-0'>
                        <Button
                            className='bg-[#FF7742] font-bold text-white'
                            type='link'
                            onClick={() => navigate(-1)}
                        >
                            Thoát
                        </Button>
                    </div> :
                    <Form.Item className='flex justify-end gap-2 mt-6 mb-0'>
                        <Button
                            className='bg-[#FF7742] font-bold text-white mr-2'
                            htmlType="reset"
                            onClick={() => navigate(-1)}
                        >
                            Hủy
                        </Button>
                        <Button
                            className='!bg-[#67CDBB] font-bold text-white'
                            htmlType="submit"
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                }
            </Form>
        </div>
    );
}

export default SupplierForm;
