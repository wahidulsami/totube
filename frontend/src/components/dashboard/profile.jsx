import React, { useState } from "react";
import { updateAvatar, updateCover, updateProfile } from "@/api/auth.api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Spinner } from "../ui/shadcn-io/spinner";
import { Camera , UserCircle } from "lucide-react";



const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultCover =
    "https://static.vecteezy.com/system/resources/thumbnails/011/565/075/small/abstract-golden-circles-glow-lights-bokeh-effect-blurred-white-and-grey-background-luxury-style-christmas-winter-festive-backdrop-vector.jpg";
  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  const { user } = useSelector((state) => state.auth);

  // Avatar select
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  // Cover select
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setCoverFile(file);
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
// Update Profile Info
const handleProfileDetails = async (e) => {
  e.preventDefault();

  const fullname = e.target.fullname.value;
  const email = e.target.email.value;
  const bio = e.target.bio.value;

  // সব সোশ্যাল ইনপুট সংগ্রহ করো
  let social = {
    facebook: e.target.facebook.value.trim(),
    twitter: e.target.twitter.value.trim(),
    linkedin: e.target.linkedin.value.trim(),
    github: e.target.github.value.trim(),
  };

  // ফাঁকা link মুছে দাও, যাতে backend পুরোনোটা safe রাখে
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
console.log(handleProfileDetails)

  return (
    <>
    <div className="mt-10">
  <div className="bg-[#0F0F0F] rounded-2xl shadow-lg p-6 flex items-center gap-3">
    <UserCircle className="w-8 h-8 text-red-600" />
    <div>
      <h1 className="text-2xl font-bold text-white">My Profile</h1>
      <p className="text-gray-400 text-sm">
        Manage your personal information and settings
      </p>
    </div>
  </div>
</div>
    
    <div className="min-h-300 rounded-2xl w-full bg-[#0F0F0F] text-[#EAEAEA] mt-10">
      {/* Cover Section */}
      <div className="relative w-full h-56 bg-[#0F0F0F] rounded-t-2xl ">
        <img
          src={coverPreview || user?.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full object-cover rounded-2xl"
        />

        {/* Cover Actions */}
        {user && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-2">
            <label className="px-6 py-2 bg-gray-900/50 backdrop-blur-sm rounded-3xl
             text-white text-sm font-medium cursor-pointer  hover:bg-red-600 transition">
              Choose Cover
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
                  className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingCover ? (
                    <>
                      <Spinner variant="default" className="text-white" size={18} />
      
                    </>
                  ) : (
                    "Update Cover"
                  )}
                </button>
            )}
          </div>
        )}

     


{/* Avatar Section */}
<div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2">
  <div className="relative group">
    {/* Avatar */}
    <img
      src={avatarPreview || user?.avatar || defaultAvatar}
      alt="avatar"
      className="w-32 h-32 rounded-full border-4 border-gray-950 object-cover shadow-lg bg-gray-900"
    />


    {user && (
      <label className="absolute bottom-2 right-2 bg-gray-900/50
       backdrop-blur-sm p-2 rounded-full cursor-pointer shadow-md
        hover:bg-red-600 transition">
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
    <button
      onClick={handleAvatarUpload}
      disabled={loadingAvatar}
      className="mt-3 px-4 py-2 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
    >
      {loadingAvatar ? (
        <>
               <Spinner variant="default" className="text-white" size={18} />
        <span>Update Avatar</span>
        </>
 
      ) : (
        "Update Avatar"
      )}
    </button>
  )}
