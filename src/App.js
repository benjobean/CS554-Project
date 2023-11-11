import trashcanIcon from './trashcan.svg';
import './App.css';
// import DataBox from './DataBox';
import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '' });
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Fetch todo tasks from the backend and update the state
    fetch('http://localhost:3001/getAllTodos')
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the parsed data
        setTodos(data);
      })
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  // Function to handle adding a new todo
  const handleAddTodo = () => {
    fetch('http://localhost:3001/createTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo({ title: '' }); // Clear the form inputs
      })
      .catch((error) => console.error('Error adding todo:', error));
  };

  // Function to handle updating a todo's completion status
  const handleUpdateTodo = (id) => {
    const updatedTodo = todos.find((todo) => todo._id === id);

    fetch(`http://localhost:3001/updateTodo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done: !updatedTodo.done }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? data : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error('Error updating todo:', error));
  };

  // Function to handle deleting a todo
  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:3001/deleteTodo/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error('Error deleting todo:', error));
  };

  // Function to handle clearing completed todos
  const handleClearCompletedTodos = () => {
    fetch('http://localhost:3001/clearCompletedTodos', {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // The request was successful, so you can update your todos state
          return response.json();
        } else {
          throw new Error('Failed to clear completed todos');
        }
      })
      .then(() => {
        // Filter out completed todos from the current state
        const updatedTodos = todos.filter((todo) => !todo.done);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error('Error clearing completed todos:', error));
  };

  // Function to grab time
  const fetchCurrentTime = () => {
    fetch('http://localhost:3002/getDateTime')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Current Date and Time', data.dateTime);
        setCurrentTime(data.dateTime);
      })
      .catch((error) => {
        console.error('Error fetching date and time', error);
      })
  }

  return (
    <div className="App">

      {/* <DataBox
        todos={todos}
        onAddTodo={handleAddTodo}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodo={handleDeleteTodo}
      /> */}

      <div>
        <h1> TODO </h1>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          // event handler to allow user to press enter to create a task
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
        <button onClick={handleClearCompletedTodos}>Clear Completed</button>
        <button onClick={fetchCurrentTime}>Get Current Time</button>
        {currentTime && <p className="time-output">Current Time: {currentTime}</p>}
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.done ? 'done' : ''}`}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleUpdateTodo(todo._id)}
            />
            <span>{todo.title}</span>
            <button onClick={() => handleDeleteTodo(todo._id)}>
              {/* I don't know why this isn't working, but this image will not appear on this button */}
              <img src={trashcanIcon} height="20px" width="20px" alt="Delete" />
              {/* 🗑️ */}
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
