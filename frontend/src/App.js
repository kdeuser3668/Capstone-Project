import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';


function App() {
  return (
    <div className="App">
      <LoginForm />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
