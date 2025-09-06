


import React, { useState } from "react";
import PasswordField from "../ui/PasswordField";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useForm } from "react-hook-form";
import { changePassword } from "@/api/auth.api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { Shield } from "lucide-react";

const Setting = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success(result.message || "Password changed successfully");
      reset();
    } catch (error) {
      toast.error(error.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="w-full   overflow-hidden min-h-screen flex flex-col items-center mt-10 sm:p-10">
      <div className="w-full max-w-lg p-5
       sm:p-8 rounded-2xl bg-[#171717] shadow-xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          Update Password
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Choose a strong password to protect your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PasswordField
            id="currentPassword"
            name="currentPassword"
            placeholder="Current Password"
            register={register}
            rules={{ required: "Current password is required" }}
            error={errors.currentPassword}
          />
          <PasswordField
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            register={register}
            rules={{
              required: "New password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            }}
            error={errors.newPassword}
          />
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm New Password"
            register={register}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            }}
            error={errors.confirmPassword}
          />

          <div className="flex gap-3">
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
                "update Password"
              )}          
        </button>
            <button
              type="button"
              className="px-5 rounded-md w-28 h-11 mt-5 flex items-center justify-center
               cursor-pointer bg-gray-800
                hover:bg-gray-700 text-white font-medium"
            >
              Cancel
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-3">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-red-600 hover:underline font-medium"
            >
              Reset Password
            </Link>
          </p>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-8 w-full max-w-lg p-5 bg-gray-800/30 border border-gray-700/30 rounded-xl backdrop-blur-sm shadow-inner">
        <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          Security Tips
        </h3>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Use at least 8 characters with mixed case, numbers, and symbols</li>
          <li>• Avoid using personal information or common words</li>
          <li>• Consider using a password manager for better security</li>
        </ul>
      </div>
    </div>
  );
};

export default Setting;
