// import React, { useState, useEffect } from "react";
// import {
//   PanelRight,
//   Home,
//   BarChart3,
//   FolderOpen,
//   Users,
//   Database,
//   FileText,
//   PenTool,
//   MoreHorizontal,
//   Settings,
//   HelpCircle,
//   Search,
//   Plus,
//   CirclePlus,
//   PanelLeft,
//   User,
//   Shield,
//   ChevronDown,
//   LogOut,
//   BadgePlus,
//   Menu,
//   Mic,
//   X,
//   Bell,
// } from "lucide-react";
// import { NavLink } from "react-router";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router";
// import { logout } from "../store/authReducer";
// import { logout as apiLogout } from "../api/auth.api";
// import { useDispatch } from "react-redux";
// import { useRef } from "react";
//    import { motion, AnimatePresence } from "framer-motion";
   
// const NavBar = ({ children }) => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isAccountOpen, setIsAccountOpen] = useState(false);
//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

//   const { user } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const dropdownRef = useRef(null);
//   const popupRef = useRef(null);
// const [isScrolled, setIsScrolled] = useState(false);

// useEffect(() => {
//   const handleScroll = () => {
//     setIsScrolled(window.scrollY > 10); // true if scrolled more than 10px
//   };

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, []);

//   // Handle click outside for dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setIsAccountOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await apiLogout();
//       dispatch(logout());
//       toast.success("Logout successfully");
//       navigate("/login");
//     } catch (error) {
//       toast.error(error.message || "Logout failed");
//     }
//   };

//   useEffect(() => {
//     const checkScreenSize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);

//       if (mobile) {
//         setIsExpanded(false);
//         setSidebarOpen(false);
//       } else {
//         setIsExpanded(true);
//         setSidebarOpen(true);
//       }
//     };

//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   const navItems = [
//     { id: "home", label: "Home", icon: Home, path: "/" },
//     { id: "Video", label: "Video", icon: CirclePlus, path: "/Video" },
//     { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
//     {
//       id: "password",
//       label: "Password",
//       icon: Shield,
//       path: "/dashboard/setting",
//     },
//   ];

//   const handleToggle = () => {
//     if (isMobile) {
//       setSidebarOpen(!sidebarOpen);
//     } else {
//       setIsExpanded(!isExpanded);
//     }
//   };

//   const NavItem = ({ item, isSubItem = false }) => {
//     const Icon = item.icon;
//     const showText = isMobile ? true : isExpanded;

//     return (
//   <NavLink
//   to={item.path}
//   end={item.path === "/"}
//   onClick={() => isMobile && setSidebarOpen(false)}
//   className={({ isActive }) => `
//     group flex items-center cursor-pointer transition-all duration-200
//     ${isSubItem ? "ml-2 pl-4 sm:ml-4 sm:pl-6" : "px-3"} 
//     py-2 mb-1 rounded-lg
    
//     ${!showText && !isSubItem && !isMobile ? "justify-center mx-auto" : ""}
//     ${
//    isActive
//   ? "bg-neutral-800 text-white font-medium border-l-4 border-red-600"
//   : "hover:bg-neutral-800 hover:text-white text-gray-300"
//     }
    
//   `}
// >
//         {({ isActive }) => (
//           <>
//             <div
//               className={`
//        flex items-center justify-center
//     rounded-lg
//     w-8 h-8
//     text-gray-300
//     transition-colors transition-transform duration-300 ease-in-out
//     ${isActive ? " text-red-600 scale-110" : "bg-transparent scale-100"}
//   `}
//             >
//               <Icon size={20} />
//             </div>

//             {showText && (
//               <span
//                 className={`
//                 ml-3 text-sm whitespace-nowrap
//                 transition-colors duration-200
//                 ${
//                   isActive
//                     ? "text-white"
//                     : "text-gray-300 group-hover:text-white"
//                 }
//               `}
//               >
//                 {item.label}
//               </span>
//             )}
//           </>
//         )}
//       </NavLink>
//     );

//   };


