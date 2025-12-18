import api from "../api/axios";

export const registerUser = async (userData) => {

  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  // store token and fetch current user
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
    try {
      const me = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(me.data));
    } catch (e) {
      // ignore
    }
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
