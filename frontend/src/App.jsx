// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Register from "./pages/Register";
// import { ToastContainer, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Login from "./pages/Login";
// import { useEffect, useState } from "react";
// import { getCurrentUser } from "./api/auth.api";
// import { useDispatch } from "react-redux";
// import { loginSuccess , logout } from "./store/authReducer";
// import Resetpassword from "./components/auth/Resetpassword";
// import Profile from "./components/dashboard/profile";
// import Dashboard from "./components/dashboard/dashboard";
// import Setting from "./components/dashboard/setting";
// import YourChannel from "./components/channel/yourChannel";
// import Sidebar from "./components/dashboard/sidebar";
// function App() {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     getCurrentUser()
//       .then((res) => {
//         if (res?.data) {
//           dispatch(loginSuccess({
//             user: res.data,
//             accessToken: null, // cookie তে আছে
//             refreshToken: null,
//           }));
//         } else {
//           dispatch(logout());
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching user data", error);
//         dispatch(logout());
//       })
//       .finally(() => setLoading(false));
//   }, [dispatch]);

//   if (loading) return <p>Loading....</p>;
 
//   return (
//     <div>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<Resetpassword />} />
      
// <Route path="/dashboard" element={<Sidebar />}/>
//   <Route index element={<Dashboard />} />
//   <Route path="profile" element={<Profile />} />
//   <Route path="setting" element={<Setting />} />




//         <Route path="/channel" element={<YourChannel />} />

//       </Routes>

//       {/* Toast Container */}
//       <ToastContainer
//         stacked
//         position="top-right"
//         autoClose={1800}
//         hideProgressBar
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="dark"
//         transition={Slide}
//          toastClassName="custom-toast"
//       />
//     </div>
//   );
// }

// export default App;



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
import Setting from "./components/dashboard/setting";
import YourChannel from "./components/channel/yourChannel";
import Sidebar from "./components/dashboard/sidebar";
import { Outlet } from "react-router-dom";
import DashboardHome from "./components/dashboard/dashboardHome";
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

  if (loading) return <p>Loading....</p>;

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Resetpassword />} />
        <Route path="/channel" element={<YourChannel />} />

        {/* Dashboard Routes (nested inside Sidebar layout) */}
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        stacked
        position="top-right"
        autoClose={1800}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Slide}
        toastClassName="custom-toast"
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
