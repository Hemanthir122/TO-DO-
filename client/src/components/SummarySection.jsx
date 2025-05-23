"use client"

import { useState } from "react"
import { generateSummary } from "../services/summaryService"
import { FaRobot, FaSlack, FaCheck, FaTimes, FaSpinner } from "react-icons/fa"
import toast from "react-hot-toast"

function SummarySection({ todos, summary, setSummary, status, setStatus }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const incompleteTodos = todos.filter((todo) => !todo.completed)

  const handleGenerateSummary = async () => {
    if (incompleteTodos.length === 0) {
      toast.error("No incomplete todos to summarize")
      return
    }

    try {
      setIsGenerating(true)
      setStatus(null)
      setSummary("")

      console.log("Generating summary...")
      const result = await generateSummary()
      console.log("Summary result:", result)

      if (result.success) {
        setSummary(result.summary)
        setStatus("success")
        toast.success("Summary generated and sent to Slack successfully")
      } else {
        setStatus("error")
        setSummary(result.summary || "") // Still show summary if available
        toast.error(`Failed to generate summary: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      setStatus("error")
      toast.error(`Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">Todo Summary</h2>
        <div className="flex items-center">
          <FaRobot className="text-primary-600 mr-1" />
          <span className="text-sm text-gray-600 dark:text-gray-400">AI Powered</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Generate an AI summary of your incomplete todos and send it to Slack.
        </p>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>
            Incomplete todos: <span className="font-medium">{incompleteTodos.length}</span>
          </p>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating || incompleteTodos.length === 0}
          className="w-full flex justify-center items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            <>
              <FaSlack className="mr-2" /> Generate & Send to Slack
            </>
          )}
        </button>
      </div>

      {status && (
        <div
          className={`mt-4 p-3 rounded-md ${
            status === "success" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
          }`}
        >
          <div className="flex items-center">
            {status === "success" ? (
              <FaCheck className="text-green-600 dark:text-green-400 mr-2" />
            ) : (
              <FaTimes className="text-red-600 dark:text-red-400 mr-2" />
            )}
            <p
              className={`text-sm ${
                status === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              {status === "success" ? "Summary sent to Slack successfully!" : "Failed to send summary to Slack."}
            </p>
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2 dark:text-white">Generated Summary:</h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">{summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummarySection
