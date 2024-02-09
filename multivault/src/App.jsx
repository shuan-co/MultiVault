import React, { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { auth } from './firebase/firebase.js';

// Test
import Login from './pages/noauth/Login/Login.jsx';
import Register from './pages/noauth/Register/Register.jsx'
import { Private } from './pages/auth/Private.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // @ts-ignore
            setUser(user);
            setLoading(false);
            return;
        }
        setUser(null);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);  

  return (
    <main>
    {loading ? <h2>Loading...</h2> : <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login user={user} />}/>
            <Route path='/login' element={<Login user={user}/>}/>
            <Route path='/register' element={<Register user={user}/>}/>
            <Route path='/private' 
            element={<ProtectedRoute user={user} children={<Private/>}/>}/>
        </Routes>
    </BrowserRouter>}
    </main>
  )
}

export default App;import React, { useState } from 'react';
import Inventory from './pages/auth/Inventory';
import AddItem from './pages/auth/AddItem';


function App() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const handleAddItem = (itemName) => {
    setItems([...items, itemName]);
  };

  return (
    <div className="App">
      <h1>Inventory Management System</h1>
      <AddItem onAdd={handleAddItem} />
      <Inventory items={items} />
    </div>
  );
}

export default App;
