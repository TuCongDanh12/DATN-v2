import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarFooter } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../utils/theme";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FaCoins } from "react-icons/fa";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { MdOutlineDashboard } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import SellIcon from "@mui/icons-material/Sell";
import { ShoppingCart } from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssessmentIcon from "@mui/icons-material/Assessment";
import "./Sidebar.css";
import { LiaObjectGroup } from "react-icons/lia";
import { RiLogoutCircleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { authenticationSelector } from "../../store/features/authenticationSlice";
import { Badge } from "antd";
import { notification } from "../../services/notification.service";
import { setNoti, tongQuanSelector } from "../../store/features/tongQuanSlice";

const Item = ({ title, to, icon, selected, setSelected, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        if (onClick) onClick(); // Gọi onClick nếu có
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({
  toggled,
  handleToggleSidebar,
  isCollapsed,
  handleIsCollapsed,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Tổng quan");
  const [showSettings, setShowSettings] = useState(false);
  const dispatch = useDispatch();
  const history = useNavigate();

  const { profile } = useSelector(authenticationSelector);
  const { noti } = useSelector(tongQuanSelector);

  const [notificationAll2, setNotificationAll] = useState([]);
  const [type2, setType2] = useState(null);
  const [isResolved2, setIsResolved2] = useState(false);
  const [isRead2, setIsRead2] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    history("/dang-nhap");
  };

  const getAllNotification2 = async () => {
    try {
      const params = {
        ...(type2 !== null && { type: type2 }),
        ...(isResolved2 !== null && { isResolved: isResolved2 }),
        ...(isRead2 !== null && { isRead: isRead2 }),
      };
      const res = await notification.getAll(params);
      if (res.data) {
        setNotificationAll(res.data?.result?.data);
        dispatch(
          setNoti(
            res.data?.result?.data?.filter(
              (item) => item?.isRead === false || item?.isResolved === false
            )?.length
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllNotification2();
  }, [type2, isResolved2, isRead2]);

  // Check localStorage for admin value
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    setShowSettings(admin === true);
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          bgcolor: "#FFF6D8 !important",
        },
        "& .pro-menu-item.active .pro-item-content>p": {
          fontWeight: "bold",
        },
        "& .css-1l8icbj": {
          paddingLeft: "5% !important",
        },
      }}
    >
      <ProSidebar
        collapsed={isCollapsed}
        toggled={toggled}
        onToggle={handleToggleSidebar}
        breakPoint="md"
      >
        <Menu iconShape="square">
          <MenuItem
            onClick={() => handleIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <FaCoins /> Big Ledger
                </Typography>
                <IconButton onClick={() => handleIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Chung
            </Typography>

            <Item
              title="Tổng quan"
              to="/tong-quan"
              icon={<MdOutlineDashboard size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Đối tượng"
              to="/doi-tuong/nhom-khach-hang"
              icon={<LiaObjectGroup size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Mua hàng"
              to="/mua-hang/don-mua-hang"
              icon={<SellIcon size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Bán hàng"
              to="/ban-hang/don-dat-hang"
              icon={<ShoppingCart size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Tiền mặt"
              to="/tien-mat"
              icon={<ReceiptOutlinedIcon size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tiền gửi"
              to="/tien-gui"
              icon={<AccountBalanceIcon size={20} />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Nợ"
              to="/cong-no/chi-tiet-no-phai-thu"
              icon={<FaCoins size={20} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Báo cáo"
              to="/bao-cao/chi-tiet-doanh-thu-nhan-vien"
              icon={<AssessmentIcon size={20} />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Hỗ trợ
            </Typography>
            <Item
              title="Thông báo"
              to="/thong-bao"
              icon={
                <Badge size="small" count={noti}>
                  <IoMdNotificationsOutline size={20} />
                </Badge>
              }
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Hỗ trợ"
              to="/ho-tro"
              icon={<HelpOutlineOutlinedIcon size={20} />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              onClick={handleLogout} // Gọi hàm logout
              title="Đăng xuất"
              to="/dang-nhap"
              icon={<RiLogoutCircleFill size={20} />}
              selected={selected}
              setSelected={setSelected}
            />

            {showSettings && (
              <Item
                title="Cài đặt"
                to="/cai-dat/thong-tin-cong-ty"
                icon={<SettingsOutlinedIcon size={20} />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </Menu>

        <SidebarFooter>
          <Link
            to="/profile"
            title="Profile"
            onClick={() => setSelected("Profile")}
          >
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <div className="side-menu-footer">
                <div className="avatar">
                  <img src={profile?.avatar} alt="user" />
                </div>
                <div className="user-info">
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    hidden={isCollapsed}
                  >
                    {profile?.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    color={colors.grey[100]}
                    hidden={isCollapsed}
                  >
                    {profile?.email}
                  </Typography>
                </div>
              </div>
            </Box>
          </Link>
        </SidebarFooter>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
