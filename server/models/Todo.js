import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

// Update the updated_at field before saving
todoSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: new Date() })
  next()
})

const Todo = mongoose.model("Todo", todoSchema)

export default Todo
