import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';

import Login from './pages/noauth/Login/Login.jsx';
import Register from './pages/noauth/Register/Register.jsx';
import Landing from './pages/noauth/Landing/Landing.jsx';
import Inventorypage from './pages/auth/Inventory/Inventorypage.jsx';
import UsageHistoryPage from './pages/auth/Inventory/UsageHistoryPage.jsx';
import OrderHistoryPage from './pages/auth/Inventory/OrderHistoryPage.jsx';
import ProfilePage from './pages/auth/Profile/ProfilePage.jsx';
import AdminDashboard from './pages/auth/Admin/AdminDashboard.jsx';

import { securityService } from './utils/authSecurity';
import { loggingService } from './utils/LoggingService';

import { Error404, Error403, Error500 } from './pages/ErrorPages.jsx';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventorypage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usage-history"
          element={
            <ProtectedRoute>
              <UsageHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Error403 />} />
        <Route path="/error" element={<Error500 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
