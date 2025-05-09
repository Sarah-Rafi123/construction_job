import axios from "axios"

/**
 * Fetches the current authenticated user
 * @returns Promise that resolves to the API response
 */
export async function getMe() {
  return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}get-me`, {
    withCredentials: true,
  })
}
