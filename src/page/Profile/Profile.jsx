import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Flex,
  Table,
  Button,
  InputNumber,
  Select,
  Checkbox,
  DatePicker,
  Typography,
  Upload,
  Image,
  notification,
  Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  banHangSelector,
  getChungTuBan,
  postChungTuBan,
} from "../../store/features/banHangSlice";
import HoaDon from "../../component/Form/BanHang/HoaDon";
import { VND } from "../../utils/func";
import { doiTuongSelector } from "../../store/features/doiTuongSilce";
import moment from "moment";
import {
  authenticationSelector,
  getProfile,
  updateProfile,
  clearState,
} from "../../store/features/authenticationSlice";
import { Password } from "@mui/icons-material";

const dateFormat = "YYYY-MM-DD";
dayjs.extend(customParseFormat);

const Profile = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const params = useParams();
  //console.log("params", params)
  //console.log("params.id", params.id)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();

  const { profile, isSuccess, isError, message } = useSelector(
    authenticationSelector
  );

  useEffect(() => {
    if (isSuccess) {
      api.success({
        message: "Cập nhật dữ liệu thành công!",
        placement: "bottomLeft",
        duration: 2,
      });
      formAddNhomKhachHang.resetFields();
      setOpenAddNhomKhachHang(false);

      dispatch(clearState());
    } else if (isError) {
      api.error({
        message: message,
        placement: "bottomLeft",
        duration: 2,
      });

      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        ...profile,
      });

      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: profile?.avatar,
        },
      ]);
    }
  }, [profile]);

  //Avatar

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    //console.log("file", file)
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {/* <PlusOutlined /> */}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  //End
  const onFinish = (values) => {
    dispatch(updateProfile({ values }));
  };

  //console.log("previewImage", previewImage)

  //thay doi mat khau
  const [formAddNhomKhachHang] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openAddNhomKhachHang, setOpenAddNhomKhachHang] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCancelAddNhomKhachHang = () => {
    setOpenAddNhomKhachHang(false);
  };

  const onFinishAddNhomKhachHang = (values) => {
    //console.log('Received values of form: ', values);

    const dataConvert = {
      password: values.password,
    };

    //console.log("dataConvert", dataConvert)
    dispatch(updateProfile({ values: dataConvert }));
    // formAddNhomKhachHang.resetFields();

    // setOpenAddNhomKhachHang(false)
  };

  return (
    <div className="m-6">
      <h1 className="font-bold text-[32px] mb-6 text-center">
        Thông tin cá nhân
      </h1>

      <div className="w-[100px] h-[100px] mx-auto my-0 mb-8">
        <Upload
          action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 1 ? null : (
            <img
              src="/assets/user.jpg"
              alt="user"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>

      {contextHolder}

      <Modal
        title="THAY ĐỔI MẬT KHẨU"
        centered
        open={openAddNhomKhachHang}
        width={700}
        footer=""
        onCancel={handleCancelAddNhomKhachHang}
      >
        <Form
          form={formAddNhomKhachHang}
          layout="horizontal"
          onFinish={onFinishAddNhomKhachHang}
          labelCol={{
            flex: "200px",
          }}
          labelAlign="left"
          className="mt-4"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="ConfirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Trường này là bắt buộc!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu mới bạn nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
            <Button
              className="!bg-[#FF7742] font-bold text-white mr-2"
              htmlType="reset"
              onClick={() => setOpenAddNhomKhachHang(false)}
            >
              Hủy
            </Button>
            <Button
              className="!bg-[#67CDBB] font-bold text-white"
              htmlType="submit"
              // onClick={() => setOpenAddNhomKhachHang(false)}
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Form
        form={form}
        // labelCol={{ span: 10 }}
        className="mb-4"
        labelCol={{
          flex: "150px",
        }}
        labelAlign="left"
        labelWrap
        onFinish={onFinish}
      >
        <Flex
          gap={100}
          justify="center"
          className="w-[100%] items-center flex-col"
        >
          <Flex vertical gap={5} className="w-[50%]">
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input disabled={disabled} />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input disabled={disabled} />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input disabled={disabled} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Trường này là bắt buộc!",
                },
              ]}
            >
              <Input placeholder="abc@gmail.com" disabled={disabled} />
            </Form.Item>

            {/* <Form.Item
              label="Vị trí"
              name='role'
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc!',
                },
              ]}
            >
              <Input
                disabled={disabled}
              />
            </Form.Item> */}

            {disabled ? (
              <div className="w-full flex justify-end mt-6 mb-0">
                <Button
                  className="!bg-[#FF7742] font-bold text-white"
                  type="link"
                  onClick={() => navigate(-1)}
                >
                  Thoát
                </Button>
              </div>
            ) : (
              <Form.Item className="flex justify-end gap-2 mt-6 mb-0">
                {/* <Button
                  className='bg-[#FF7742] font-bold text-white mr-2'
                  htmlType="reset"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button> */}
                <Button
                  
                  type="link"
                  onClick={() => setOpenAddNhomKhachHang(true)}
                  className="!bg-[#FF7742] font-bold text-white mr-4"
                >
                  Thay đổi mật khẩu
                </Button>

                <Button
                  className="!bg-[#67CDBB] font-bold text-white"
                  htmlType="submit"
                  // onClick={() => navigate(-1)}
                >
                  Cập nhật
                </Button>
              </Form.Item>
            )}
          </Flex>
        </Flex>
      </Form>
    </div>
  );
};
export default Profile;
