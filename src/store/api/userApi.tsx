import axios from "axios"

/**
 * Fetches the current authenticated user
 * @returns Promise that resolves to the API response
 */
export async function getMe() {
  return await axios.get("http://localhost:9000/api/v0/get-me", {
    withCredentials: true,
  })
}
