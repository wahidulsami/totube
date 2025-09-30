import React from "react";
import SkeletonLine from "./SkeletonLine";

const RelatedVideoSkeleton = () => (
  <div className="flex gap-3 p-2">
    {/* Thumbnail skeleton */}
    <div className="w-40 h-24 bg-gradient-to-r from-gray-700 via-gray-600 
                    to-gray-700 bg-[length:200%_100%] 
                    animate-[shimmer_1.5s_ease-in-out_infinite] 
                    rounded-lg flex-shrink-0" />

    {/* Content skeleton */}
    <div className="flex-1 space-y-2 min-w-0">
      <div className="space-y-1">
        <SkeletonLine width="95%" height="14px" />
        <SkeletonLine width="80%" height="14px" />
      </div>
      <SkeletonLine width="60%" height="12px" />
      <div className="flex items-center gap-2">
        <SkeletonLine width="40px" height="12px" />
        <div className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0" />
        <SkeletonLine width="60px" height="12px" />
      </div>
    </div>
  </div>
);

export default RelatedVideoSkeleton;
