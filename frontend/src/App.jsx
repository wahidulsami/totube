

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./store/authReducer";
import Resetpassword from "./components/auth/Resetpassword";
import Profile from "./components/dashboard/profile";

import YourChannel from "./components/channel/yourChannel";
import Sidebar from "./components/dashboard/sidebar";
import { Outlet } from "react-router-dom";
import DashboardHome from "./components/dashboard/dashboardHome";
import VideoUpload from "./components/video/videoUpload";
import SettingsPage from "./components/dashboard/SetingModel";
// import Videoplayer from "./pages/videoplayer";
// import VideoDetails from "./components/video/VideoDetails";
import VideoPage from "./pages/videoplayer";
import { Spinner } from "./components/ui/shadcn-io/spinner";
import Channel from "./components/channel/channel";
import FeedbackForm from "./components/feedbeck/feedback";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res?.data) {
          dispatch(
            loginSuccess({
              user: res.data,
              accessToken: null,
              refreshToken: null,
            })
          );
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);


if (loading) {
  return (
    <div className="flex  border border-[#1B1B1B] p-8 
                    bg-[linear-gradient(145deg,_#1B1B1B_0%,_#171717_100%)]
                    shadow-[0_20px_40px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.05)] items-center justify-center h-screen">
      <Spinner variant="default" className="text-white" size={24} />
    </div>
  );
}

  return (
       <div className="transition-opacity duration-500 opacity-100">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Resetpassword />} />
     <Route path="/channel/:username" element={<Channel />} />
        <Route path="/accountsettings" element={<SettingsPage />} />

        
      <Route path="/video/:id" element={<VideoPage />} />


        {/* VIDEOS */}
      
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<FeedbackForm />} />




        {/* Dashboard Routes (nested inside Sidebar layout) */}
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="videoUpload" element={<VideoUpload />} />
        </Route>
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        stacked
        position="top-center"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Slide}
     
      />
    </div>
  );
}

/* Wrapper layout for dashboard routes */
function SidebarLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-[#0A0A0A] overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}



export default App;
