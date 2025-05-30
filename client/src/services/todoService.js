import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`)
    return response.data
  } catch (error) {
    console.error("Error fetching todos:", error)
    throw error
  }
}

export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, todoData)
    return response.data
  } catch (error) {
    console.error("Error creating todo:", error)
    throw error
  }
}

export const updateTodo = async (id, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, todoData)
    return response.data
  } catch (error) {
    console.error("Error updating todo:", error.response?.data || error.message)
    throw error
  }
}

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/todos/${id}`)
    return response.data
  } catch (error) {
    console.error("Error deleting todo:", error.response?.data || error.message)
    throw error
  }
}
