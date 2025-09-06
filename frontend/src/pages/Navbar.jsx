import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Mic,
  Plus,
  Bell,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../store/authReducer";
import { logout as apiLogout } from "../api/auth.api";
import { toast } from "react-toastify";

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
const popupRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
      dispatch(logout());
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2 bg-black text-white relative">
      {/* Left section */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button className="p-2 hover:bg-gray-800 rounded-full">
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex items-center space-x-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base">▶</span>
          </div>
          <span className="text-lg sm:text-xl font-semibold hidden sm:block">
            TouTube
          </span>
          <span className="text-sm sm:text-lg font-semibold sm:hidden">YT</span>
          <sup className="text-xs text-gray-400">BD</sup>
        </div>
      </div>

      {/* Center section (Desktop Search) */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-6">
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-full 
                     focus:outline-none focus:border-blue-500 placeholder-gray-400 text-sm sm:text-base"
          />
          <button className="px-5 sm:px-6 py-2 bg-gray-800 border border-l-0 border-gray-700 rounded-r-full 
                         hover:bg-gray-700 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="ml-3 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right section */}
      {!user ? (
        <button
          onClick={() => navigate("/register")}
          type="button"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold shadow-lg transition-all"
        >
          Sign In
        </button>
      ) : (
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2 hover:bg-gray-800 rounded-full"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>

          <button className="hidden sm:block p-2 hover:bg-gray-800 rounded-full">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button className="relative p-2 hover:bg-gray-800 rounded-full">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              1
            </span>
          </button>

          {/* Account Avatar */}
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center justify-center hover:bg-gray-800 rounded-full p-1"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-8 h-8 cursor-pointer sm:w-9 sm:h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full bg-pink-500 text-white font-semibold cursor-pointer">
                  {user?.username?.[0]?.toUpperCase() || "G"}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {isAccountOpen && (
              <div className="absolute cursor-pointer right-0 mt-2 w-64 sm:w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                {/* User Info */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.username?.[0]?.toUpperCase() || "G"
                      )}
                    </div>

                    {/* User Info Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">
                        {user?.username || "Guest User"}
                      </div>
                      <div className="text-gray-400 text-sm truncate">
                        {user?.email || "guest@example.com"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <DropdownItem icon={<User />} text="Account Settings" onClick={() => navigate("/accountsettings")} />
                  <DropdownItem icon={<User />} text="Your Channel" onClick={() => navigate('/channel')} />
                  <DropdownItem icon={<Settings />} text="Dashboard" onClick={() => navigate('/dashboard')} />
                  <Divider />
                  <DropdownItem
                    icon={<Moon />}
                    text="Appearance"
                    rightText="Dark"
                  />
                  <DropdownItem
                    icon={<Globe />}
                    text="Language"
                    rightText="English"
                  />
                  <Divider />
                  <DropdownItem icon={<HelpCircle />} text="Help" />
                  <DropdownItem icon={<HelpCircle />} text="Send Feedback" />
                  <Divider />
                  <DropdownItem
                    onClick={handleLogout}
                    icon={<LogOut />}
                    text="Sign Out"
                    danger
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-700 p-3 md:hidden z-40">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-full 
                       focus:outline-none focus:border-blue-500 placeholder-gray-400"
            />
            <button className="px-4 py-2 bg-gray-800 border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-700">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-900 rounded-full hover:bg-gray-800">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* Helpers */
function DropdownItem({ icon, text, rightText = null, danger = false, onClick = () => {} }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 ${
        danger ? "text-red-400 hover:text-red-300" : "text-gray-300"
      } hover:bg-gray-700 transition-colors cursor-pointer`}
    >
      {icon}
      <span className="flex-1 text-left">{text}</span>
      {rightText ? (
        <span className="text-gray-400 text-sm">{rightText}</span>
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-gray-700 my-2"></div>;
}
