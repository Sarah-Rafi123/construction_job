import axios from "axios";

// Define the base API URL
const API_URL = "http://localhost:9000/api/v0";

// Function to handle login request
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return response.data; // Return the response data from the API
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
