import { useSelector } from "react-redux";
import NavBar from "./Navbar";
import { toast } from "react-toastify";
import VideoList from "../components/video/VideoList";
import Homesidebar from "./HomeSlidebar";
import VideoDetails from "@/components/video/VideoDetails";
import Layout from "./Layout";

function Home() {


  return (


   <Layout>
    <VideoList />
    </Layout>

  );
}

export default Home;


