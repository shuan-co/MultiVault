import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { auth } from './firebase/firebase.js';
import Login from './pages/noauth/Login/Login.jsx';
import Register from './pages/noauth/Register/Register.jsx';
import { Private } from './pages/auth/Private.jsx';

import Landing from './pages/noauth/Landing/Landing.jsx';
import Inventorypage from './pages/auth/Inventory/Inventorypage.jsx';
import UsageHistoryPage from './pages/auth/Inventory/UsageHistoryPage.jsx';
import OrderHistoryPage from './pages/auth/Inventory/OrderHistoryPage.jsx';
import ProfilePage from './pages/auth/Profile/ProfilePage.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
              <Route path="/" element={<Landing user={user}/>} />
              <Route path="/landing" element={<Landing user={user}/>} />
              <Route path="/login" element={<Login user={user}/>} />
              <Route path="/register" element={<Register user={user} />} />
              <Route path="/private" element={<ProtectedRoute user={user} children={<Private />} />} />
              <Route path="/inventory" element={<ProtectedRoute user={user} children={<Inventorypage />} />} />
              <Route path="/profile" element={<ProtectedRoute user={user} children={<ProfilePage />} />} />
              <Route path="/usageHistory" element={<ProtectedRoute user={user} children={<UsageHistoryPage />} />} />
              <Route path="/orderHistory" element={<ProtectedRoute user={user} children={<OrderHistoryPage />} />} />
            </Routes>
          </BrowserRouter>
        )}
      </main>
    </div>
  );
};

export default App;