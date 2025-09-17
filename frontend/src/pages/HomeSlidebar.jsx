import React, { useState, useEffect } from "react";
import {
  PanelRight,
  Home,
  BarChart3,
  FolderOpen,
  Users,
  Database,
  FileText,
  PenTool,
  MoreHorizontal,
  Settings,
  HelpCircle,
  Search,
  Plus,
CirclePlus,
  PanelLeft,
  User,
  Shield,
  ChevronDown,
  LogOut,
  BadgePlus,
} from "lucide-react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { logout } from "../store/authReducer";
import { logout as apiLogout } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { useRef } from 'react';



const Homesidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

 const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


const dropdownRef = useRef(null);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  if (isDropdownOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };

}, [isDropdownOpen]);
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

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setIsExpanded(false);
        setSidebarOpen(false);
      } else {
        setIsExpanded(true);
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // const mainNavItems = [
  //   { id: "quick-create", label: "Quick Create", icon: Plus, active: true },
  //   { id: "dashboard", label: "Dashboard", icon: Home },
  //   { id: "profile", label: "Profile", icon: User },
  //   { id: "password", label: "Password", icon: Shield },
  //   { id: "analytics", label: "Analytics", icon: BarChart3 },
  //   { id: "projects", label: "Projects", icon: FolderOpen },
  //   { id: "team", label: "Team", icon: Users },
  // ];

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {id:"Video" , label:"Video" , icon:CirclePlus , path:"/Video"},
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
    {
      id: "password",
      label: "Password",
      icon: Shield,
      path: "/dashboard/setting",
    },
  ];

  const bottomNavItems = [
    { id: "help", label: "Get Help", icon: HelpCircle },
    { id: "search", label: "Search", icon: Search },
  ];

  const handleToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const NavItem = ({ item, isSubItem = false }) => {
    const Icon = item.icon;
    const showText = isMobile ? true : isExpanded;

    return (
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={() => isMobile && setSidebarOpen(false)}
        className={({ isActive }) => `
        group flex items-center cursor-pointer transition-all duration-200
        ${isSubItem ? "ml-2 pl-4 sm:ml-4 sm:pl-6" : "px-2 sm:px-3"} 
        py-1 sm:py-1.5 mb-1 rounded-lg
        ${!showText && !isSubItem && !isMobile ? "justify-center mx-auto" : ""}
        ${
          isActive
            ? "   text-white"
            : "hover:bg-red-600 hover:text-white ease-in-out transition-all"
        }
      `}
      >
        {({ isActive }) => (
          <>
            {/* Icon */}
            <div
              className={`
       flex items-center justify-center
    rounded-lg
    w-8 h-8 sm:w-9 sm:h-9
    text-gray-300
    transition-colors transition-transform duration-300 ease-in-out
    ${isActive ? "bg-white text-red-600 scale-110" : "bg-transparent scale-100"}
  `}
            >
              <Icon size={isMobile ? 22 : 20} />
            </div>

            {/* Label */}
            {showText && (
              <span
                className={`
                ml-2 sm:ml-3 text-sm sm:text-base whitespace-nowrap
                transition-colors duration-200
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-300 group-hover:text-white"
                }
              `}
              >
                {item.label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 relative">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {isMobile && (
        <button
          onClick={handleToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
        bg-[#171717] border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out z-50
        ${
          isMobile
            ? `fixed left-0 top-0 h-full ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } w-64`
            : `${
                isExpanded
                  ? "w-48 sm:w-56 lg:w-64"
                  : "w-12 sm:w-14 lg:w-16 flex justify-center items-center"
              }`
        }
      `}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 min-h-[60px]">
          <div
            className={`
            flex items-center transition-all duration-200
            ${
              isMobile || isExpanded
                ? "opacity-100"
                : "opacity-0 w-0 overflow-hidden"
            }
          `}
          >
            <h1 className="text-white font-bold text-lg sm:text-xl italic truncate">
              ToTube.
            </h1>
          </div>
          <button
            onClick={handleToggle}
            className="p-1.5 sm:p-2 cursor-pointer rounded-lg  hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            {(isMobile && sidebarOpen) || (!isMobile && isExpanded) ? (
              <PanelLeft size={18} />
            ) : (
              <PanelRight size={18} />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        {/* Main Navigation */}
        <div className="flex-1 py-2 sm:py-4 overflow-y-auto">
          <nav className="px-2 sm:px-3">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-700 p-2 sm:p-3">
          <nav className="px-2 sm:px-3">
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path || "#"}
                className={`
          flex items-center cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 mb-1 rounded-lg
          transition-colors duration-200
          text-gray-300 hover:text-white
        `}
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-gray-300 hover:text-white transition-colors transition-transform duration-300">
                  <item.icon size={isMobile ? 22 : 20} />
                </div>

                {(isExpanded || isMobile) && (
                  <span className="ml-2 sm:ml-3 text-sm sm:text-base whitespace-nowrap text-gray-300 hover:text-white transition-colors duration-200">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="relative"  ref={dropdownRef}>
          {/* Main trigger button with enhanced hover effects */}
          <div
            className={`group relative flex items-center px-2 p-6 rounded-lg m-1 mb-5 sm:px-3 py-1 sm:py-1.5 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
              isExpanded || isMobile
                ? "bg-neutral-700/50 hover:bg-neutral-600/50"
                : "bg-transparent hover:bg-neutral-700/30"
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Avatar with subtle glow effect */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-8 h-8 cursor-pointer sm:w-9 sm:h-9 rounded-full object-cover
                 flex-shrink-0 ring-2 ring-transparent group-hover:ring-red-500 transition-all duration-300"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-semibold cursor-pointer flex-shrink-0 ring-2 ring-transparent group-hover:ring-pink-400/30 transition-all duration-300 shadow-lg">
                {user?.username?.[0]?.toUpperCase() || "G"}
              </div>
            )}

            {/* User info with improved animations */}
            {(isExpanded || isMobile) && (
              <div className="ml-2 sm:ml-3 transition-all duration-300 ease-out flex-1 transform group-hover:translate-x-0.5">
                <div className="text-white text-xs sm:text-sm font-medium transition-colors duration-200 group-hover:text-blue-100">
                  {user?.username || "Guest"}
                </div>
                <div className="text-gray-400 text-xs transition-colors duration-200 group-hover:text-gray-300">
                  {user?.email || "guest@example.com"}
                </div>
              </div>
            )}

            {/* Enhanced chevron with smooth rotation - only show when expanded or mobile */}
            {(isExpanded || isMobile) && (
              <div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-all duration-300 ease-out group-hover:text-gray-200 ${
                    isDropdownOpen ? "rotate-180 text-red-600" : "rotate-0"
                  }`}
                />
              </div>
            )}
          </div>

          {/* Enhanced dropdown with improved animations and responsive positioning */}
          <div
            className={`absolute bottom-full transition-all duration-300 ease-out m-1 transform origin-bottom z-50 ${
              // Position based on sidebar state
              isExpanded || isMobile
                ? "left-0 right-0 mb-2"
                : "left-full ml-2 mb-2 w-48"
            } ${
              isDropdownOpen
                ? "opacity-100 scale-y-100 translate-y-0 visible"
                : "opacity-0 scale-y-95 translate-y-2 invisible"
            }`}
          >
            <div className="bg-neutral-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 overflow-hidden ring-1 ring-white/10">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

              {/* Your Channel option */}
              <div
                className="relative flex items-center px-3 py-3 hover:bg-gradient-to-r hover:from-neutral-700/80 hover:to-neutral-600/60 cursor-pointer transition-all duration-200 text-gray-300 hover:text-white group/item transform hover:translate-x-1"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate("/channel");
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200"></div>
                <User className="w-4 h-4 mr-3 transition-all duration-200 group-hover/item:text-blue-400 group-hover/item:scale-110" />
                <span className="text-sm font-medium transition-all duration-200 whitespace-nowrap">
                  Your Channel
                </span>
              </div>

              {/* Animated divider */}
              <div className="relative">
                <div className="border-t border-gray-700/50"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"></div>
              </div>

              {/* Logout option */}
              <div
                className="relative flex items-center px-3 py-3 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 cursor-pointer transition-all duration-200 text-gray-300 hover:text-red-400 group/item transform hover:translate-x-1"
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200"></div>
                <LogOut className="w-4 h-4 mr-3 transition-all duration-200 group-hover/item:text-red-400 group-hover/item:scale-110" />
                <span className="text-sm font-medium transition-all duration-200 whitespace-nowrap">
                  Logout
                </span>
              </div>
            </div>
          </div>

          {/* Backdrop overlay for mobile */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 sm:hidden"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`
        bg-[#0A0A0A]
        ${isMobile ? "w-full" : ""}
      `}
      >
        {/* Main Content */}

        <div
          className={`
    
    ${isMobile ? "w-full" : ""}
  `}
        ></div>
      </div>
    </div>
  );
};

export default Homesidebar;
