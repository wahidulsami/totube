// import { useState } from "react";
// import { Loader2 } from "lucide-react"; // spinner icon

// const LoadingButton = ({ children }) => {
//   const [loading, setLoading] = useState(false);

//   const handleClick = () => {
//     setLoading(true);

//     // simulate async action (e.g., API call)
//     setTimeout(() => {
//       setLoading(false);
//     }, 1500); // 1.5s loading
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleClick}
//       className="flex bg-red-500 items-center justify-center gap-2 text-white hover:underline font-medium"
//       disabled={loading}
//     >
//       {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//       {children}
//     </button>
//   );
// };

// export default LoadingButton;
