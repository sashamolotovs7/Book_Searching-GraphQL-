import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Unable to render the app.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
