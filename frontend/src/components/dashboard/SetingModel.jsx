import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  UserCircle,
  Camera,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateAvatar, updateCover, updateProfile } from "@/api/auth.api";
import { Spinner } from "../ui/shadcn-io/spinner";
import { useNavigate } from "react-router";
import SettingchangePassword from "./changePassword";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const defaultAvatar = "/default/defaultAvatar.png";
  const defaultCover = "/default/defaultCover.jpg";

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loading, setLoading] = useState(false);

  // Avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

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

  // Cover
const handleCoverChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;


  if (!file.type.startsWith("image/")) {
    toast.error("Please upload an image file (JPG, PNG, WEBP).");
    return;
  }


  if (file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB.");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const { width, height } = img;


    if (width < 1128 || height < 190) {
      toast.error("Cover image must be at least 1128x190 pixels.");
      return;
    }

    const aspectRatio = width / height;
    if (aspectRatio < 5.5 || aspectRatio > 6.5) {
      toast.error("Invalid aspect ratio! Use a wide cover (around 6:1 ratio).");
      return;
    }


    setCoverPreview(img.src);
    setCoverFile(file);
    toast.success("Cover image looks good!");
  };

  img.onerror = () => {
    toast.error("Invalid image file.");
  };
};

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

  // Profile update
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
    
    <div className="min-h-screen bg-[#121212] p-4 sm:p-8">
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 min-h-[600px] mt-8 sm:mt-20">
        {/* Back Arrow above sidebar */}
        <div className="flex flex-col w-full lg:w-72 cursor-pointer">
          {/* Back Arrow */}
          <div className="mb-4">
            <button
              className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg border border-white/10 bg-[#1c1c1c] hover:bg-white/10 transition"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>

           
          </div>
          <aside
            className="w-full lg:w-72 
             border-2 border-white/10 rounded-lg h-fit 
             bg-[#1c1c1c] p-4 sticky top-8"
          >
            <div className="mb-4 pb-4 border-b border-gray-700">
              <h2 className="text-white font-semibold text-lg">Settings</h2>
              <p className="text-gray-400 text-sm">Manage your preferences</p>
            </div>
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-gray-600/50 to-gray-700/50 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-[#1b1b1b] border-2 border-gray-500/50 rounded-lg p-4 sm:p-8">
            {activeTab === "profile" && (
              <div className="space-y-4">
                {/* Header */}
                <h3 className="text-2xl font-bold flex items-center gap-3 text-white mb-4">
                  <UserCircle size={28} /> Profile Settings
                </h3>

                {/* Profile Form */}
                <form onSubmit={handleProfileDetails} className="space-y-6">
                  {/* Avatar & Cover */}
                  <div className="flex flex-col items-center gap-4">
                    {/* Cover */}

                 
                    <div className="relative bg-[#0A0A0A] rounded-xl overflow-hidden shadow-lg mx-auto w-full max-w-[1128px]">
                      
              
                      <div className="w-full relative h-[160px] sm:h-auto">
                       
                        <img
                          src={coverPreview || user?.coverImage || defaultCover}
                          alt="cover"
                          className="w-full h-full sm:h-auto object-cover sm:object-contain object-center transition-all duration-300"
                        />
                    
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                    
                      {user && (
                        <div className="absolute bottom-2 right-2 left-2 flex gap-2 justify-end z-10 px-2 py-1">
                      
                   
                  <label
  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 
    text-xs sm:text-sm rounded-lg whitespace-nowrap backdrop-blur-sm
    ${loadingCover 
      ? "bg-gray-600 cursor-not-allowed pointer-events-none" 
      : "bg-black/60 text-white hover:bg-red-600 cursor-pointer"}`}
>
  <Camera size={14} className="sm:w-4 sm:h-4" />
  <span className="hidden xs:inline sm:inline">Change Cover</span>
  <span className="xs:hidden">Change</span>
  <input
    type="file"
    accept="image/*"
    onChange={handleCoverChange}
    hidden
    disabled={loadingCover} // prevents selecting file
  />
</label>

                       
                          {coverFile && (
                            <button
                              onClick={handleCoverUpload}
                              disabled={loadingCover}
                              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5
                               bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs
                                sm:text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50
                                 whitespace-nowrap backdrop-blur-sm"
                            >
                              
                              {loadingCover ? (
                                <>
                                  
                                  <Spinner
                                    variant="default"
                                    className="text-white"
                                    size={14}
                                  />
                                  <span className="hidden xs:inline">
                                    Updating...
                                  </span>
                                </>
                              ) : (
                                <>
                                  
                                  <Camera size={14} /> <span>Update</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={avatarPreview || user?.avatar || defaultAvatar}
                        alt="avatar"
                        className="w-36 h-36 rounded-full border-4 border-gray-900 object-cover shadow-2xl"
                      />
                      {user && (
                        <label className="absolute bottom-0 right-0 bg-black/60 p-3 rounded-full cursor-pointer hover:bg-red-600 transition-all">
                          <Camera size={18} className="text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            hidden
                          />
                        </label>
                      )}
                    </div>
                    {avatarFile && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={handleAvatarUpload}
                          disabled={loadingAvatar}
                          className="px-6 py-3 bg-gradient-to-r cursor-pointer from-red-600 to-red-700 rounded-2xl text-sm font-medium text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 shadow-lg"
                        >
                          {loadingAvatar ? (
                            <>
                              <Spinner
                                variant="default"
                                className="text-white"
                                size={16}
                              />
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

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        defaultValue={user?.fullname || ""}
                        className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2  focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300  border-[#2A2A2A] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user?.email || ""}
                        className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2 border-[#2A2A2A]
                         focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-300">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      defaultValue={user?.bio || ""}
                      rows={4}
                      className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2  focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 border-[#2A2A2A] text-white"
                    />
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Social Links
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Globe size={16} /> Website
                        </label>
                        <input
                          type="url"
                          name="url"
                          defaultValue={user?.social?.url || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2  focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 border-[#2A2A2A] text-white"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Facebook size={16} /> Facebook
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          defaultValue={user?.social?.facebook || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F]   focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 border-2 border-[#2A2A2A] text-white"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Twitter size={16} /> Twitter
                        </label>
                        <input
                          type="url"
                          name="twitter"
                          defaultValue={user?.social?.twitter || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F]   focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 border-2 border-[#2A2A2A] text-white"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Linkedin size={16} /> Linkedin
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          defaultValue={user?.social?.linkedin || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F] border-2  focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300  border-[#2A2A2A] text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <Instagram size={16} /> Instagram
                        </label>
                        <input
                          type="url"
                          name="instagram"
                          defaultValue={user?.social?.instagram || ""}
                          className="w-full p-4 rounded-xl bg-[#0F0F0F]   focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all duration-300 border-2 border-[#2A2A2A] text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
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
                          <Spinner
                            variant="default"
                            className="text-white"
                            size={20}
                          />
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
            )}

            {/* Other tabs */}
            {/* Outer container */}

            {/* Settings Content */}
            <div className="w-full">
              {activeTab === "password" && <SettingchangePassword />}
            </div>

            {activeTab === "notifications" && (
              <div>Notifications settings content here</div>
            )}
            {activeTab === "privacy" && (
              <div>Privacy & Security content here</div>
            )}
            {activeTab === "appearance" && (
              <div>Appearance settings content here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
