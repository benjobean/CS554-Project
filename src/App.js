import logo from './logo.svg';
import './App.css';
import DataBox from './DataBox';
import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: ''});
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
        setNewTodo({ title: ''}); // Clear the form inputs
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
    fetch('http://localhost:3001/getDateTime')
    .then((response) => response.json())
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello World.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <DataBox
          todos={todos}
          onAddTodo={handleAddTodo}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          
        />
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <button onClick={handleAddTodo}>Add Todo</button>
          <button onClick={handleClearCompletedTodos}>Clear Completed</button>
          <button onClick={fetchCurrentTime}>Get Current Time</button>
          {currentTime && <p className="time-output">Current Time: {currentTime}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
