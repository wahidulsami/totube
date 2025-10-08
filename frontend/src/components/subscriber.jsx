import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  toggleSubscribe,
  checkSubscriptionStatusThunk,
  toggleLocalSubscribed,
} from "@/store/subscribeReducer";
import { Bell, Loader2, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";

function SubscribeButton({ channelId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscribed, loading } = useSelector((state) => state.subscribe);
  const { user } = useSelector((state) => state.auth);
  const [guestPopup, setGuestPopup] = useState(false);

  useEffect(() => {

    try {
          if (channelId && user) {
      dispatch(checkSubscriptionStatusThunk(channelId));
    }
    } catch (error) {
        console.error("Error checking subscription status:", error);
    }

  }, [channelId, user, dispatch]);


const handleClick = useCallback(async () => {
  if (loading || !channelId) return;
  if (!user) {
    setGuestPopup(true);
    return;
  }

  try {
    dispatch(toggleLocalSubscribed()); 

    const result = await dispatch(toggleSubscribe(channelId));

    if (toggleSubscribe.rejected.match(result)) {
      dispatch(toggleLocalSubscribed()); 
      const errorMessage = result.payload || "Subscription failed";
      toast.info(errorMessage); 
    }
  } catch (error) {
    dispatch(toggleLocalSubscribed());
    toast.error("Something went wrong", );
  }
}, [loading, channelId, user, dispatch]);


  return (
    <>
      <motion.button
        onClick={handleClick}
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className={`
          relative px-5 py-2.5 rounded-full font-semibold text-sm
          flex items-center gap-2 overflow-hidden
          transition-all duration-300 ease-out
          disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
          ${
            subscribed
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
          }
        `}
      >
        {/* Ripple animation background */}
        <span
          className={`
            absolute inset-0 rounded-full
            transition-all duration-700 ease-out
            ${subscribed ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <span className="relative flex items-center gap-2 z-10">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={subscribed ? "subscribed" : "subscribe"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={subscribed ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Bell className="h-4 w-4" />
                </motion.div>
                <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
              </motion.div>
            </AnimatePresence>
          )}
        </span>
      </motion.button>

      {/* Guest Popup */}
      <AnimatePresence>
        {guestPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs"
            onClick={() => setGuestPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0F0F0F] border border-[#303030] rounded-2xl shadow-2xl 
                   max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#272727] p-6 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Want to subscribe to this channel?
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-300 text-center leading-relaxed">
                  Sign in to subscribe to this channel and interact with your favorite creators.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setGuestPopup(false);
                      navigate("/login");
                    }}
                    className="w-full py-3 px-4 cursor-pointer bg-red-600 hover:bg-red-700
                         text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => setGuestPopup(false)}
                    className="w-full py-3 px-4 bg-[#3A3A3A] hover:bg-[#505050] 
                         text-white font-medium rounded-lg transition-all duration-200  cursor-pointer "
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 pt-2">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setGuestPopup(false);
                      navigate("/register");
                    }}
                    className="text-red-600 hover:text-red-500 font-medium underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SubscribeButton;