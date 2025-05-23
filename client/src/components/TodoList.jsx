"use client"

import { useState } from "react"
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSave } from "react-icons/fa"
import { updateTodo, deleteTodo } from "../services/todoService"
import toast from "react-hot-toast"

function TodoList({ todos, isLoading, onTodoUpdated, onTodoDeleted }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const startEditing = (todo) => {
    setEditingId(todo._id)
    setEditTitle(todo.title)
    setEditDescription(todo.description || "")
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
  }

  const handleUpdateTodo = async (id) => {
    if (!editTitle.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      setIsProcessing(true)
      await updateTodo(id, {
        title: editTitle,
        description: editDescription,
        completed: todos.find((todo) => todo._id === id).completed,
      })
      toast.success("Todo updated successfully")
      setEditingId(null)
      onTodoUpdated()
    } catch (error) {
      toast.error("Failed to update todo")
      console.error("Error updating todo:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleComplete = async (todo) => {
    try {
      setIsProcessing(true)
      await updateTodo(todo._id, {
        ...todo,
        completed: !todo.completed,
      })
      toast.success(`Todo marked as ${!todo.completed ? "completed" : "incomplete"}`)
      onTodoUpdated()
    } catch (error) {
      toast.error("Failed to update todo status")
      console.error("Error updating todo status:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteTodo = async (id) => {
    if (!confirm("Are you sure you want to delete this todo?")) {
      return
    }

    try {
      setIsProcessing(true)
      console.log("Deleting todo with ID:", id)
      await deleteTodo(id)
      toast.success("Todo deleted successfully")
      onTodoDeleted()
    } catch (error) {
      toast.error(`Failed to delete todo: ${error.response?.data?.error || error.message}`)
      console.error("Error deleting todo:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loader border-primary-600 border-b-transparent"></span>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading todos...</span>
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No todos yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {todos.map((todo) => (
          <li key={todo._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            {editingId === todo._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Todo title"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Description (optional)"
                  rows="2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelEditing}
                    disabled={isProcessing}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    <FaTimes className="mr-1 inline-block" /> Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTodo(todo._id)}
                    disabled={isProcessing}
                    className="px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="loader border-white border-b-transparent"></span>
                    ) : (
                      <>
                        <FaSave className="mr-1 inline-block" /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    disabled={isProcessing}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-400 dark:border-gray-500"
                    } flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50`}
                    aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed && <FaCheck className="w-3 h-3" />}
                  </button>
                  <div>
                    <h3
                      className={`text-lg font-medium ${
                        todo.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p
                        className={`mt-1 text-sm ${
                          todo.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {new Date(todo.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(todo)}
                    disabled={isProcessing}
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 focus:outline-none disabled:opacity-50"
                    aria-label="Edit todo"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    disabled={isProcessing}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 focus:outline-none disabled:opacity-50"
                    aria-label="Delete todo"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
