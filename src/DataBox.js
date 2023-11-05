// DataBox.js
import React from 'react';

function DataBox({ todos, onUpdateTodo, onDeleteTodo, onClearCompleted }) {
  const handleCheckboxChange = (id) => {
    // Call the onUpdateTodo function when the checkbox is changed
    onUpdateTodo(id);
  };

  return (
    <div>
      <h2>Todo Tasks</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleCheckboxChange(todo._id)}
            />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataBox;