//   // Dropdown helper components
//   const DropdownItem = ({
//     icon,
//     text,
//     rightText = null,
//     danger = false,
//     onClick = () => {},
//   }) => {
//     return (
//       <button
//         onClick={onClick}
//         className={`w-full flex items-center space-x-3 px-4 py-3 ${
//           danger ? "text-red-400 hover:text-red-300" : "text-gray-300"
//         } hover:bg-[#0F0F0F] transition-colors cursor-pointer`}
//       >
//         {icon}
//         <span className="flex-1 text-left">{text}</span>
//         {rightText && (
//           <span className="text-gray-400 text-sm">{rightText}</span>
//         )}
//       </button>
//     );
//   };

//   const Divider = () => {
//     return <div className="border-t border-gray-700 my-2"></div>;
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-900">
//       {/* NavBar */}
// <header
//   className={`flex items-center justify-between px-4 py-3 text-white fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300
//     ${isScrolled ? "backdrop-blur-md bg-black/30" : "bg-gradient-to-r from-[#0f0f0f] to-[#181818]"}
//   `}
// >



//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleToggle}
//             className="p-2 hover:bg-gray-800 rounded-full cursor-pointer"
//           >
//             {isMobile ? (
//               sidebarOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )
//             ) : isExpanded ? (
//               <Menu className="w-6 h-6" />
//             ) : (
//               <Menu className="w-6 h-6" />
//             )}
//           </button>

//           <div className="flex items-center space-x-2">
//             <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center">
//               <span className="text-white font-bold text-base">▶</span>
//             </div>
//             <span className="text-xl font-semibold hidden sm:block">
//               TouTube
//             </span>
//             <span className="text-lg font-semibold sm:hidden">YT</span>
//             <sup className="text-xs text-gray-400">BD</sup>
//           </div>
//         </div>

//         {/* Center section (Desktop Search) */}
// <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
//   <div className="flex items-center w-full max-w-lg">
//     <div className="flex flex-1">
//       <input
//         type="text"
//         placeholder="Search"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="flex-1 px-4 py-2 rounded-l-full bg-neutral-800 border border-neutral-700
//          text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-gray-500/50 focus:outline-none border-r-0"
//       />
//       <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-r-full hover:bg-neutral-700 transition-colors border-l-0">
//         <Search className="w-5 h-5 text-gray-300" />
//       </button>
//     </div>
//     <button className="ml-3 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700">
//       <Mic className="w-5 h-5 text-gray-300" />
//     </button>
//   </div>
// </div>


//         {/* Right section */}
//         {!user ? (
//    <button
//   onClick={() => navigate("/register")}
//   type="button"
//   className="px-6 py-3 rounded-full cursor-pointer bg-white/10 backdrop-blur-md hover:bg-white/20
//              text-white font-semibold shadow-lg transition-all border border-white/20"
// >
//   Sign In
// </button>
//         ) : (
//           <div className="flex items-center space-x-4">
//             {/* Mobile search toggle */}
//             <button
//               className="md:hidden p-2 hover:bg-gray-800 rounded-full"
//               onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
//             >
//               <Search className="w-5 h-5" />
//             </button>

//             <button className="hidden sm:block p-2 hover:bg-gray-800 rounded-full">
//               <Plus className="w-6 h-6" />
//             </button>

//             <button className="relative p-2 hover:bg-gray-800 rounded-full">
//               <Bell className="w-6 h-6" />
//               <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">
//                 1
//               </span>
//             </button>

//             {/* Account Avatar */}
//             <div className="relative" ref={popupRef}>
//               <button
//                 onClick={() => setIsAccountOpen(!isAccountOpen)}
//                 className="flex items-center justify-center hover:bg-gray-800 rounded-full p-1"
//               >
//                 {user?.avatar ? (
//                   <img
//                     src={user.avatar}
//                     alt="User avatar"
//                     className="w-9 h-9 cursor-pointer rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-9 h-9 flex justify-center items-center rounded-full bg-pink-500 text-white font-semibold cursor-pointer">
//                     {user?.username?.[0]?.toUpperCase() || "G"}
//                   </div>
//                 )}
//               </button>

//               {/* NavBar Dropdown */}
          

