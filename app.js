const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const indexRouter = require("./routes/index"); // Make sure the file path is correct
const todoRouter = require("./routes/todolist"); // Ensure this file exists

// Import the database connection
const db = require("./db"); // Assuming you have a db.js file for MySQL connection

// Create the express app
const app = express();

// Set up middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (if any)
app.use(express.static(path.join(__dirname, "public")));

// Use the index router for the root route ("/")
app.use("/", indexRouter);

// Use the todo router for todo-related routes
app.use("/todos", todoRouter); // Ensure todoRouter is a valid Express router

// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
