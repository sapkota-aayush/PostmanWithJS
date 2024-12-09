const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming you have a db.js file for MySQL connection

// GET /todos - Get all todo items
router.get("/", (req, res) => {
  db.query("SELECT * FROM todo_items", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving todos" });
    }
    res.status(200).json(result);
  });
});

// POST /todos - Add a new todo item
router.post("/", (req, res) => {
  const { description, completed_ts } = req.body;
  const created_ts = new Date().toISOString().slice(0, 19).replace("T", " "); // Format created_ts
  let completedTsFormatted = null;
  if (completed_ts) {
    completedTsFormatted = new Date(completed_ts)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }

  db.query(
    "INSERT INTO todo_items (description, completed_ts, created_ts) VALUES (?, ?, ?)",
    [description, completedTsFormatted, created_ts],
    (err, result) => {
      if (err) {
        console.error("Error in POST request:", err);
        return res.status(500).json({ message: "Error creating todo" });
      }
      res.status(201).json({
        message: "Todo created successfully",
        todo: {
          id: result.insertId,
          description,
          completed_ts: completedTsFormatted,
          created_ts,
        },
      });
    }
  );
});

// PUT /todos/:id - Update an existing todo item
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { description, completed_ts } = req.body;
  const updated_ts = new Date().toISOString().slice(0, 19).replace("T", " ");
  let completedTsFormatted = null;
  if (completed_ts) {
    completedTsFormatted = new Date(completed_ts)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
  }

  db.query(
    "UPDATE todo_items SET description = ?, completed_ts = ?, updated_ts = ? WHERE id = ?",
    [description, completedTsFormatted, updated_ts, id],
    (err, result) => {
      if (err) {
        console.error("Error in PUT request:", err);
        return res.status(500).json({ message: "Error updating todo" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Todo item not found" });
      }
      res.status(200).json({
        message: "Todo updated successfully",
        todo: {
          id,
          description,
          completed_ts: completedTsFormatted,
          updated_ts,
        },
      });
    }
  );
});

// DELETE /todos/:id - Delete a todo item
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM todo_items WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error in DELETE request:", err);
      return res.status(500).json({ message: "Error deleting todo" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Todo item not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  });
});

module.exports = router;
