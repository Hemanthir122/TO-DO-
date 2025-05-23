import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const generateSummary = async () => {
  try {
    console.log("Calling summarize endpoint...")
    const response = await axios.post(`${API_URL}/summarize`)
    console.log("Summarize response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error generating summary:", error.response?.data || error.message)
    throw error
  }
}
