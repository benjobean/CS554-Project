// app.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
} from '../../notes/src/index.js';
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} from '../../todo/src/index.js';

const appNote = express(); // Express app for notes
const appTodo = express(); // Express app for todos

const PORT_TODO = 3001; // Port for todos service
const PORT_NOTE = 3002; // Port for notes service

appNote.use(express.json());
mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
appNote.use(cors());

// Notes Endpoints
appNote.post('/createNote', async (req, res) => {
  const { content } = req.body;

  try {
    const savedNote = await createNote(content);
    res.json(savedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

appNote.get('/getAllNotes', async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appNote.patch('/updateNote/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedNote = await updateNote(id, content);
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appNote.delete('/deleteNote/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await deleteNote(id);
    res.json(deletedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appNote.listen(PORT_NOTE, () => {
  console.log(`Notes service is running on port ${PORT_NOTE}`);
});

// Todos Endpoints
appTodo.use(express.json());
mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
appTodo.use(cors());

appTodo.post('/createTodo', async (req, res) => {
  const { title } = req.body;

  try {
    const savedTodo = await createTodo(title);
    res.json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

appTodo.get('/getAllTodos', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appTodo.patch('/updateTodo/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  try {
    const updatedTodo = await updateTodo(id, done);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appTodo.delete('/deleteTodo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await deleteTodo(id);
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appTodo.delete('/clearCompletedTodos', async (req, res) => {
  try {
    const result = await clearCompletedTodos();

    if (result.deletedCount > 0) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appTodo.listen(PORT_TODO, () => {
  console.log(`Todo service is running on port ${PORT_TODO}`);
});
