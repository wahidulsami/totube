import React from "react";

const ButtonSkeleton = ({ width = "80px", hasIcon = true }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
    {hasIcon && (
      <div className="w-5 h-5 bg-gradient-to-r from-gray-700 via-gray-600 
                      to-gray-700 bg-[length:200%_100%] 
                      animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    )}
    <div
      className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 
                 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded"
      style={{ width, height: "16px" }}
    />
  </div>
);

export default ButtonSkeleton;
