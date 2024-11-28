import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, getDoc, doc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebase';
import { ROLES } from '../../noauth/roles';
import { loggingService } from '../../../utils/LoggingService';
import Navbar from '../Components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    checkAdminAccess();
    fetchUsers();
  }, []);


  const checkAdminAccess = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/login');
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      if (!userData || userData.role !== ROLES.ADMIN) {
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/unauthorized');
    }
  };

  const fetchSystemLogs = async () => {
    try {
        const currentUser = auth.currentUser;
        const logs = await loggingService.getLogs({}, currentUser.uid);
        setLogs(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        alert('Error fetching system logs. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        
        const itemsSnapshot = await getDocs(collection(db, `users/${userId}/items`));
        itemsSnapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, `users/${userId}/items`, document.id));
        });

        const usageHistorySnapshot = await getDocs(collection(db, `users/${userId}/usageHistory`));
        usageHistorySnapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, `users/${userId}/usageHistory`, document.id));
        });

        const orderHistorySnapshot = await getDocs(collection(db, `users/${userId}/orderHistory`));
        orderHistorySnapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, `users/${userId}/orderHistory`, document.id));
        });

        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-2xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full p-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="p-2 border rounded-lg"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value={ROLES.CUSTOMER}>Customers</option>
                <option value={ROLES.BUSINESS_OWNER}>Business Owners</option>
                <option value={ROLES.STAFF}>Staff</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.companyName || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(user.created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;