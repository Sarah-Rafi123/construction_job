import axios from "axios"

/**
 * Uploads multiple files to the server
 * @param files Array of File objects to upload
 * @returns Promise that resolves to an array of uploaded file URLs
 */
export async function uploadMultipleFiles(files: File[]) {
  const formData = new FormData()

  // Append each file to the FormData object
  files.forEach((file) => {
    formData.append("files", file)
  })

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}upload/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Important for sending cookies with the request
    })

    console.log("File upload response:", response.data)
    return response.data.files // array of S3 URLs
  } catch (error) {
    console.error("File upload failed:", error)
    throw error
  }
}

/**
 * Uploads a single file to the server
 * @param file File object to upload
 * @returns Promise that resolves to the uploaded file URL
 */
export async function uploadSingleFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}upload/single`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })

    console.log("Single file upload response:", response.data)
    return response.data.file // S3 URL of the uploaded file
  } catch (error) {
    console.error("Single file upload failed:", error)
    throw error
  }
}
