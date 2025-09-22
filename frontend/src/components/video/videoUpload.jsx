
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { publishAVideosByUser } from "@/store/videoReducer";
import { toast } from "react-toastify";
import { Spinner } from "../ui/shadcn-io/spinner";
import { FileUp, Upload, Play, Image , UploadIcon } from "lucide-react";

const VideoUpload = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const { error } = useSelector((state) => state.videos);



  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  setLoading(true);

  try {
    // Redux thunk dispatch
    const action = await dispatch(publishAVideosByUser(data)).unwrap();

    // .unwrap() automatically throws if rejected
    // so we can assume success here
    toast.success(action.message || "Video uploaded successfully");

    setVideoPreview(null);
    setCoverPreview(null);

  } catch (error) {
    // error.message will come from rejectWithValue
    toast.error(error || "Upload failed");
  } finally {
    setLoading(false);
  }
};



  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingVideo(true);
  const maxSize = 2 * 1024 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("Video size must not exceed 2GB!");
    setLoadingVideo(false);
    return;
  }
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);


    setTimeout(() => setLoadingVideo(false), 1000);
  };

const handleThumnailImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setLoadingCover(true);

  const img = new window.Image();
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;

  img.onload = () => {
    const { width, height } = img;

    // Minimum size check
    if (width < 1280 || height < 720) {
      toast.error("Thumbnail must be at least 1280x720 pixels!");
      setLoadingCover(false);
      URL.revokeObjectURL(objectUrl);
      return;
    }

    // Aspect ratio check
    const aspectRatio = width / height;
    const targetRatio = 16 / 9;

    if (Math.abs(aspectRatio - targetRatio) > 0.01) {
      toast.error("Thumbnail must have a 16:9 aspect ratio (e.g., 1280x720, 1920x1080, 2560x1440).");
      setLoadingCover(false);
      URL.revokeObjectURL(objectUrl);
      return;
    }

    // Best size recommendation
    if (width !== 2560 || height !== 1440) {
      toast.info("Best size is 2560x1440 (YouTube recommended).");
    }

    // Set preview
    setCoverPreview(objectUrl);
    setLoadingCover(false);
  };
};


  return (
 


      <div className="relative z-10 max-w-7xl mx-auto mt-20 ">
        {/* Header */}

         
            <div className="mb-4 sm:mb-8 lg:mb-10 mt-10">
        <div
          className="bg-gradient-to-r from-[#0F0F0F] to-[#1E1E1E] 
                  rounded-2xl shadow-2xl border border-[#2A2A2A] 
                  p-4 sm:p-5 lg:p-5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            <div className="p-2 sm:p-3 lg:p-3 bg-red-600/20 rounded-xl">
              <FileUp  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-white mb-1 sm:mb-1.5">
                Create & Upload
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-base text-gray-400">
                 Share your story with the world 
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Main Upload Card */}
        <div className="bg-[#0F0F0F]
          backdrop-blur-xl rounded-3xl border
           border-gray-700/50 mt-6 shadow-2xl overflow-hidden">
          
          {/* Form Header */}
          <div className="px-8 py-6 border-b border-gray-700/50
           bg-[#171717]">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Upload New Video
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-8 lg:p-12">

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Left Panel - Text Inputs */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3
                   group-focus-within:text-red-400 transition-colors">
                    Video Title *
                  </label>
                  <div className="relative">
              <input
                  type="text"
                  placeholder="Video Title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full bg-[#171717] h-15 text-white border border-gray-700/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r
                    
                     transition-opacity pointer-events-none"></div>
                  </div>
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2 animate-pulse">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3
                   group-focus-within:text-red-400 transition-colors">
                    Description *
                  </label>
                  <div className="relative">
               <textarea
  placeholder="Description"
  {...register("description", {
    required: "Description is required",
  })}
  className="w-full bg-[#171717] text-white border border-gray-700/50 
             rounded-lg p-3 h-40 md:h-40 lg:h-84
             focus:outline-none focus:ring-2 focus:ring-red-600 resize-y"
/>


                    <div className="absolute inset-0 rounded-xl opacity-0  transition-opacity pointer-events-none"></div>
                  </div>
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-2 animate-pulse">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Panel - File Uploads */}
              <div className="space-y-6">
                
                

    {/* Video Upload */}

        <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Video File *
                  </label>
                  
                  <div className="relative" 
                  >
                    <input
                    
                      type="file"
                      {...register("video", { required: "Video is required" })}
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    
                    />
              <div className="group">
  <div className="border-2 border-dashed border-gray-400 group-hover:border-red-500
                  rounded-xl p-4 text-center bg-gray-800/30 transition-all duration-300 group-hover:scale-[1.02]">
    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-red-500 transition-colors" />
    <p className="text-gray-400 text-sm">
      <span className="font-semibold text-red-500">Click to upload</span>
    </p>
    <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI up to 2GB</p>
  </div>
</div>
</div>


                  {/* Video Preview */}
                  <div className="mt-4 aspect-video w-full bg-gradient-to-br
                   from-[#171717] to-[#0F0F0F] rounded-xl overflow-hidden border border-gray-700/50 shadow-inner">
                    {loadingVideo ? (
                      <div className="flex flex-col justify-center items-center h-full">
                        <Spinner variant="default" className="text-red-500 mb-3" size={32} />
                        <span className="text-gray-400 text-sm">Processing video...</span>
                      </div>
                    ) : videoPreview ? (
                      <video
                        controls
                        src={videoPreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full text-gray-500 group-hover:text-gray-400 transition-colors">
                        <Play className="w-16 h-16 mb-3 opacity-50" />
                        <span className="text-sm font-medium">Video preview will appear here</span>
                      </div>
                    )}
                  </div>

                  {errors.video && (
                    <p className="text-red-400 text-sm mt-2 animate-pulse">Video is required</p>
                  )}
                </div>

                {/* Thumbnail Upload */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Thumbnail *
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      {...register("thumbnail", { required: "Thumbnail is required" })}
                      onChange={handleThumnailImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
               <div className="group">
  <div className="border-2 border-dashed border-gray-400
       group-hover:border-red-500 rounded-xl p-4 text-center
       bg-gray-800/30 group-hover:bg-gray-800/50 transition-all duration-300 group-hover:scale-[1.02]">

    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2
         group-hover:text-red-500 transition-colors" />

    <p className="text-gray-400 text-sm">
      <span className="font-semibold text-red-500">Choose thumbnail</span>
    </p>
    <p className="text-xs text-gray-500 mt-1">JPG, PNG - 2560x1440 recommended</p>
  </div>
</div>

                  </div>

                  {/* Thumbnail Preview */}
                  <div className="mt-4 aspect-video w-full bg-gradient-to-br
                   from-[#171717] to-[#0F0F0F] rounded-xl overflow-hidden border border-gray-700/50 shadow-inner">
                    {loadingCover ? (
                      <div className="flex flex-col justify-center items-center h-full">
                        <Spinner variant="default" 
                        className="text-red-500 mb-3" size={32} />
                        <span className="text-gray-400 text-sm">Processing image...</span>
                      </div>
                    ) : coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full text-gray-500 group-hover:text-gray-400 transition-colors">
                        <Image className="w-16 h-16 mb-3 opacity-50" />
                        <span className="text-sm font-medium">Thumbnail preview will appear here</span>
                      </div>
                    )}
                  </div>

                  {errors.thumbnail && (
                    <p className="text-red-400 text-sm mt-2 animate-pulse">Thumbnail is required</p>
                  )}
                </div>
              

              </div>
            </div>

            {/* Submit Button */}
          <div className="mt-10 flex justify-center pt-6 border-t border-gray-700/50">
            <button
              disabled={isLoading}
              type="submit"
               className="flex w-full sm:w-auto max-w-sm md:max-w-md items-center justify-center gap-2
               rounded-2xl bg-gradient-to-r from-red-600 to-red-700
               text-white py-2.5 sm:py-3 px-4 sm:px-5 text-sm sm:text-base md:text-base font-semibold
               hover:from-red-700 hover:to-red-800 focus:ring-4
               focus:ring-red-600/20 transition-all duration-300
               disabled:opacity-50 disabled:cursor-not-allowed
               shadow-2xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner variant="default" className="text-white" size={20} />
                  <span>Publishing Video...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadIcon size={20} />
                  <span>Publish Video</span>
                </span>
              )}
            </button>
          </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mx-8 mb-8 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm font-medium">{error.message || error}</p>
            </div>
          )}
        </div>
      </div>

  );
};

export default VideoUpload;



