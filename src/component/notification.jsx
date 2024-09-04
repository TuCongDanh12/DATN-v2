import React, { useState } from "react";
import { Flex, Button, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { notification } from "./../services/notification.service";

function NotificationComponent(props) {
  const [resolved, setResolved] = useState(props.resolved);

  const updateStatusRead = async (id) => {
    try {
      const res = await notification.updateReadStatus(props.id);
      console.log(res);
      // message.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      // message.error("Cập nhật thất bại");
    }
  };

 
  const DetailAnnouncement = (entityId, type) => {
    switch (type) {
      case "THU":
        return (
          <Link
            onClick={() => updateStatusRead(entityId)}
            to={`/ban-hang/hoa-don-ban-hang/xem/${entityId}`}
          >
            Xem chi tiết
          </Link>
        );
      case "BAN_HANG":
        return (
          <Link
            onClick={() => updateStatusRead(entityId)}
            to={`/ban-hang/don-dat-hang/xem/${entityId}`}
          >
            Xem chi tiết
          </Link>
        );
      case "MUA_HANG":
        return (
          <Link
            onClick={() => updateStatusRead(entityId)}
            to={`/mua-hang/don-mua-hang/xem/${entityId}`}
          >
            Xem chi tiết
          </Link>
        );
      default:
        return null;
    }
  };


  const confirm = async () => {
    try {
      const res = await notification.updateResolve(props.id);
      console.log(res);
      message.success("Cập nhật thành công");
      setResolved(true); // Update the resolved state
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  // Determine background color based on the message content
  const backgroundColor = props.message.toLowerCase().includes("quá hạn")
    ? "bg-[#FF6B6B]"
    : "bg-pink-100";

  return (
    <Flex
      justify="space-between"
      className={`border border-gray-300 shadow-md rounded-lg ${backgroundColor} p-2 ${props.className}`}
    >
      <p>{props.message}</p>
      <Flex gap={10} align="center" className="text-blue-500">
        {DetailAnnouncement(props.entityId, props.type)}
        {resolved ? (
          <Button disabled className="w-[120px]">
            Đã xử lý
          </Button>
        ) : (
          <Popconfirm
            title="Bạn chắc chắn đã xử lý thông báo này?"
            onConfirm={confirm}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button className="bg-pink-200 w-[120px]">Xác nhận xử lý</Button>
          </Popconfirm>
        )}
      </Flex>
    </Flex>
  );
}

export default NotificationComponent;
