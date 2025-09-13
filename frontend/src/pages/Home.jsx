import { useSelector } from "react-redux";
import NavBar from "./Navbar";
import { toast } from "react-toastify";
import VideoList from "@/components/video/videoList";


function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <NavBar />
<VideoList />


 <button onClick={() => toast.success("reponsive plz")}>guta mar</button>
      {/* Page content */}
      {!user ? (
        <main className="p-6 flex justify-center items-center min-h-screen flex-col">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-400">
            You need to log in to access your dashboard.
          </p>
        </main>
      ) : (
        <main className="p-6 flex justify-center items-center min-h-screen flex-col">
          <h1 className="text-3xl font-bold mb-4">My App</h1>
          <p className="text-gray-400">
            Welcome {user.username || "User"}! You can start building your
            dashboard or home page content here.

          </p>
        </main>
      )}
    </div>
  );
}

export default Home;
