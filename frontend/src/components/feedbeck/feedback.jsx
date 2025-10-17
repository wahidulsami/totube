import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const FeedbackForm = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-[radial-gradient(ellipse_at_center,_#1a1a1a_0%,_#0F0F0F_70%)]">
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg border border-white/10 bg-[#1c1c1c] hover:bg-white/10 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Feedback Form Container */}
      <div className="flex items-center justify-center">
        <div
          className="w-full max-w-3xl border rounded-2xl border-[#1B1B1B] p-6 
          bg-[linear-gradient(145deg,_#1B1B1B_0%,_#171717_100%)]
          shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <h2 className="text-center text-white text-xl font-semibold mb-4 border-b-2 border-red-600 inline-block pb-1">
            Feedback & Bug Report
          </h2>

          <div className="relative w-full h-[70vh] md:h-[75vh]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScbDTRempXiWeju-Pe85rOYp97eYs66xCWM7MJd1wJTEi3nSg/viewform?embedded=true"
              title="Feedback Form"
              className="absolute inset-0 w-full h-full rounded-lg border border-[#333] bg-[#202020]"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Thanks for helping us improve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
