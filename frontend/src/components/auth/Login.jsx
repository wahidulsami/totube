import React , {useState} from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth.api";
import { loginSuccess } from "../../store/authReducer";
import InputField from "../ui/InputField";
import PasswordField from "../ui/PasswordField";
import { Mail , } from "lucide-react";

import { Spinner } from "../ui/shadcn-io/spinner";
export default function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit,   formState: { errors } } = useForm();
const [loading, setLoading] = useState(false)
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await loginUser(data);

      if (res?.data) {
       
        dispatch(loginSuccess({
          user: res.data.user,             
          accessToken: res.data.accessToken || null,
          refreshToken: res.data.refreshToken || null,
        }));

        toast.success("Login successful!");
        navigate("/"); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error(error);
    } finally{
      setLoading(false)
    }
  };

  return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#0F0F0F_70%)]">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl border border-[#1B1B1B] p-8 
                    bg-[linear-gradient(145deg,_#1B1B1B_0%,_#171717_100%)]
                    shadow-[0_20px_40px_rgba(0,0,0,0.65),_inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <div className="text-center mb-8">
            <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-[#A8A8A8] text-sm">log in your account</p>
          </div>

          <div className="space-y-4"></div>

          <form onSubmit={handleSubmit(onSubmit)}>
  

            <InputField
              id="email"
              name="email"
              placeholder="Email"
              icon={Mail} // your mail icon
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }}
              error={errors.email}
            />

            <PasswordField
              id="password"
              name="password"
              placeholder="Password"
              register={register}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 6 characters",
                },
              }}
              error={errors.password}
            />

            {/* Avatar Upload */}

   <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 cursor-pointer flex items-center justify-center gap-2 rounded-md bg-red-600
               text-white py-2 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner variant="default" className="text-white" size={20} />
                </>
              ) : (
                "Sign up"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}




