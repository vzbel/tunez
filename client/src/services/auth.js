import axios from "axios";

const BASE_URL = "/api/auth";

export const createAccount = async (email, username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/password`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// retrieve the currently logged in user or null if none
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/me`);
    return response.data.user;
  } catch {
    return null;
  }
};

// log the current user out
export const logout = async () => {
  try {
    await axios.post(`${BASE_URL}/logout`);
  } catch (error) {
    console.error(error);
  }
};
