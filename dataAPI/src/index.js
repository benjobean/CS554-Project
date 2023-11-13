import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//CORS
app.use(cors());

//Schema
const todoSchema = new mongoose.Schema({
  title: String,
  dateCompleted: String,
  done: Boolean,
});
const Todo = mongoose.model("Todo", todoSchema);

//POST

app.post("/createTodo", async (req, res) => {
  const { title } = req.body;

  const newTodo = new Todo({
    title,
    dateCompleted: "",
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
    let updatedTodo;
    //if we are marking it as complete...
    if (done) {
      const dateTimeResponse = await fetch('http://localhost:3002/getDateTime');
      if (!dateTimeResponse.ok) {
        throw new Error('Failed to contact dateTime service.')
      }

      const dateTimeData = await dateTimeResponse.json()
      const completionTime = dateTimeData.dateTime;
      updatedTodo = await Todo.findByIdAndUpdate(
        id,
        {
          done,
          dateCompleted: completionTime
        },
        { new: true }
      );
    }
    //if we are marking it as incomplete...
    else {
      updatedTodo = await Todo.findByIdAndUpdate(
        id,
        {
          done,
          dateCompleted: ""
        },
        { new: true }
      );
    }

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

// CLEAR COMPLETE
app.delete('/clearCompletedTodos', async (req, res) => {
  try {
    const result = await Todo.deleteMany({ done: true });

    if (result.deletedCount > 0) {
      res.json({ message: 'Completed todos cleared successfully' });
    } else {
      res.status(404).json({ error: 'No completed todos found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear completed todos' });
  }
});

app.listen(3001, () => {
  console.log("on port 3001");
});

