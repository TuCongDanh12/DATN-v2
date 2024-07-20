import { Form, Input, DatePicker, Flex } from "antd";
import { Link } from "react-router-dom"
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
function FormPhieuchi() {
  return (
    <>
    <Form labelCol={{ span: 10 }}>
       
      <Flex gap={200}>
        <Flex vertical gap={1}>
          <Form.Item label="Mã nhà cung cấp">
            <Input 
            className='!w-[400px]'
            disabled defaultValue="KH0001" />
          </Form.Item>

          <Form.Item label="Tên nhà cung cấp">
            <Input 
            className='!w-[400px]'
            disabled defaultValue="Nguyễn Thị Hà" />
          </Form.Item>
          <Form.Item label="Mã số thuế">
            <Input className='!w-[400px]'
             disabled defaultValue="2000106948-001" />
          </Form.Item>
          <Form.Item label="Người nhận">
            <Input className='!w-[400px]'
            disabled defaultValue="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
                className='!w-[400px]'
              disabled
              defaultValue="1-2 Bãy Thiện, Thành phố Cà Mau, Tỉnh Cà Mau, Việt Nam"
            />
          </Form.Item>
        </Flex>
        <Flex vertical gap={1}>
          <Form.Item label="Ngày hoạch toán">
            <DatePicker
            className='!w-[400px]'
              disabled
              defaultValue={dayjs("2015/01/01", dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label="Ngày chứng từ">
            <DatePicker
            className='!w-[400px]'
              disabled
              defaultValue={dayjs("2015/01/01", dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label="Số chứng từ">
            
            <Input className='!w-[400px]' disabled defaultValue="PC0001" />
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
    <span className='ml-[80px] mr-1'>Tham chiếu đến hóa đơn</span>
    <Link className='!text-blue-600' href='#'>ĐH0005</Link>
    </>
  );
}

export default FormPhieuchi;
