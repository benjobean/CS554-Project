// DataBox.js
import React, { useState, useEffect } from 'react';

function DataBox() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your Express API when the component mounts
    fetch('/getAll')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Data from Database</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataBox;
