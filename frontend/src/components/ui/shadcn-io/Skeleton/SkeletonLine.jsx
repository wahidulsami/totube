import React from "react";

const SkeletonLine = ({ width = "100%", height = "16px", className = "" }) => (
  <div
    className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 
                bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] 
                rounded ${className}`}
    style={{
      width,
      height,
      backgroundImage:
        "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)",
    }}
  />
);

export default SkeletonLine;