// <AnimatePresence>
//   {isAccountOpen && (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.2, ease: "easeOut" }}
//       className="absolute right-0 mt-2 w-70 bg-[#181818] border border-neutral-700 rounded-lg shadow-xl z-50"
//     >
//       {/* User Info */}
//       <div className="p-4 border-b border-neutral-700 flex items-center space-x-3">
//         <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-lg cursor-pointer bg-red-600">
//           {user?.avatar ? (
//             <img
//               src={user.avatar}
//               alt="User avatar"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             user?.username?.[0]?.toUpperCase() || "G"
//           )}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="text-white font-semibold truncate">
//             {user?.username || "Guest User"}
//           </div>
//           <div className="text-gray-400 text-sm truncate">
//             {user?.email || "guest@example.com"}
//           </div>
//         </div>
//       </div>

//       {/* Menu Items */}
//       <div className="py-2">
//         <DropdownItem
//           icon={<User />}
//           text="Account Settings"
//           onClick={() => navigate("/accountsettings")}
//         />
//         <DropdownItem
//           icon={<User />}
//           text="Your Channel"
//           onClick={() => navigate("/channel")}
//         />
//         <DropdownItem
//           icon={<Settings />}
//           text="Dashboard"
//           onClick={() => navigate("/dashboard")}
//         />
//         <Divider />
//         <DropdownItem icon={<HelpCircle />} text="Help" />
//         <DropdownItem icon={<HelpCircle />} text="Send Feedback" />
//         <Divider />
//         <DropdownItem
//           onClick={handleLogout}
//           icon={<LogOut />}
//           text="Sign Out"
//           danger
//         />
//       </div>
//     </motion.div>
//   )}
// </AnimatePresence>

//             </div>
//           </div>
//         )}

//         {/* Mobile Search */}
// {/* Mobile Search */}
// {isMobileSearchOpen && (
//   <div className="absolute top-full left-0 right-0 p-3 md:hidden bg-neutral-900 border-t border-gray-700 z-40">
//     <div className="flex items-center space-x-2">
//       <div className="flex flex-1">
//       <input
//         type="text"
//         placeholder="Search"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="flex-1 px-4 py-2 rounded-l-full bg-neutral-800 border border-neutral-700
//          text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-gray-500/50 focus:outline-none border-r-0"
//       />
//       <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-r-full hover:bg-neutral-700 transition-colors border-l-0">
//         <Search className="w-5 h-5 text-gray-300" />
//       </button>
//     </div>
//     <button className="ml-3 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700">
//       <Mic className="w-5 h-5 text-gray-300" />
//     </button>
//     </div>
//   </div>
// )}

//       </header>

//       {/* Main Content Area with Sidebar */}
//       <div className="flex flex-1 relative">
//         {isMobile && sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 backdrop-blur-lg z-40"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <div
//   className={`
//     bg-[#0f0f0f] border-r border-gray-700 flex flex-col z-50
//     transition-all duration-300 ease-in-out
//     ${
//       isMobile
//         ? `fixed left-0 top-16 h-[calc(100vh-4rem)] ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-full"
//           } w-64`
//         : `${isExpanded ? "w-64 mt-16" : "w-16 items-center mt-16"}`
//     }
//   `}
// >

//           {/* Sidebar Header */}
//           <div
//             className="flex items-center justify-between p-2
//            border-b border-gray-700 h-16"
//           >
//             <div
//               className="flex items-center justify-between p-3 sm:p-4
//             border-gray-700 min-h-[60px]"
//             >
//               <div className="flex items-center transition-all duration-200">
//                 <h1 className="text-white font-bold text-lg sm:text-xl italic truncate">
//                   {isExpanded || isMobile ? "ToTube." : "T"}
//                 </h1>
//               </div>
//             </div>
//           </div>

//           {/* Main Navigation */}
//           <div className="flex-1 py-4 overflow-y-auto">
//             <nav className="px-3 space-y-1">
//               {navItems.map((item) => (
//                 <NavItem key={item.id} item={item} />
//               ))}
//             </nav>
//           </div>

//           {/* Bottom Navigation */}
//           <div
//             className="border-t border-gray-700  py-2
//            "
//           ></div>

