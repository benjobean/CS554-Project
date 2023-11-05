import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app=express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/myDatabase", {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//CORS
app.use(cors());

//Schema
const todoSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
});
const Todo = mongoose.model("Todo", todoSchema);

//POST

app.post("/createTodo", async (req, res) => {
    const { title } = req.body;
  
    const newTodo = new Todo({
      title,
      done: false, // By default, the task is not completed
    });
  
    try {
      const savedTodo = await newTodo.save();
      res.json(savedTodo);
    } catch (error) {
      res.status(400).json({ error: "Failed to create a todo task." });
    }
  });

//GET

app.get("/getAllTodos", async (req, res) => {
try {
    const todos = await Todo.find({});
    res.json(todos);
} catch (error) {
    res.status(500).json({ error: "Failed to retrieve todo tasks." });
}
});

//PATCH

app.patch("/updateTodo/:id", async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
  
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { done },
        { new: true }
      );
  
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo task not found." });
      }
  
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update todo task." });
    }
  });
  
//DELETE

app.delete("/deleteTodo/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedTodo = await Todo.findByIdAndRemove(id);
  
      if (!deletedTodo) {
        return res.status(404).json({ error: "Todo task not found." });
      }
  
      res.json(deletedTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete todo task." });
    }
  });
  
  app.listen(3001, ()=>{
    console.log("on port 3001");
});