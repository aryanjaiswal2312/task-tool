const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../middleware/db');
const authMiddleware = require('../middleware/auth');

// All routes protected
router.use(authMiddleware);

// GET /api/todos - get all todos for user
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const userTodos = db.todos
      .filter(t => t.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userTodos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos.' });
  }
});

// POST /api/todos - create new todo
router.post('/', (req, res) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const db = readDB();
    const newTodo = {
      id: uuidv4(),
      userId: req.user.id,
      title: title.trim(),
      description: description || '',
      category: category || 'personal',
      priority: priority || 'medium',
      completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.todos.push(newTodo);
    writeDB(db);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error creating todo.' });
  }
});

// PUT /api/todos/:id - update todo
router.put('/:id', (req, res) => {
  try {
    const db = readDB();
    const todoIndex = db.todos.findIndex(
      t => t.id === req.params.id && t.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    db.todos[todoIndex] = {
      ...db.todos[todoIndex],
      ...req.body,
      id: req.params.id,
      userId: req.user.id,
      updatedAt: new Date().toISOString()
    };

    writeDB(db);
    res.json(db.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo.' });
  }
});

// PATCH /api/todos/:id/toggle - toggle complete
router.patch('/:id/toggle', (req, res) => {
  try {
    const db = readDB();
    const todoIndex = db.todos.findIndex(
      t => t.id === req.params.id && t.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    db.todos[todoIndex].completed = !db.todos[todoIndex].completed;
    db.todos[todoIndex].updatedAt = new Date().toISOString();
    writeDB(db);
    res.json(db.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling todo.' });
  }
});

// DELETE /api/todos/:id - delete todo
router.delete('/:id', (req, res) => {
  try {
    const db = readDB();
    const todoIndex = db.todos.findIndex(
      t => t.id === req.params.id && t.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found.' });
    }

    db.todos.splice(todoIndex, 1);
    writeDB(db);
    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo.' });
  }
});

// DELETE /api/todos/completed/all - clear all completed
router.delete('/completed/all', (req, res) => {
  try {
    const db = readDB();
    db.todos = db.todos.filter(t => !(t.userId === req.user.id && t.completed));
    writeDB(db);
    res.json({ message: 'Completed todos cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing todos.' });
  }
});

module.exports = router;
