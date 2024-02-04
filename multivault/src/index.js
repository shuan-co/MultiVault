import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/index.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Test
import Login from './pages/noauth/Login/Login.jsx';
import Register from './pages/noauth/Register/Register.jsx'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
        </Routes>
    </BrowserRouter>


  </React.StrictMode>
);

