import api from "./api";

// REGISTER
export const registerUser = async (data) => {
  const formData = new FormData();

  for (let key in data) {
    if (key === "avatar" && data[key]) {
      // single file support
      formData.append(key, data[key]); 
    } else {
      formData.append(key, data[key]);
    }
  }

  try {
    const { data: response } = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },

    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};


// LOGIN
export const loginUser = async (formData) => {
  try {
    const { data } = await api.post("/users/login", formData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// LOGOUT
export const logout = async () => {
  try {
    const { data } = await api.post("/users/logout");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// CURRENT USER
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/current-user");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// RESET PASSWORD
export const sendResetPasswordOTP = async (email) => {
  try {
    const { data } = await api.post("/users/reset-password-otp", { email });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// RESET PASSWORD CONFIRM
export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    const { data } = await api.post("/users/reset-password", {
      email,
      otp,
      newPassword,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// VERIFY OTP
export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await api.post("/users/verify-otp", { email, otp });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// CHANGE PASSWORD
export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const { data } = await api.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// UPDATE PROFILE
export const updateProfile = async ({ fullname, email, bio, social }) => {
  try {
    const { data } = await api.patch("/users/update-account-details", {
      fullname,
      email,
      bio,
      social,
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// UPDATE AVATAR
export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.patch("/users/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    throw error.response?.data || "Something went wrong";
  }
};

// UPDATE COVER
export const updateCover = async (file) => {
  try {
    const formData = new FormData();
    formData.append("coverImage", file);

    const { data } = await api.patch("/users/update-cover", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    throw error.response?.data || "Something went wrong";
  }
};
