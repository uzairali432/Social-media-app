import {
  Users,
  FileText,
  LayoutGrid,
  Store,
  PlaySquare,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import userImage from "../../assets/user.png";
import { useAuthContext } from "../../context/AuthContext";

const LeftSidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const { state } = useAuthContext();
  const { firstName, surName } = state;

  const sidebarItems = [
    { to: "/findFriends", icon: <Users />, label: "Friends" },
    { to: "/home", icon: <FileText />, label: "Pages"},
    { to: "/games", icon: <LayoutGrid />, label: "Groups" },
    { to: "/marketplace", icon: <Store />, label: "Marketplace" },
    { to: "/reels", icon: <PlaySquare />, label: "Watch"},
  ];

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-white p-3 shadow-md overflow-y-auto sticky top-14">
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
        <img
          src={userImage}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-gray-800">{firstName} {surName}</span>
      </div>

      <div className="mt-3 space-y-1">
        {sidebarItems.map(({ to, icon, label, badge }) => (
          <Link key={label} to={to}>
            <SidebarItem
              icon={icon}
              label={label}
              badge={badge}
              active={location.pathname === to}
            />
          </Link>
        ))}
      </div>

      {/* See More */}
      <div
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-2 mt-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
      >
        <ChevronDown className="w-5 h-5" />
        <span>See More</span>
      </div>

      {/* Shortcuts */}
      {showMore && (
        <div className="mt-5 border-t border-gray-300 pt-3">
          <h2 className="text-gray-500 text-sm font-semibold mb-2">
            Your Shortcuts
          </h2>
          <div className="space-y-1">
            <ShortcutItem label="Gus's goods" />
            <ShortcutItem label="Shrek fan theories" />
            <ShortcutItem label="AL-JISR EXCHANGE PROGRAM" />
            <ShortcutItem label="Alien UFO Sightings Video" />
            <ShortcutItem label="Aliens, Alien Abductions" />
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Item
const SidebarItem = ({ icon, label, badge, active }) => (
  <div
    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200
      ${active ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100 text-gray-800"}
    `}
  >
    <div className="flex items-center gap-3">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
    {badge && <span className="text-xs text-blue-600 font-medium">{badge}</span>}
  </div>
);

// Shortcut Item
const ShortcutItem = ({ label }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
    <img
      className="w-8 h-8 bg-gray-200 rounded-full"
      src={userImage}
      alt="shortcut"
    />
    <span className="text-gray-800 text-sm">{label}</span>
  </div>
);

export default LeftSidebar;
