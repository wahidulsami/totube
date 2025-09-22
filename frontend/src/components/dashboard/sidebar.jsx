import React, { useState, useEffect, useRef } from "react";
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
  Menu,
  Bell,
  Video,
} from "lucide-react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { logout } from "../../store/authReducer";
import { logout as apiLogout } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import SettingsPage from "./SetingModel";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Close sidebar on mobile if clicking outside
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if clicked element is not the menu button or its children
        const menuButton = document.querySelector('[data-menu-button]');
        if (menuButton && !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen, isMobile, sidebarOpen]);

  // Handle escape key to close sidebar/dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else if (isMobile && sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDropdownOpen, isMobile, sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

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

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "Quick create", label: "Quick create", icon: CirclePlus, path: "/dashboard/videoUpload" },
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
    { id: "content", label: "Content", icon: FileText, path: "/dashboard/content" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { id: "community", label: "Community", icon: Users, path: "/dashboard/community" },
    { id: "subtitles", label: "Subtitles", icon: FileText, path: "/dashboard/subtitles" },
    { id: "copyright", label: "Copyright", icon: Shield, path: "/dashboard/copyright" },
    { id: "earn", label: "Earn", icon: Database, path: "/dashboard/earn" },
    { id: "customization", label: "Customization", icon: PenTool, path: "/dashboard/customization" },
    { id: "audio", label: "Audio library", icon: Database, path: "/dashboard/audio" },
  ];

  const bottomNavItems = [
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      onClick: () => navigate("/accountsettings"),
      //  onClick: () => setIsSettingsModalOpen(true), // Open modal
      isModal: true 
    },
    { id: "feedback", label: "Send feedback", icon: HelpCircle, path: "/dashboard/feedback" },
  ];

  const handleToggle = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleNavItemClick = () => {
    // Close sidebar when clicking nav item on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const NavItem = ({ item, isSubItem = false }) => {
    const Icon = item.icon;
    const showText = isMobile ? true : isExpanded;

    // Handle modal items differently
    if (item.isModal) {
      return (
        <button
          onClick={() => {
            item.onClick();
            if (isMobile) setSidebarOpen(false);
          }}
          className={`
            group flex items-center cursor-pointer transition-all duration-200
            px-3 py-2.5 rounded-lg mb-1 w-full text-left
            ${!showText && !isSubItem && !isMobile ? "justify-center mx-auto" : ""}
            hover:bg-white/5 text-gray-300 hover:text-white
          `}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-6 h-6 text-current">
            <Icon size={20} />
          </div>

          {/* Label */}
          {showText && (
            <span className="ml-6 text-sm whitespace-nowrap">
              {item.label}
            </span>
          )}
        </button>
      );
    }

    return (
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={handleNavItemClick}
        className={({ isActive }) => `
        group flex items-center cursor-pointer transition-all duration-200
        px-3 py-2.5 rounded-lg mb-1
        ${!showText && !isSubItem && !isMobile ? "justify-center mx-auto" : ""}
        ${
          isActive
            ? "bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-white"
            : "hover:bg-white/5 text-gray-300 hover:text-white"
        }
      `}
      >
        {({ isActive }) => (
          <>
            {/* Icon */}
            <div className="flex items-center justify-center w-6 h-6 text-current">
              <Icon size={20} />
            </div>

            {/* Label */}
            {showText && (
              <span className="ml-6 text-sm whitespace-nowrap">
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

{/* {isSettingsModalOpen && (
  <SettingsPage
    isOpen={isSettingsModalOpen}
    onClose={() => setIsSettingsModalOpen(false)}
    user={user}
  />
)} */}


      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#212121] border-b border-gray-700 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - Menu and Logo */}
          <div className="flex items-center space-x-4">
            <button
              data-menu-button
              onClick={handleToggle}
              className="p-2 text-gray-300 cursor-pointer hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            
            {/* YouTube Studio Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 p-1.5 rounded">
                <Video className="text-white" size={20} />
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">
                Studio
              </span>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search across your channel"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-gray-600 rounded-full py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Right section - Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button - hidden */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors md:hidden hidden">
              <Search size={20} />
            </button>
            
            {/* Create button */}
            <button 
              onClick={() => navigate("/dashboard/videoUpload")}
              className="flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer bg-white/10 backdrop-blur-md hover:bg-white/20
                       text-white font-semibold shadow-lg transition-all border border-white/20"
            >
              <Video size={18} />
              <span className="hidden sm:inline">Create</span>
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-blue-500 transition-all duration-300"
                  />
                ) : (
                  <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold">
                    {user?.username?.[0]?.toUpperCase() || "G"}
                  </div>
                )}
              </div>

              {/* User dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#282828] rounded-lg shadow-xl border border-gray-600 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-600">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="User avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold">
                          {user?.username?.[0]?.toUpperCase() || "G"}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium">
                          {user?.username || "Guest"}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {user?.email || "guest@example.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <div
                      className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        
                      }}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Your Channel</span>
                    </div>
                    
                    <div
                      className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        //  setIsSettingsModalOpen(true)
                        navigate("/accountsettings");
                      }}
                    >
                      <Settings  className="w-5 h-5 mr-3" />
                      <span>Settings</span>
                    </div>

                    <div className="border-t border-gray-600 mt-2"></div>

                    <div
                      className="flex items-center px-4 py-3 hover:bg-red-900/20 cursor-pointer text-gray-300 hover:text-red-400 transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Sign out</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
        bg-[#171717] border-r border-gray-700 flex flex-col transition-all 
        duration-300 ease-in-out z-50 
        ${
          isMobile
            ? `fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `mt-16 ${
                isExpanded
                  ? "w-48 sm:w-56 lg:w-64"
                  : "w-12 sm:w-14 lg:w-16"
              }`
        }
      `}
      >
        {/* Sidebar Header with User Channel Info */}
    <div className="p-2 border-b border-gray-700">
  {/* User Channel Section */}
  <div className={`flex items-center ${isExpanded || isMobile ? "justify-start space-x-3" : "justify-center"}`}>
    <div className="relative">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Channel avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-lg">
          {user?.username?.[0]?.toUpperCase() || "W"}
        </div>
      )}
    </div>

    {(isExpanded || isMobile) && (
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm mb-1">
          {user?.username || "unknown"}
        </div>
        <div className="text-gray-400 text-xs truncate">
          {user?.email || "unknown"}
        </div>
      </div>
    )}
  </div>
</div>


        {/* Main Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-700 p-4">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;