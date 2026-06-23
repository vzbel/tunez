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
