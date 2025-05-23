"use client"

import { useState, useEffect } from "react"
import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"
import SummarySection from "./components/SummarySection"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { fetchTodos } from "./services/todoService"
import toast from "react-hot-toast"

function App() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState("")
  const [summaryStatus, setSummaryStatus] = useState(null)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTodos()
      setTodos(data)
    } catch (error) {
      toast.error("Failed to load todos")
      console.error("Error loading todos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TodoForm onTodoAdded={loadTodos} />

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Your Todos</h2>
              <TodoList todos={todos} isLoading={isLoading} onTodoUpdated={loadTodos} onTodoDeleted={loadTodos} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <SummarySection
              todos={todos}
              summary={summary}
              setSummary={setSummary}
              status={summaryStatus}
              setStatus={setSummaryStatus}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
