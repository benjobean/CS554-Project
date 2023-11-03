import logo from './logo.svg';
import './App.css';
import DataBox from './DataBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <DataBox /> {/* Use the DataBox component to display database data */}
      </header>
    </div>
  );
}

export default App;
