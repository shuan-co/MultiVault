import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { auth } from './firebase/firebase.js';
import Login from './pages/noauth/Login/Login.jsx';
import Register from './pages/noauth/Register/Register.jsx';
import { Private } from './pages/auth/Private.jsx';
import SideNav from './pages/auth/Inventory/SideNav';
import Inventory from './pages/auth/Inventory/Inventory';
import AddItem from './pages/auth/Inventory/AddItem';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddItem(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <main>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login user={user} />} />
              <Route path="/login" element={<Login user={user} />} />
              <Route path="/register" element={<Register user={user} />} />
              <Route path="/private" element={<ProtectedRoute user={user} children={<Private />} />} />
            </Routes>
          </BrowserRouter>
        )}
      </main>
    </div>
  );
};

export default App;
