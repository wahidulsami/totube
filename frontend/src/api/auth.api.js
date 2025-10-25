import api from "./api";

// Register user (supports optional avatar and coverImage)
export const registerUser = async (data) => {
  const formData = new FormData();
  for (let key in data) {
    if ((key === "avatar" || key === "coverImage") && data[key]?.[0]) {
      formData.append(key, data[key][0]);
    } else {
      formData.append(key, data[key]);
    }
  }

  try {
    const { data: response } = await api.post("/users/register", formData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Login user
export const loginUser = async (formData) => {
  try {
    const { data } = await api.post("/users/login", formData, { withCredentials: true });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Logout user
export const logout = async () => {
  try {
    const { data } = await api.post("/users/logout", null, { withCredentials: true });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/current-user", { withCredentials: true });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Send OTP for password reset
export const sendResetPasswordOTP = async (email) => {
  try {
    const { data } = await api.post("/users/reset-password-otp", { email });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Reset password
export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const { data } = await api.post("/users/reset-password", { email, otp, newPassword });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await api.post("/users/verify-otp", { email, otp });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Change password (requires login)
export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const { data } = await api.post(
      "/users/change-password",
      { oldPassword, newPassword },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Update account details (requires login)
export const updateProfile = async ({ fullname, email, bio, social }) => {
  try {
    const { data } = await api.patch(
      "/users/update-account-details",
      { fullname, email, bio, social },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Update avatar (requires login)
export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.patch("/users/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};

// Update cover image (requires login)
export const updateCover = async (file) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", file);

    const { data } = await api.patch("/users/update-cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Something went wrong" };
  }
};
