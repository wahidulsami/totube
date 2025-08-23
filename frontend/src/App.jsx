// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer , Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Login";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />

      </Routes>

      {/* Toast container - একবারই পুরো অ্যাপে */}
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
