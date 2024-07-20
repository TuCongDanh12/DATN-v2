import { Form, Input, DatePicker, Flex } from "antd";
import { Link } from "react-router-dom";
import UploadDoc from "../../upload";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
function FormHoadonMuahang() {
  return (
    <>
      <Form labelCol={{ span: 10 }}>
        <Flex gap={200}>
          <Flex vertical gap={1}>
            <Form.Item label="Mã nhà cung cấp">
              <Input className="!w-[400px]" disabled defaultValue="KH0001" />
            </Form.Item>

            <Form.Item label="Tên nhà cung cấp">
              <Input
                className="!w-[400px]"
                disabled
                defaultValue="Nguyễn Thị Hà"
              />
            </Form.Item>
            <Form.Item label="Mã số thuế">
              <Input
                className="!w-[400px]"
                disabled
                defaultValue="2000106948-001"
              />
            </Form.Item>
            <div>
              <span className="ml-[80px] mr-1">Tham chiếu đến hóa đơn</span>
              <Link className="!text-blue-600" href="#">
                ĐH0005
              </Link>
            </div>
            <Form.Item className='ml-[80px]'>
              <UploadDoc />
            </Form.Item>
          </Flex>
          <Flex vertical gap={1}>
            <Form.Item label="Mẫu số hóa đơn">
              <Input
                className="!w-[400px]"
                disabled
                defaultValue="02GTTT3/001"
              />
            </Form.Item>
            <Form.Item label="Số hóa đơn">
              <Input className="!w-[400px]" disabled defaultValue="HĐ00001" />
            </Form.Item>
            <Form.Item label="Ngày hóa đơn">
              <DatePicker
                className="!w-[400px]"
                disabled
                defaultValue={dayjs("2015/01/01", dateFormat)}
                format={dateFormat}
              />
            </Form.Item>
            <Form.Item label="Điều khoản thanh toán">
              <Input
                className="!w-[400px]"
                disabled
                defaultValue="Điều khoản 1"
              />
            </Form.Item>
          </Flex>
        </Flex>
      </Form>
    </>
  );
}

export default FormHoadonMuahang;
