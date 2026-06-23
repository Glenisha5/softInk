
import React from 'react';
// @ts-ignore: declaration file for 'react-dom/client' not found in this project
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);
