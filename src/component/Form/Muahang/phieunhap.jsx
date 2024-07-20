import { Form, Input, DatePicker, Flex } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
function FormPhieunhap() {
  return (
    <Form labelCol={{ span: 10 }}>
       
      <Flex gap={200}>
        <Flex vertical gap={5}>
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
          <Form.Item label="Người giao hàng">
            <Input className='!w-[400px]'
             disabled defaultValue="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item label="Nhân viên mua hàng">
            <Input className='!w-[400px]'
            disabled defaultValue="Từ Công Danh" />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input
                className='!w-[400px]'
              disabled
              defaultValue="1-2 Bãy Thiện, Thành phố Cà Mau, Tỉnh Cà Mau, Việt Nam"
            />
          </Form.Item>
        </Flex>
        <Flex vertical gap={5}>
          <Form.Item label="Ngày hoạch toán">
            <DatePicker
            className='!w-[400px]'
              disabled
              defaultValue={dayjs("2015/01/01", dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label="Số chứng từ">
            <DatePicker
            className='!w-[400px]'
              disabled
              defaultValue={dayjs("2015/01/01", dateFormat)}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item label="Số phiếu nhập">
            
            <Input className='!w-[400px]' disabled defaultValue="NK0006" />
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
}

export default FormPhieunhap;
