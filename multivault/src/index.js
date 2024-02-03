import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css'
import '../src/output.css'

// Test
import Register from './pages/noauth/Register/Register.jsx';
import Login from './pages/noauth/Login/Login.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);

