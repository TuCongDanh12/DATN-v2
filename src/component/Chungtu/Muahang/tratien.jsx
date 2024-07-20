import { Form, Flex, Input } from "antd";
const Tratien = () => {
  <Form>
    <p>Trả tiền nhà cung cấp theo hóa đơn</p>
    <Flex vertical gap={10}>
      <Form.Item label="Mã nhà cung cấp">
        <Input className="!w-[400px]" disabled defaultValue="KH0001" />
      </Form.Item>
    </Flex>
  </Form>;
};

export default Tratien;
