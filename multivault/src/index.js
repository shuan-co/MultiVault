import React from 'react';
import ReactDOM from 'react-dom/client';

// Test
import Sample from './pages/noauth/Sample'
import './firebase/Firebase.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sample />
  </React.StrictMode>
);

