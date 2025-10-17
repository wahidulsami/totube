import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Menu,
  Mic,
  X,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../store/authReducer";
import { logout as apiLogout } from "../api/auth.api";



const Navbar = ({ onToggleSidebar, isSidebarExpanded, isMobile, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const DropdownItem = ({ icon, text, rightText = null, danger = false, onClick = () => {} }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 ${
          danger ? "text-red-400 hover:text-red-300" : "text-gray-300"
        } hover:bg-[#0F0F0F] transition-colors cursor-pointer`}
      >
        {icon}
        <span className="flex-1 text-left">{text}</span>
        {rightText && <span className="text-gray-400 text-sm">{rightText}</span>}
      </button>
    );
  };

  const Divider = () => {
    return <div className="border-t border-gray-700 my-2"></div>;
  };

  return (
    <>
      <header
        className={`flex items-center justify-between px-4 py-3
           text-white fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300
          ${isScrolled ? "backdrop-blur-md bg-black/30" : "bg-gradient-to-r from-[#0f0f0f] to-[#181818]"}
        `}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-full cursor-pointer"
          >
            {isMobile ? (
              sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )
            ) : isSidebarExpanded ? (
              <Menu className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center space-x-2">
            <div onClick={() => navigate("/")} className="w-9 h-9 bg-red-600 rounded cursor-pointer  flex items-center justify-center">
              <span className="text-white font-bold text-base">▶</span>
            </div>
            <span className="text-xl font-semibold  hidden sm:block cursor-pointer" 
            onClick={() => navigate("/")}
            >TouTube</span>
            <span className="text-lg font-semibold sm:hidden">YT</span>
            <sup className="text-xs text-gray-400">BD</sup>
          </div>
        </div>

        {/* Center section (Desktop Search) */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
          <div className="flex items-center w-full max-w-lg">
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-full bg-neutral-800 border border-neutral-700
                 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-gray-500/50 focus:outline-none border-r-0"
              />
              <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-r-full hover:bg-neutral-700 transition-colors border-l-0">
                <Search className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            <button className="ml-3 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700">
              <Mic className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Right section */}
        {!user ? (
          <button
            onClick={() => navigate("/register")}
            type="button"
            className="px-6 py-3 rounded-full cursor-pointer bg-white/10 backdrop-blur-md hover:bg-white/20
                       text-white font-semibold shadow-lg transition-all border border-white/20"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-800 rounded-full"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            <button className="hidden sm:block p-2 hover:bg-gray-800 rounded-full">
              <Plus className="w-6 h-6" />
            </button>

            <button className="relative p-2 hover:bg-gray-800 rounded-full">
              <Bell className="w-6 h-6" />
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
                    className="w-9 h-9 cursor-pointer rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 flex justify-center items-center rounded-full
                  bg-gradient-to-br from-red-500 to-red-600
                  text-white font-semibold cursor-pointer">
                    {user?.username?.[0]?.toUpperCase() || "G"}
                  </div>
                )}
              </button>

              {/* Navbar Dropdown */}
              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-70 bg-[#181818] border border-neutral-700 rounded-lg shadow-xl z-50"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-neutral-700 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg cursor-pointer bg-red-600">
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
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold truncate">
                          {user?.username || "Guest User"}
                        </div>
                        <div className="text-gray-400 text-sm truncate">
                          {user?.email || "guest@example.com"}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <DropdownItem
                        icon={<User />}
                        text="Account Settings"
                        onClick={() => navigate("/accountsettings")}
                      />
                      <DropdownItem
                        icon={<User />}
                        text="Your Channel"
                        onClick={() => navigate(`/channel/${user?.username}`)}
                       
                      />
                      <DropdownItem
                        icon={<Settings />}
                        text="Dashboard"
                        onClick={() => navigate("/dashboard")}
                      />
                      <Divider />
                      <DropdownItem icon={<HelpCircle />} text="Help" />
                      <DropdownItem icon={<HelpCircle />} text="Send Feedback" 
                      onClick={() => navigate("/feedback")}
                      />
                      <Divider />
                      <DropdownItem
                        onClick={handleLogout}
                        icon={<LogOut />}
                        text="Sign Out"
                        danger
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-3 md:hidden bg-neutral-900 border-t border-gray-700 z-40">
          <div className="flex items-center space-x-2">
            <div className="flex flex-1">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-full bg-neutral-800 border border-neutral-700
                 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-gray-500/50 focus:outline-none border-r-0"
              />
              <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-r-full hover:bg-neutral-700 transition-colors border-l-0">
                <Search className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            <button className="ml-3 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700">
              <Mic className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;