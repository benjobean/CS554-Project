// todoService.js

import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: String,
  done: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

async function createTodo(title) {
  const newTodo = new Todo({
    title,
    done: false,
  });

  try {
    const savedTodo = await newTodo.save();
    return savedTodo;
  } catch (error) {
    throw new Error('Failed to create a todo task.');
  }
}

async function getAllTodos() {
  try {
    const todos = await Todo.find({});
    return todos;
  } catch (error) {
    throw new Error('Failed to retrieve todo tasks.');
  }
}

async function updateTodo(id, done) {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, { done }, { new: true });

    if (!updatedTodo) {
      throw new Error('Todo task not found.');
    }

    return updatedTodo;
  } catch (error) {
    throw new Error('Failed to update todo task.');
  }
}

async function deleteTodo(id) {
  try {
    const deletedTodo = await Todo.findByIdAndRemove(id);

    if (!deletedTodo) {
      throw new Error('Todo task not found.');
    }

    return deletedTodo;
  } catch (error) {
    throw new Error('Failed to delete todo task.');
  }
}

async function clearCompletedTodos() {
  try {
    const result = await Todo.deleteMany({ done: true });

    if (result.deletedCount > 0) {
      return { message: 'Completed todos cleared successfully' };
    } else {
      throw new Error('No completed todos found');
    }
  } catch (error) {
    throw new Error('Failed to clear completed todos');
  }
}

export { createTodo, getAllTodos, updateTodo, deleteTodo, clearCompletedTodos };
