import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        isSidebarExpanded={isExpanded}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          isExpanded={isExpanded}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          onCloseSidebar={handleCloseSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 bg-[#0A0A0A] overflow-y-auto pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
