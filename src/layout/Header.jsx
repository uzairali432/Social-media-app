import {
  Facebook,
  Search,
  Home,
  Users,
  PlaySquare,
  Store,
  Layout,
  Grid,
  MessageCircle,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import userImage from '../assets/user.png';
import { Button, Popconfirm } from "antd";
import { useState } from "react";

const menuItems = [
  { path: '/home', icon: Home },
  { path: '/findfriends', icon: Users },
  { path: '/reels', icon: PlaySquare },
  { path: '/marketplace', icon: Store },
  { path: "/games", icon: Layout },
];

const Header = () => {
  const { state } = useAuthContext();
  const { firstName, surName, email} = state;
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const handleOpenChange = (visible) => {
    setOpen(visible);
  };

  return (
    <header className="flex items-center justify-between bg-white px-4 py-2 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-[#0866ff] p-2 rounded-full">
          <Facebook className="text-white w-6 h-6" />
        </div>
        <div className="bg-gray-100 flex items-center px-3 py-2 rounded-full">
          <Search className="text-gray-500 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search Facebook"
            className="bg-transparent outline-none text-sm w-32 md:w-48"
          />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-8">
        {menuItems.map(({ path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path}>
              <Icon
                className={`w-6 h-6 cursor-pointer ${isActive
                    ? "text-[#0866ff] border-b-2 border-[#0866ff] pb-1"
                    : "text-gray-600 hover:text-[#0866ff]"
                  }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer">
          <Grid className="w-5 h-5 text-gray-700" />
        </div>
        <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer">
          <MessageCircle className="w-5 h-5 text-gray-700" />
        </div>
        <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 cursor-pointer relative">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">4</span>
        </div>
        <span className="font-medium text-sm">{firstName} {surName}</span>
        <Popconfirm
          placement="bottomRight"
          title={
            <div className="text-left">
              <p><strong>Name:</strong> {firstName} {surName}</p>
              <p><strong>Email:</strong> {email}</p>
            </div>
          }
          open={open}
          onOpenChange={handleOpenChange}
          okButtonProps={{ style: { display: "none" } }}
          cancelText="Close"
        >
          <div className="flex items-center bg-gray-100 rounded-full pr-2 cursor-pointer hover:bg-gray-200">
            <img src={userImage} alt="profile" className="w-8 h-8 rounded-full" />
            <Button type="text">
              <ChevronDown className="size-3 text-gray-700" />
            </Button>
          </div>
        </Popconfirm>
      </div>
    </header>
  );
};

export default Header;
