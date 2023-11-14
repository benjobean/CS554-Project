import trashcanIcon from './trashcan.svg';
import './App.css';
// import DataBox from './DataBox';
import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '' });
  const [currentTime, setCurrentTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(null);

  useEffect(() => {
    // Fetch todo tasks from the backend and update the state
    fetch('http://localhost:3001/getAllTodos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
        setLoading(false); // Set loading to false in case of an error
      });
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
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === id ? data : todo))
        );
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

  // Function to handle adding a new note
  const handleAddNote = () => {
    fetch('http://localhost:3001/createNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes([...notes, data]);
        setNewNote({ content: '' });
      })
      .catch((error) => console.error('Error adding note:', error));
  };

  // Function to handle deleting a note
  const handleDeleteNote = (id) => {
    fetch(`http://localhost:3001/deleteNote/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedNotes = notes.filter((note) => note._id !== id);
        setNotes(updatedNotes);
      })
      .catch((error) => console.error('Error deleting note:', error));
  };
  
  // Function to handle button click status
  const handleButtonClick = (buttonName) => {
    setButtonClicked(buttonName);

    switch (buttonName) {
      case 'addTodo':
        handleAddTodo();
        break;
      case 'clearCompleted':
        handleClearCompletedTodos();
        break;
      case 'getCurrentTime':
        fetchCurrentTime();
        break;
      default:
        break;
    }

    // Reset the buttonClicked state after a short delay
    setTimeout(() => {
      setButtonClicked(null);
    }, 300);
  };

  return (
    <div className="App">
      <div>
        <h1>TODO</h1>
        <input
          type="text"
          placeholder="Enter a todo item"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        <button
          className={buttonClicked === 'addTodo' ? 'button-clicked' : ''}
          onClick={() => handleButtonClick('addTodo')}
        >
          Add Todo
        </button>
        <button
          className={buttonClicked === 'clearCompleted' ? 'button-clicked' : ''}
          onClick={() => handleButtonClick('clearCompleted')}
        >
          Clear Completed
        </button>
        <button
          className={buttonClicked === 'getCurrentTime' ? 'button-clicked' : ''}
          onClick={() => handleButtonClick('getCurrentTime')}
        >
          Get Current Time
        </button>
        {currentTime && (
          <p className="time-output">Current Time: {currentTime}</p>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className={`todo-item ${todo.done ? 'done' : ''}`}
                style={{ width: '300px', overflowWrap: 'break-word', wordBreak: 'break-all' }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleUpdateTodo(todo._id)}
                />
                <span>{todo.title}</span>
                <button onClick={() => handleDeleteTodo(todo._id)}
                style={{
                  height: '15px',
                  width: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                >
                  <img
                    src={trashcanIcon}
                    height="10px"
                    width="10px"
                    alt="Delete"
                  />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
