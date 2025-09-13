import React, { useState } from "react";
import { updateAvatar, updateCover, updateProfile } from "@/api/auth.api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Spinner } from "../ui/shadcn-io/spinner";
import { Camera, Instagram, UserCircle, Globe, Facebook, Twitter, Linkedin } from "lucide-react";

const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultAvatar = "/default/defaultAvatar.png";
  const defaultCover = "/default/defaultCover.jpg";

  const { user } = useSelector((state) => state.auth);

  // Avatar select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;

      if (width < 2048 || height < 1152) {
        toast.error("Cover photo must be at least 2048x1152 pixels!");
        return;
      }

      if (width !== 2560 || height !== 1440) {
        toast.info("Best size is 2560x1440 (YouTube recommended).");
      }

      setCoverPreview(img.src);
      setCoverFile(file);
    };
  };

  // Upload Avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile) return toast.error("Please select an avatar first!");
    setLoadingAvatar(true);
    try {
      const res = await updateAvatar(avatarFile);
      toast.success(res.message || "Avatar updated successfully");
      setAvatarPreview(URL.createObjectURL(avatarFile));
      setAvatarFile(null);
    } catch (error) {
      toast.error(error.message || "Avatar update failed");
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Upload Cover
  const handleCoverUpload = async () => {
    if (!coverFile) return toast.error("Please select a cover image first!");
    setLoadingCover(true);
    try {
      const res = await updateCover(coverFile);
      toast.success(res.message || "Cover updated successfully");
      setCoverPreview(URL.createObjectURL(coverFile));
      setCoverFile(null);
    } catch (error) {
      toast.error(error.message || "Cover update failed");
    } finally {
      setLoadingCover(false);
    }
  };

  // Update Profile Info
  const handleProfileDetails = async (e) => {
    e.preventDefault();

    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const bio = e.target.bio.value;

    let social = {
      url: e.target.url.value.trim(),
      facebook: e.target.facebook.value.trim(),
      twitter: e.target.twitter.value.trim(),
      linkedin: e.target.linkedin.value.trim(),
      instagram: e.target.instagram.value.trim(),
    };

    Object.keys(social).forEach((key) => {
      if (!social[key]) {
        delete social[key];
      }
    });

    setLoading(true);
    try {
      const res = await updateProfile({ fullname, email, bio, social });
      toast.success(res.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
<div className="mb-4 sm:mb-8 lg:mb-10 mt-10">
  <div className="bg-gradient-to-r from-[#0F0F0F] to-[#1E1E1E] 
                  rounded-2xl shadow-2xl border border-[#2A2A2A] 
                  p-4 sm:p-5 lg:p-5 backdrop-blur-sm">
    <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
      <div className="p-2 sm:p-3 lg:p-3 bg-red-600/20 rounded-xl">
        <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-500" />
      </div>
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-white mb-1 sm:mb-1.5">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm md:text-base lg:text-base text-gray-400">
          Manage your personal information and settings
        </p>
      </div>
    </div>
  </div>
</div>



        {/* Main Profile Card */}
        <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] rounded-3xl shadow-2xl border border-[#2A2A2A] overflow-hidden">
          {/* Cover Section */}
          <div className="relative w-full h-64 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img
              src={coverPreview || user?.coverImage || defaultCover}
              alt="cover"
              className="w-full h-full object-cover"
            />

            {/* Cover Actions */}
            {user && (
              <div className="absolute top-6 right-6 flex flex-wrap gap-3 z-20">
                <label className="group px-6 py-3 bg-black/40 backdrop-blur-md rounded-2xl text-white text-sm font-medium cursor-pointer border border-white/20 hover:bg-red-600/90 hover:border-red-600 transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center gap-2">
                    <Camera size={16} />
                    Choose Cover
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    hidden
                  />
                </label>

                {coverFile && (
                  <button
                    onClick={handleCoverUpload}
                    disabled={loadingCover}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-sm font-medium text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 shadow-lg"
                  >
                    {loadingCover ? (
                      <>
                        <Spinner variant="default" className="text-white" size={16} />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        Update Cover
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Avatar Section */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-20">
              <div className="relative group">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={avatarPreview || user?.avatar || defaultAvatar}
                    alt="avatar"
                    className="w-36 h-36 rounded-full border-4 border-gray-900 object-cover shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {user && (
                  <label className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md p-3 rounded-full cursor-pointer shadow-lg border border-white/20 hover:bg-red-600/90 hover:border-red-600 transition-all duration-300 transform hover:scale-110">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                    <Camera size={18} className="text-white" />
                  </label>
                )}
              </div>

              {/* Update Avatar Button */}
              {avatarFile && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleAvatarUpload}
                    disabled={loadingAvatar}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-sm font-medium text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 shadow-lg"
                  >
                    {loadingAvatar ? (
                      <>
                        <Spinner variant="default" className="text-white" size={16} />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        Update Avatar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
<div className="pt-20  pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] border
               border-[#3A3A3A] rounded-3xl shadow-2xl p-4 md:p-8 sm:p-4 lg:p-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Update Profile</h2>
                  <p className="text-gray-400">Keep your information up to date</p>
                </div>

                <form onSubmit={handleProfileDetails} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-300">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullname"
                          defaultValue={user?.fullname || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={user?.email || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        defaultValue={user?.bio || ""}
                        rows={4}
                        className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none resize-none transition-all duration-300"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pt-4 border-t border-[#3A3A3A]">
                      <div className="p-2 bg-red-600/20 rounded-lg">
                        <Globe className="w-5 h-5 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Social Links</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <Globe size={16} />
                          Website URL
                        </label>
                        <input
                          type="url"
                          name="url"
                          defaultValue={user?.social?.url || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <Facebook size={16} />
                          Facebook
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          defaultValue={user?.social?.facebook || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="https://facebook.com/username"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <Twitter size={16} />
                          Twitter / X
                        </label>
                        <input
                          type="url"
                          name="twitter"
                          defaultValue={user?.social?.twitter || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <Linkedin size={16} />
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          defaultValue={user?.social?.linkedin || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                          <Instagram size={16} />
                          Instagram
                        </label>
                        <input
                          type="url"
                          name="instagram"
                          defaultValue={user?.social?.instagram || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
<div className="pt-6 border-t border-[#3A3A3A] flex justify-center items-center">
  <button
    disabled={loading}
    type="submit"
    className="flex w-full sm:w-auto max-w-sm md:max-w-md items-center justify-center gap-2
               rounded-2xl bg-gradient-to-r from-red-600 to-red-700
               text-white py-2.5 sm:py-3 px-4 sm:px-5 text-sm sm:text-base md:text-base font-semibold
               hover:from-red-700 hover:to-red-800 focus:ring-4
               focus:ring-red-600/20 transition-all duration-300
               disabled:opacity-50 disabled:cursor-not-allowed
               shadow-2xl"
  >
    {loading ? (
      <>
        <Spinner variant="default" className="text-white" size={20} />
        <span>Saving Changes...</span>
      </>
    ) : (
      <>
        <UserCircle size={20} />
        <span>Save Changes</span>
      </>
    )}
  </button>
</div>



                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default Profile;