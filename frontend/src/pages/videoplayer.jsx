// import Layout from "./Layout";
// import VideoDetails from "../components/video/VideoDetails";

// export default function VideoPage() {
//   return (
//     <Layout>
//       <VideoDetails />
//     </Layout>
//   );
// }
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // তোমার sidebar import করো
import { Menu } from "lucide-react";
import Navbar from "./Navbar";
import VideoDetails from "@/components/video/VideoDetails";

const VideoPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // যদি desktop expanded দরকার হয়
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        isMobile={true}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
          isMobile={true}
          sidebarOpen={sidebarOpen}
        />

        {/* Video Content */}
        <div className="pt-16"> {/* Navbar height offset */}
          <VideoDetails />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
