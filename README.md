# Todo Summary Assistant

A full-stack application that allows users to create and manage personal to-do items, generate summaries of pending todos using an LLM (OpenAI), and send the generated summary to a Slack channel.

## Features

- Create, edit, and delete todo items
- Mark todos as complete/incomplete
- Generate AI-powered summaries of pending todos
- Send summaries to a Slack channel
- Responsive design with dark mode support

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios for API requests
- React Icons
- React Hot Toast for notifications

### Backend
- Node.js
- Express
- MongoDB for database
- OpenAI API for LLM integration
- Slack Webhooks for Slack integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation
- OpenAI API key
- Slack Webhook URL

### Database Setup

1. Create a MongoDB Atlas cluster or use a local MongoDB installation
2. Get your MongoDB connection string

### Backend Setup

1. Navigate to the server directory:
   \`\`\`
   cd server
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the server directory with the following variables:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   PORT=5000
   \`\`\`

4. Start the server:
   \`\`\`
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to the client directory:
   \`\`\`
   cd client
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the client directory with the following variables:
   \`\`\`
   VITE_API_URL=http://localhost:5000
   \`\`\`

4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Slack Integration Setup

1. Go to [Slack API](https://api.slack.com/apps) and create a new app
2. Enable Incoming Webhooks for your app
3. Create a new webhook URL for a specific channel
4. Copy the webhook URL and add it to your server's `.env` file as `SLACK_WEBHOOK_URL`

## OpenAI Integration Setup

1. Sign up for an OpenAI account at [OpenAI](https://platform.openai.com/)
2. Generate an API key in your account settings
3. Copy the API key and add it to your server's `.env` file as `OPENAI_API_KEY`

## MongoDB Setup

1. Create a MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read and write permissions
4. Get your connection string and replace `<username>`, `<password>`, and `<dbname>` with your actual values
5. Add the connection string to your server's `.env` file as `MONGODB_URI`

## Architecture Decisions

- **Separate Frontend and Backend**: Keeps concerns separated and allows for independent scaling
- **RESTful API**: Simple, standard approach for CRUD operations
- **MongoDB**: Flexible, document-based database that works well with JavaScript/Node.js
- **OpenAI Integration**: Uses the GPT-3.5 Turbo model for generating meaningful summaries
- **Slack Webhooks**: Simple way to post messages to Slack without complex authentication

## Deployment

### Backend
- Deploy the Node.js server to a service like Heroku, Render, or Railway
- Set the environment variables in your deployment platform

### Frontend
- Build the React app: `npm run build`
- Deploy the build folder to Netlify, Vercel, or similar
- Set the `VITE_API_URL` to point to your deployed backend

## License

MIT
