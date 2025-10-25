import api from "./api";



export const registerUser = async (data) => {
  const formData = new FormData();
  for (let key in data) {
    if (key === "avatar" && data[key]?.[0]) {
      formData.append(key, data[key][0]);
    } else {
      formData.append(key, data[key]);
    }
  }
  try {
    const { data } = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const loginUser = async (formData) => {
  try {
    const { data } = await api.post("/users/login", formData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const logout = async () => {
  try {
    const { data } = await api.post("/users/logout");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/users/current-user");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const sendResetPasswordOTP = async (email) => {
  try {
    const { data } = await api.post("/users/reset-password-otp", { email });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

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

export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await api.post("/users/verify-otp", { email, otp });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

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


export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();

    formData.append("avatar", file);

    const { data } = await api.patch("/users/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return data;
  } catch (error) {
    throw error.response?.data || "Something went  wrong";
  }
};

export const updateCover = async (file) => {
  try {
    const formData = new FormData();

    formData.append("coverImage", file);

    const { data } = await api.patch("/users/update-cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return data;
  } catch (error) {
    throw error.response?.data || "Something went  wrong";
  }
};
