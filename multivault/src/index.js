import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css';
import App from './App';

// @ts-ignore
// Test
import Sample from './pages/noauth/Sample'
import App from './App.jsx'
import './firebase/Firebase.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