</div>

      </div>

     
     
        <div className="mt-25 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-12
         lg:px-20 w-full max-w-4xl mx-auto flex flex-col lg:flex-row justify-center items-stretch gap-8">
     
        <div className="flex-1 bg-[#1E1E1E] border border-[#2A2A2A] mt-10
          rounded-2xl shadow-lg p-5">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleProfileDetails} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                defaultValue={user?.fullname || ""}
                className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email || ""}
                className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
    <label className="block text-sm mb-1">Bio</label>
    <textarea
      name="bio"
      defaultValue={user?.bio || ""}
      rows={3}
      className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none resize-none"
      placeholder="Write something about yourself..."
    />
  </div>
    <div>
    <label className="block text-sm mb-1">Facebook</label>
    <input
      type="url"
      name="facebook"
      defaultValue={user?.social?.facebook || ""}
      className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
      placeholder="https://facebook.com/username"
    />
  </div>
  <div>
    <label className="block text-sm mb-1">Twitter / X</label>
    <input
      type="url"
      name="twitter"
      defaultValue={user?.social?.twitter || ""}
      className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
      placeholder="https://twitter.com/username"
    />
  </div>
  <div>
    <label className="block text-sm mb-1">LinkedIn</label>
    <input
      type="url"
      name="linkedin"
      defaultValue={user?.social?.linkedin || ""}
      className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
      placeholder="https://linkedin.com/in/username"
    />
  </div>
  <div>
    <label className="block text-sm mb-1">GitHub</label>
    <input
      type="url"
      name="github"
      defaultValue={user?.social?.github || ""}
      className="w-full p-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] focus:ring-2 focus:ring-[#f50b0b] outline-none"
      placeholder="https://github.com/username"
    />
  </div> 
          {/* Submit Button */}
  <button
    disabled={loading}
    type="submit"
    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 text-white py-3 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
  >
    {loading ? (
      <Spinner variant="default" className="text-white" size={20} />
    ) : (
      "Save Changes"
    )}
  </button>
          </form>
        </div>

   
      </div>
  




    </div>
     </>
  );
};

export default Profile;



// import React, { useState } from "react";
// import { updateAvatar, updateCover, updateProfile } from "@/api/auth.api";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { Spinner } from "../ui/shadcn-io/spinner";
// const Profile = () => {
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [coverFile, setCoverFile] = useState(null);
//   const [loadingAvatar, setLoadingAvatar] = useState(false);
//   const [loadingCover, setLoadingCover] = useState(false);
//   const defaultCover = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcoffective.com%2Fdefault-featured-image-png%2F&psig=AOvVaw3CQiDpn78V4tmhTBt9TpL5&ust=1757068589454000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMDOsaT1vo8DFQAAAAAdAAAAABAv";
//   const defaultAvatar = "https://via.placeholder.com/150?text=Avatar";
//   const { user } = useSelector((state) => state.auth);

//   // Avatar select (only preview)
//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setAvatarPreview(URL.createObjectURL(file));
//     setAvatarFile(file);
//   };

//   // Cover select (only preview)
//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setCoverPreview(URL.createObjectURL(file));
//     setCoverFile(file);
//   };

//   // Upload Avatar
//   const handleAvatarUpload = async () => {
//     if (!avatarFile) return toast.error("Please select an avatar first!");
//     setLoadingAvatar(true);
//     try {
//       const res = await updateAvatar(avatarFile);
//       toast.success(res.message || "Avatar updated successfully");
//       setAvatarFile(null); // reset file
//     } catch (error) {
//       toast.error(error.message || "Avatar update failed");
//     } finally {
//       setLoadingAvatar(false);
//     }
//   };

//   // Upload Cover
//   const handleCoverUpload = async () => {
//     if (!coverFile) return toast.error("Please select a cover image first!");
//     setLoadingCover(true);
//     try {
//       const res = await updateCover(coverFile);
//       toast.success(res.message || "Cover updated successfully");
//       setCoverFile(null); // reset file
//     } catch (error) {
//       toast.error(error.message || "Cover update failed");
//     } finally {
//       setLoadingCover(false);
//     }
//   };

//   // Profile Update
//   const handleProfileDetails = async (e) => {
//     e.preventDefault();
//     const fullname = e.target.fullname.value;
//     const email = e.target.email.value;

//     try {
//       const res = await updateProfile({ fullname, email });
//       toast.success(res.message || "Profile updated successfully");
//     } catch (error) {
//       toast.error(error.message || "Profile update failed");
//     }
//   };
//   return (
//     <div className="min-h-screen w-full bg-gray-950 text-white">
//       {/* Cover Section */}
//       <div className="relative w-full h-56 bg-gray-800">
//         <img
//        src={ defaultCover || coverPreview || user?.coverImage }

//           alt="cover"
//           className="w-full h-full object-cover"
//         />

//         {user && (
//           <div className="absolute top-3 right-3 flex gap-2">
//             {/* Select Cover */}
//             <label className="px-3 py-2 bg-amber-500 text-black rounded-lg font-medium cursor-pointer hover:bg-amber-400 transition">
//               Choose Cover
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleCoverImageChange}
//                 hidden
//               />
//             </label>

