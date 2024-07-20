import { Flex, Select, Radio } from "antd";

function Option({ onChange }) {
  return (
    <Flex gap={20} className='mx-[30px]'>
      <Select
        className="!w-[200px]"
        defaultValue="Chưa thanh toán"
        style={{ width: 120 }}
        onChange={onChange}
        options={[
          { value: "Chưa thanh toán", label: "Chưa thanh toán" },
          { value: "Thanh toán ngay", label: "Thanh toán ngay" },
        ]}
      />
      <Flex gap={5} align="center" justify="center">
        <p>Phương thức thanh toán</p>
        <Select
          className="!w-[200px]"
          defaultValue="Tiền mặt"
          style={{ width: 120 }}
        //   onChange={handleChange}
          options={[{ value: "Tiền mặt", label: "Tiền mặt" }]}
        />
      </Flex>
      <Radio>Hóa đơn</Radio>
    </Flex>
  );
}

export default Option;
