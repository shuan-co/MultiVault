import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

import ProfileSection from './ProfileSection';

import { auth, db } from '../../../firebase/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { signOut, updateProfile } from 'firebase/auth';

import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';

function OrderHistoryPage() {

  /*************************************************************** 
             User Data and Profile Functionalities
  ***************************************************************/
  const [userData, setUserData] = useState(null);
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);
  const orderHistoryCollectionRef = collection(db, `users/${auth.currentUser?.uid}/orderHistory`);


  useEffect(() => {
    retrieveUser();
    retrieveItems();
  }, [])

  const retrieveItems = () => {
    getDocs(itemsCollectionRef)
    .then((snapshot) => {
      const current = [];
      snapshot.forEach((doc) => { 
        current.push(doc.data());
      })
      setItems(current);
      console.log("Items retrieved successfully");
    })
    .catch((err) => {
      console.error(err);
    })
  }

  const deleteUser = async () => {
    
  }

  const retrieveUser = async () => {
    const user = auth.currentUser;

    if( user ) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if( docSnap.exists() ) {
        setUserData(docSnap.data());
      } else {
        console.error('User data not found');
      }
    }
  };

  const handleSave = (userData) => {
    const user = auth.currentUser;

    if( user ) {
      const userRef = doc(db, 'users', user.uid);

      updateDoc(userRef, userData).then(() => {
        setUserData(userData);
        alert("Profile updated successfully");
      }).catch((error) => {
        alert('Error updating profile');
        console.error(error);
      });

      updateProfile(user, {
        displayName: userData.firstName + ' ' + userData.lastName
      }).catch((error) => {
        console.error('Error updating display name:', error);
      });
    }
    setUserData(userData);
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if( user ) {
        const userRef = doc(db, 'users', user.uid);

        // - Delete user data from Firestore
        deleteDoc(userRef).then(() => {
          // - Delete user account
          deleteUser(user).then(() => {
            alert("Account deleted successfully");
          }).catch((error) => {
            alert('Error deleting account');
            console.error(error);
          });
        }).catch((error) => {
          alert('Error deleting user data');
          console.error(error);
        });
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      alert("Logged out Successfully");
    }).catch((err) => {
      alert('Log out error');
      console.error(err);
    });
  }


  /*************************************************************** 
                          Order History
  ***************************************************************/
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    retrieveUser();
    retrieveOrderHistory();
  }, []);

  const retrieveOrderHistory = async () => {
    try {
      const snapshot = await getDocs(orderHistoryCollectionRef);
      const orderHistoryData = snapshot.docs.map((doc) => doc.data());

      // Sort the order history based on usageDate and usageTime
      const sortedOrderHistory = orderHistoryData.sort((a, b) => {
        const dateA = new Date(`${a.usageDate} ${a.usageTime}`);
        const dateB = new Date(`${b.usageDate} ${b.usageTime}`);
        return dateB - dateA; // Sort in descending order (latest first)
      });

      setOrderHistory(sortedOrderHistory);
      console.log("Order history retrieved successfully");
    } catch (error) {
      console.error("Error retrieving order history:", error);
    }
  };


  /*************************************************************** 
                      Return Functionality
  ***************************************************************/
  return (
    <div className="Inventorypage">
        <Navbar/>
      <div className="content">
        <main>
            <div className="main-container">
                <div className="sidebar">
                    {userData ? (
                        <ProfileSection userData={userData} onSave={handleSave} onDelete={handleDeleteAccount} onLogout={handleLogout}/>
                    ) : (
                        <div className="profile">
                            <h3 className="profile-name">Loading...</h3>
                        </div>
                )}
                </div>
              <div className="p-6 space-y-3 w-full">
              <div className="header w-full p-5 bg-slate-200 rounded-xl"></div>
              <div className="order-history-container">
                <h1>Order History</h1>
                {orderHistory.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Quantity Ordered</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order, index) => (
                        <tr key={index}>
                          <td>{order.name}</td>
                          <td>{order.quantityOrdered}</td>
                          <td>{order.usageDate}</td>
                          <td>{order.usageTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No order history available.</p>
                )}
              </div>
            </div>
            </div>
        </main>
      </div>
    </div>
  );
}

export default OrderHistoryPage;