//           {/* Sidebar User Section */}
//           <div className="relative p-2" ref={dropdownRef}>
//             <div
//               className={`group relative flex items-center px-3 py-3 rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${
//                 isExpanded || isMobile
//                   ? "bg-neutral-700/50 hover:bg-neutral-600/50"
//                   : "bg-transparent hover:bg-neutral-700/30 justify-center"
//               }`}
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             >
//               {user?.avatar ? (
//                 <img
//                   src={user.avatar}
//                   alt="User avatar"
//                   className="w-9 h-9 cursor-pointer rounded-full object-cover
//                    flex-shrink-0 ring-2 ring-transparent group-hover:ring-red-500 transition-all duration-300"
//                 />
//               ) : (
//                 <div className="w-9 h-9 flex justify-center items-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-semibold cursor-pointer flex-shrink-0 ring-2 ring-transparent group-hover:ring-pink-400/30 transition-all duration-300 shadow-lg">
//                   {user?.username?.[0]?.toUpperCase() || "G"}
//                 </div>
//               )}

//               {(isExpanded || isMobile) && (
//                 <div className="ml-3 transition-all duration-300 ease-out flex-1 transform group-hover:translate-x-0.5">
//                   <div className="text-white text-sm font-medium transition-colors duration-200 group-hover:text-blue-100">
//                     {user?.username || "Guest"}
//                   </div>
//                   <div className="text-gray-400 text-xs transition-colors duration-200 group-hover:text-gray-300">
//                     {user?.email || "guest@example.com"}
//                   </div>
//                 </div>
//               )}

//               {(isExpanded || isMobile) && (
//                 <div className="-ml-10 -mt-5">
//                   <ChevronDown
//                     className={`w-4 h-4 text-gray-400 transition-all duration-300 ease-out
//                        group-hover:text-gray-200 ${
//                          isDropdownOpen ? "rotate-180 text-red-600" : "rotate-0"
//                        }`}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Sidebar Dropdown */}
//             <div
//               className={`absolute bottom-full transition-all duration-300 ease-out transform origin-bottom z-50 ${
//                 isExpanded || isMobile
//                   ? "left-0 right-0 mb-2"
//                   : "left-full ml-2 mb-2 w-48"
//               } ${
//                 isDropdownOpen
//                   ? "opacity-100 scale-y-100 translate-y-0 visible"
//                   : "opacity-0 scale-y-95 translate-y-2 invisible"
//               }`}
//             >
//               <div className="bg-neutral-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 overflow-hidden ring-1 ring-white/10">
//                 <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

//                 <div
//                   className="relative flex items-center px-3 py-3 hover:bg-gradient-to-r hover:from-neutral-700/80 hover:to-neutral-600/60 cursor-pointer transition-all duration-200 text-gray-300 hover:text-white group/item transform hover:translate-x-1"
//                   onClick={() => {
//                     setIsDropdownOpen(false);
//                     navigate("/channel");
//                   }}
//                 >
//                   <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200"></div>
//                   <User className="w-4 h-4 mr-3 transition-all duration-200 group-hover/item:text-blue-400 group-hover/item:scale-110" />
//                   <span className="text-sm font-medium transition-all duration-200 whitespace-nowrap">
//                     Your Channel
//                   </span>
//                 </div>

//                 <div className="relative">
//                   <div className="border-t border-gray-700/50"></div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"></div>
//                 </div>

//                 <div
//                   className="relative flex items-center px-3 py-3 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 cursor-pointer transition-all duration-200 text-gray-300 hover:text-red-400 group/item transform hover:translate-x-1"
//                   onClick={() => {
//                     setIsDropdownOpen(false);
//                     handleLogout();
//                   }}
//                 >
//                   <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-200"></div>
//                   <LogOut className="w-4 h-4 mr-3 transition-all duration-200 group-hover/item:text-red-400 group-hover/item:scale-110" />
//                   <span className="text-sm font-medium transition-all duration-200 whitespace-nowrap">
//                     Logout
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {isDropdownOpen && (
//               <div
//                 className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 sm:hidden"
//                 onClick={() => setIsDropdownOpen(false)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 bg-[#0A0A0A] overflow-y-auto pt-16">
//   {children}
// </div>

//       </div>
//     </div>
//   );
// };

// export default NavBar;

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
        className={`flex items-center justify-between px-4 py-3 text-white fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300
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
            <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-base">▶</span>
            </div>
            <span className="text-xl font-semibold  hidden sm:block" 
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
                  <div className="w-9 h-9 flex justify-center items-center rounded-full bg-red-600 text-white font-semibold cursor-pointer">
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
                        onClick={() => navigate("/channel")}
                      />
                      <DropdownItem
                        icon={<Settings />}
                        text="Dashboard"
                        onClick={() => navigate("/dashboard")}
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