import React from "react";
import ButtonSkeleton from "./ButtonSkeleton";

const ActionButtonsSkeleton = () => (
  <div className="flex items-center gap-2 flex-wrap">
    <ButtonSkeleton width="60px" hasIcon={true} />

    <div className="p-2 bg-white/5 rounded-full">
      <div className="w-5 h-5 bg-gradient-to-r from-gray-700 via-gray-600 
                      to-gray-700 bg-[length:200%_100%] 
                      animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    </div>

    <ButtonSkeleton width="50px" hasIcon={true} />
    <ButtonSkeleton width="70px" hasIcon={true} />

    <div className="p-2 bg-white/5 rounded-full">
      <div className="w-5 h-5 bg-gradient-to-r from-gray-700 via-gray-600 
                      to-gray-700 bg-[length:200%_100%] 
                      animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    </div>
  </div>
);

export default ActionButtonsSkeleton;
