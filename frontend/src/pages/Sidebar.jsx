import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  CirclePlus,
  User,
  Shield,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../store/authReducer";
import { logout as apiLogout } from "../api/auth.api";

const Sidebar = ({ isExpanded, isMobile, sidebarOpen, onCloseSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "Video", label: "Video", icon: CirclePlus, path: "/Video" },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
    {
      id: "password",
      label: "Password",
      icon: Shield,
      path: "/dashboard/setting",
    },
  ];

  const NavItem = ({ item, isSubItem = false }) => {
    const Icon = item.icon;
    const showText = isMobile ? true : isExpanded;

    return (
      <NavLink
        to={item.path}
        end={item.path === "/"}
        onClick={() => isMobile && onCloseSidebar()}
        className={({ isActive }) => `
          group flex items-center cursor-pointer transition-all duration-200
          ${isSubItem ? "ml-2 pl-4 sm:ml-4 sm:pl-6" : "px-3"} 
          py-2 mb-1 rounded-lg
          
          ${!showText && !isSubItem && !isMobile ? "justify-center mx-auto" : ""}
          ${
            isActive
              ? "bg-neutral-800 text-white font-medium border-l-4 border-red-600"
              : "hover:bg-neutral-800 hover:text-white text-gray-300"
          }
        `}
      >
        {({ isActive }) => (
          <>
            <div
              className={`
                flex items-center justify-center
                rounded-lg
                w-8 h-8
                text-gray-300
                transition-colors transition-transform duration-300 ease-in-out
                ${isActive ? " text-red-600 scale-110" : "bg-transparent scale-100"}
              `}
            >
              <Icon size={20} />
            </div>

            {showText && (
              <span
                className={`
                  ml-3 text-sm whitespace-nowrap
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
    <>
      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-lg z-1"
          onClick={onCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-[#0f0f0f] border-r border-gray-700 flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? `fixed left-0 top-16 h-[calc(100vh-4rem)] ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } w-64`
              : `${isExpanded ? "w-64 mt-16" : "w-16 items-center mt-16"}`
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-2 border-b border-gray-700 h-16">
          <div className="flex items-center justify-between p-3 sm:p-4 border-gray-700 min-h-[60px]">
            <div className="flex items-center transition-all duration-200">
              <h1 className="text-white font-bold text-lg sm:text-xl italic truncate">
                {isExpanded || isMobile ? "ToTube." : "T"}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-700 py-2"></div>

        {/* Sidebar User Section */}
        {user && (
          <div className="relative p-2" ref={dropdownRef}>
            <div
              className={`group relative flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
                isExpanded || isMobile
                  ? "bg-neutral-700/50 hover:bg-neutral-600/50"
                  : "bg-transparent hover:bg-neutral-700/30 justify-center"
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-9 h-9 cursor-pointer rounded-full object-cover
                   flex-shrink-0 ring-2 ring-transparent group-hover:ring-red-500 transition-all duration-300"
                />
              ) : (
                <div className="w-9 h-9 flex justify-center items-center rounded-full bg-gradient-to-br from-red-500
                 to-red-600 text-white font-semibold cursor-pointer flex-shrink-0 ring-2 ring-transparent group-hover:ring-pink-400/30 transition-all duration-300 shadow-lg">
                  {user?.username?.[0]?.toUpperCase() || "G"}
                </div>
              )}

              {(isExpanded || isMobile) && (
                <div className="ml-3 transition-all duration-300 ease-out flex-1 transform group-hover:translate-x-0.5">
                  <div className="text-white text-sm font-medium transition-colors duration-200 group-hover:text-blue-100">
                    {user?.username || "Guest"}
                  </div>
                  <div className="text-gray-400 text-xs transition-colors duration-200 group-hover:text-gray-300">
                    {user?.email || "guest@example.com"}
                  </div>
                </div>
              )}

              {(isExpanded || isMobile) && (
                <div className="-ml-10 -mt-5">
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-all duration-300 ease-out
                       group-hover:text-gray-200 ${
                         isDropdownOpen ? "rotate-180 text-red-600" : "rotate-0"
                       }`}
                  />
                </div>
              )}
            </div>

            {/* Sidebar Dropdown */}
            <div
              className={`absolute bottom-full transition-all duration-300 ease-out transform origin-bottom z-50 ${
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
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

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

                <div className="relative">
                  <div className="border-t border-gray-700/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"></div>
                </div>

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

            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 sm:hidden"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;