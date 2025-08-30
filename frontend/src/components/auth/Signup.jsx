import { set, useForm } from "react-hook-form";
import { registerUser } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authReducer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../ui/InputField";
import { User, Mail } from "lucide-react";
import PasswordField from "../ui/PasswordField";
import AvatarField from "../ui/AvatarUploader";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useState } from "react";
export default function SignupComponent() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [loading, setLoading] = useState(false)
  const onSubmit = async (formData) => {
    setLoading(true)
    try {
      const res = await registerUser(formData);

      if (res?.data) {
        dispatch(
          loginSuccess({
            user: res.data.user,
            accessToken: res.data.accessToken || null,
            refreshToken: res.data.refreshToken || null,
          })
        );
      }

      toast.success("Registration successful 🎉 Welcome!");
      reset();
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
            <p className="text-[#A8A8A8] text-sm">Create a new account</p>
          </div>

          <div className="space-y-4"></div>

          <form onSubmit={handleSubmit(onSubmit)}>

              <AvatarField
              id="avatar"
              name="avatar"
              register={register}
              setValue={setValue}
              error={errors.avatar}
            />


            <InputField
              id="full name"
              name="fullname"
              placeholder=" Name"
              icon={User}
              register={register}
              rules={{ required: "Full name is required" }}
              error={errors.fullname}
            />
            <InputField
              id="username"
              name="username"
              placeholder="username"
              icon={User}
              register={register}
              rules={{ required: "username name is required" }}
              error={errors.username}
            />

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
