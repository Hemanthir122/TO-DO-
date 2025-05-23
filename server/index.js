import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import OpenAI from "openai"
import fetch from "node-fetch"
import Todo from "./models/Todo.js"

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Routes
// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ created_at: -1 })
    res.status(200).json(todos)
  } catch (error) {
    console.error("Error fetching todos:", error)
    res.status(500).json({ error: error.message })
  }
})

// POST a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    const newTodo = new Todo({
      title,
      description,
      completed: false,
    })

    const savedTodo = await newTodo.save()
    res.status(201).json(savedTodo)
  } catch (error) {
    console.error("Error creating todo:", error)
    res.status(500).json({ error: error.message })
  }
})

// PUT update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, completed } = req.body

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID format" })
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed, updated_at: new Date() },
      { new: true },
    )

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }

    res.status(200).json(updatedTodo)
  } catch (error) {
    console.error("Error updating todo:", error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID format" })
    }

    const deletedTodo = await Todo.findByIdAndDelete(id)

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" })
    }

    res.status(200).json({ message: "Todo deleted successfully" })
  } catch (error) {
    console.error("Error deleting todo:", error)
    res.status(500).json({ error: error.message })
  }
})

// POST summarize todos and send to Slack
app.post("/summarize", async (req, res) => {
  try {
    console.log("Starting summarize process...")

    // Fetch all incomplete todos
    const todos = await Todo.find({ completed: false })
    console.log(`Found ${todos.length} incomplete todos`)

    if (todos.length === 0) {
      return res.status(400).json({ error: "No incomplete todos to summarize" })
    }

    // Format todos for the LLM
    const todoText = todos.map((todo) => `- ${todo.title}${todo.description ? `: ${todo.description}` : ""}`).join("\n")
    console.log("Formatted todos for OpenAI:", todoText)

    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return res.status(500).json({
        success: false,
        error: "OpenAI API key is not configured",
      })
    }

    console.log("Generating summary with OpenAI...")
    // Generate summary with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes todo lists in a concise, organized way. Identify patterns, priorities, and suggest a logical order of completion if possible.",
        },
        {
          role: "user",
          content: `Please summarize the following todo list:\n\n${todoText}`,
        },
      ],
    })

    const summary = completion.choices[0].message.content
    console.log("Generated summary:", summary)

    // Check if Slack webhook URL is set
    if (!process.env.SLACK_WEBHOOK_URL) {
      console.error("Slack webhook URL is missing")
      return res.status(500).json({
        success: false,
        error: "Slack webhook URL is not configured",
        summary, // Still return the summary even if Slack fails
      })
    }

    // Send to Slack
    console.log("Sending to Slack...")
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL

    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `*Todo Summary*\n\n${summary}`,
      }),
    })

    if (!slackResponse.ok) {
      console.error(`Slack API error: ${slackResponse.status} ${slackResponse.statusText}`)
      throw new Error(`Error sending to Slack: ${slackResponse.statusText}`)
    }

    console.log("Summary sent to Slack successfully")
    res.status(200).json({
      success: true,
      message: "Summary generated and sent to Slack successfully",
      summary,
    })
  } catch (error) {
    console.error("Error in summarize endpoint:", error)
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