//             {/* Update Cover */}
//             <button
//               onClick={handleCoverUpload}
//               disabled={loadingCover}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition disabled:opacity-50 flex items-center gap-2"
//             >
//               {loadingCover && <Spinner className="w-4 h-4" />}
//               Update Cover
//             </button>
//           </div>
//         )}

//         {/* Avatar Section */}
//         <div className="absolute -bottom-16 left-10 flex flex-col items-center">
//           <img
//             src={
//                defaultAvatar ||
//               avatarPreview || user?.avatar
//             }
//             alt="avatar"
//             className="w-28 h-28 rounded-full border-4 border-gray-950 object-cover"
//           />

//           {user && (
//             <div className="mt-3 flex gap-2">
//               {/* Select Avatar */}
//               <label className="px-3 py-2 bg-amber-500 text-black rounded-lg font-medium cursor-pointer hover:bg-amber-400 transition">
//                 Choose Avatar
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleAvatarChange}
//                   hidden
//                 />
//               </label>

//               {/* Update Avatar */}

//               <button
//                 onClick={handleAvatarUpload}
//                 disabled={loadingAvatar}
//                 type="submit"
//                 className="w-full mt-5 cursor-pointer flex items-center justify-center gap-2 rounded-md bg-red-600
//                                   text-white py-2 px-4 font-medium hover:bg-red-700 transition disabled:opacity-50"
//               >
//                 {loadingAvatar ? (
//                   <Spinner variant="default" className="text-white" size={20} />
//                 ) : (
//                   "Update Avatar"
//                 )}
//               </button>
              
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="mt-20 px-6 md:px-20 flex flex-col md:flex-row gap-8">
//         {/* Left: Profile Form */}
//         <div className="flex-1 bg-gray-900 rounded-2xl shadow-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
//           <form onSubmit={handleProfileDetails} className="space-y-4">
//             <div>
//               <label className="block text-sm mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="fullname"
//                 defaultValue={user?.fullname || ""}
//                 className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
//                 placeholder="Enter your full name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 defaultValue={user?.email || ""}
//                 className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
//                 placeholder="Enter your email"
//               />
//             </div>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400 transition"
//             >
//               Save Changes
//             </button>
//           </form>
//         </div>

//         {/* Right: Settings */}
//         <div className="flex-1 bg-gray-900 rounded-2xl shadow-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
//           <p className="text-gray-400 mb-3">
//             এখানে তুমি password change বা অন্য settings রাখতে পারো।
//           </p>
//           <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-medium">
//             Change Password
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// import React, { useState } from 'react';
// import { Edit2, X, Plus, Linkedin, Facebook, Instagram, Link } from 'lucide-react';

// export default function Profile() {
//   const [formData, setFormData] = useState({
//     name: 'wahidul islam sami',
//     email: 'wahidulislamsami5@gmail.com',
//     bio: "👋 Hi, I'm Sami!\n\n👨‍💻 Full-Stack Developer | UI/UX Enthusiast | AI Explorer",
//     pronouns: 'he/him',
//     url: '',
//     company: '',
//     location: 'Bangladesh, chattogram',
//     socialAccounts: [
//       { platform: 'linkedin', url: 'https://www.linkedin.com/in/wahidul-islam-sami-80433041/' },
//       { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=100078323360091' },
//       { platform: 'instagram', url: 'https://www.instagram.com/_wahidul_/' },
//       { platform: 'custom', url: '', label: 'Link to social profile 4' }
//     ]
//   });

//   const [showLocalTime, setShowLocalTime] = useState(true);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSocialChange = (index, value) => {
//     const newSocials = [...formData.socialAccounts];
//     newSocials[index].url = value;
//     setFormData(prev => ({ ...prev, socialAccounts: newSocials }));
//   };

//   const getSocialIcon = (platform) => {
//     switch(platform) {
//       case 'linkedin': return <Linkedin className="w-4 h-4" />;
//       case 'facebook': return <Facebook className="w-4 h-4" />;
//       case 'instagram': return <Instagram className="w-4 h-4" />;
//       default: return <Link className="w-4 h-4" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
//           <h1 className="text-2xl font-semibold mb-8 text-white">Public profile</h1>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Left Column - Form Fields */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Name */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">
//                   Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time.
//                 </p>
//               </div>

//               {/* Public Email */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Public email</label>
//                 <div className="flex items-center gap-2">
//                   <div className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100">
//                     {formData.email}
//                   </div>
//                   <button className="px-3 py-2 text-gray-400 hover:text-gray-200">
//                     <X className="w-4 h-4" />
//                   </button>
//                   <button className="px-3 py-2 text-gray-400 hover:text-gray-200 text-sm">
//                     Remove
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">
//                   You can manage verified email addresses in your{' '}
//                   <a href="#" className="text-blue-400 hover:underline">email settings</a>.
//                 </p>
//               </div>

//               {/* Bio */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Bio</label>
//                 <textarea
//                   value={formData.bio}
//                   onChange={(e) => handleInputChange('bio', e.target.value)}
//                   rows={4}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">
//                   You can @mention other users and organizations to link to them.
//                 </p>
//               </div>

//               {/* Pronouns */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Pronouns</label>
//                 <input
//                   type="text"
//                   value={formData.pronouns}
//                   onChange={(e) => handleInputChange('pronouns', e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* URL */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">URL</label>
//                 <input
//                   type="url"
//                   value={formData.url}
//                   onChange={(e) => handleInputChange('url', e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Social Accounts */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Social accounts</label>
//                 <div className="space-y-3">
//                   {formData.socialAccounts.map((social, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <div className="p-2 bg-gray-700 rounded">
//                         {getSocialIcon(social.platform)}
//                       </div>
//                       <input
//                         type="url"
//                         value={social.url}
//                         onChange={(e) => handleSocialChange(index, e.target.value)}
//                         placeholder={social.label || `${social.platform} URL`}
//                         className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mt-2">
//                   <Plus className="w-4 h-4" />
//                   Link to social profile 4
//                 </button>
//               </div>

//               {/* Company */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Company</label>
//                 <input
//                   type="text"
//                   value={formData.company}
//                   onChange={(e) => handleInputChange('company', e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">
//                   You can @mention your company's GitHub organization to link it.
//                 </p>
//               </div>

//               {/* Location */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Location</label>
//                 <input
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => handleInputChange('location', e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <div className="flex items-center gap-2 mt-2">
//                   <input
//                     type="checkbox"
//                     id="localTime"
//                     checked={showLocalTime}
//                     onChange={(e) => setShowLocalTime(e.target.checked)}
//                     className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
//                   />
//                   <label htmlFor="localTime" className="text-sm text-gray-200">
//                     Display current local time
//                   </label>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Other users will see the time difference from their local time.
//                 </p>
//               </div>

//               {/* ORCID ID */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-200">ORCID iD</label>
//                 <p className="text-sm text-gray-400 mb-3">
//                   ORCID provides a persistent identifier - an ORCID iD - that distinguishes you from other researchers. Learn more at{' '}
//                   <a href="#" className="text-blue-400 hover:underline">ORCID.org</a>.
//                 </p>
//                 <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium">
//                   <div className="w-4 h-4 bg-white rounded-full"></div>
//                   Connect your ORCID iD
//                 </button>
//               </div>

//               {/* Footer Text */}
//               <div className="pt-4 border-t border-gray-700">
//                 <p className="text-xs text-gray-400">
//                   All of the fields on this page are optional and can be deleted at any time, and by filling them out, you're giving us
//                   consent to share this data wherever your user profile appears. Please see our{' '}
//                   <a href="#" className="text-blue-400 hover:underline">privacy statement</a> to learn more
//                   about how we use this information.
//                 </p>
//               </div>

//               {/* Update Button */}
//               <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium">
//                 Update profile
//               </button>
//             </div>

//             {/* Right Column - Profile Picture */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-6">
//                 <label className="block text-sm font-medium mb-2 text-gray-200">Profile picture</label>
//                 <div className="relative">
//                   <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-blue-400 p-1 mx-auto">
//                     <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                         S
//                       </div>
//                     </div>
//                   </div>
//                   <button className="absolute bottom-0 right-8 p-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full">
//                     <Edit2 className="w-3 h-3 text-gray-300" />
//                   </button>
//                 </div>
//                 <button className="w-full mt-3 px-3 py-1 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-md">
//                   Edit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
