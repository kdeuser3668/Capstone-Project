import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Apply saved theme BEFORE React renders the UI
const applySavedTheme = () => {
  const vars = [
    "textColor",
    "buttonColor",
    "shadowColor",
    "backgroundColor",
    "sidebarColor",
    "cardColor",
    "fontSize"
  ];

  vars.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      const cssVar = "--" + key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      document.documentElement.style.setProperty(cssVar, value);
    }
  });
};

applySavedTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
