function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>Todo Summary Assistant &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Built with React, Express, MongoDB, OpenAI, and Slack</p>
      </div>
    </footer>
  )
}

export default Footer
