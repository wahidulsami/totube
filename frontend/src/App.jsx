import { Routes, Route, data } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess , logout } from "./store/authReducer";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res?.data) {
          dispatch(loginSuccess({
            user: res.data,
            accessToken: null, // cookie তে আছে
            refreshToken: null,
          }));
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
      />
    </div>
  );
}

export default App;
