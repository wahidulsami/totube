import{
createContext,
useContext,
useState,
useEffect
} from "react"
import axiosInstance from "../api"

const authContext = createContext()


export const AuthProvider = ({childern}) => {
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    const fetchCurrentUser = async () =>{
        try {
            const res = await axiosInstance.get()
            setUser(res.data)
        } catch (error) {
            setUser(null);
        }finally {
      setLoading(false);
    }
    }
}