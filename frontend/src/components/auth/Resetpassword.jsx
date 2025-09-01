import { useState } from "react";
import * as React from "react"
import {
InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator
} from "../ui/shadcn-io/input-otp";
import { Spinner } from "../ui/shadcn-io/spinner";
import { toast } from "react-toastify";
import {
  sendResetPasswordOTP,
  resetPassword,
  verifyOTP,
} from "../../api/auth.api";
import { useForm } from "react-hook-form";

import InputField from "../ui/InputField";
import { Mail } from "lucide-react";
import PasswordField from "../ui/PasswordField";
import { useNavigate } from "react-router";
export function InputOTPDemo() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Step 1: Send OTP
  const handleSendEmailOTP = async (data) => {
    setLoading(true);
    try {
      const res = await sendResetPasswordOTP(data.email);
      toast.success(res.message);
      setEmail(data.email); // save email for next steps
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Please enter OTP");
    setLoading(true);

    try {
      const res = await verifyOTP({ email, otp });
      toast.success(res.message);
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await resetPassword({
        email,
        otp,
        newPassword: data.newPassword,
      });
      toast.success(res.message);
      reset();
      setOtp("");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
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
            <p className="text-[#A8A8A8] text-sm">Log in to your account</p>
          </div>

          <div className="space-y-4">
            {/* Step 1: Send OTP */}
            {step === 1 && (
              <form
                onSubmit={handleSubmit(handleSendEmailOTP)}
                className="space-y-4"
              >
                <InputField
                  id="email"
                  name="email"
                  placeholder="Email"
                  icon={Mail}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 cursor-pointer flex items-center justify-center gap-2 rounded-md bg-red-600
                    text-white py-2 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Spinner variant="default" className="text-white" size={20} />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyOTP();
                }}
                className="space-y-4 flex flex-col items-center justify-center"
              >
           <InputOTP 
  maxLength={6} 
  value={otp} 
  onChange={setOtp} 
  className="flex justify-center items-center"
>
  <InputOTPGroup className="flex">
    <InputOTPSlot 
      index={0} 
      className="h-12 w-12 text-white text-lg" 
    />
    <InputOTPSlot 
      index={1} 
      className="h-12 w-12 text-white text-lg" 
    />
    <InputOTPSlot 
      index={2} 
      className="h-12 w-12 text-white text-lg" 
    />
  </InputOTPGroup>

  <InputOTPSeparator className="text-white text-2xl px-2" />

  <InputOTPGroup className="flex">
    <InputOTPSlot 
      index={3} 
      className="h-12 w-12 text-white text-lg" 
    />
    <InputOTPSlot 
      index={4} 
      className="h-12 w-12 text-white text-lg" 
    />
    <InputOTPSlot 
      index={5} 
      className="h-12 w-12 text-white text-lg" 
    />
  </InputOTPGroup>
</InputOTP>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 cursor-pointer flex items-center justify-center gap-2 rounded-md bg-red-600
                    text-white py-2 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Spinner variant="default" className="text-white" size={20} />
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <form
                onSubmit={handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <PasswordField
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  register={register}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  error={errors.newPassword}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 cursor-pointer flex items-center justify-center gap-2 rounded-md bg-red-600
                    text-white py-2 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Spinner variant="default" className="text-white" size={20} />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputOTPDemo;
