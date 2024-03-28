import React, { useState, useMemo, useEffect } from 'react';
import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';
import { Pagination, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, getDoc, addDoc, getDocs, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import { auth, db } from '../../../firebase/firebase';
import { Fragment } from 'react'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { grey, yellow } from '@mui/material/colors'
import ProfileSection from './ProfileSection';

const UsageHistoryPage = ({ usageRecords }) => {

  /*************************************************************** 
                      Profile Section Function
  ***************************************************************/
  // - Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  // - Updating User Data
  const [editing, setEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(userData);

  const isUserAccount = !userData || !userData.companyName;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(updatedUserData);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  /*************************************************************** 
                      Return Function
  ***************************************************************/
  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="profile">
          <div class="profile-image-container">
            <img src="https://www.pinclipart.com/picdir/middle/148-1486972_mystery-man-avatar-circle-clipart.png" alt="Profile" className="profile-image" />
          </div>
          {editing ? (
            <div>
              <input type="text" name="firstName" value={updatedUserData.firstName} onChange={handleChange} />
              <input type="text" name="lastName" value={updatedUserData.lastName} onChange={handleChange} />
              {isUserAccount ? (
                <input type="text" name="birthday" value={updatedUserData.birthday} onChange={handleChange} />
              ) : (
                <>
                  <input type="text" name="companyName" value={updatedUserData.companyName} onChange={handleChange} />
                  <input type="text" name="businessType" value={updatedUserData.businessType} onChange={handleChange} />
                  <textarea name="businessDesc" value={updatedUserData.businessDesc} onChange={handleChange}></textarea>
                </>
              )}
              <button className="sidebar-button" onClick={handleSave}> Save</button>
            </div>
          ) : (
            <div>
              <h3 className="profile-name">{userData.firstName} {userData.lastName}</h3>
              { isUserAccount ? (
                <p> User Account </p>
              ) : (
                <p> Business Account </p>
              )}
            </div>
          )}
          <div className="button-container">
            <button className="sidebar-button" onClick={handleViewProfile}>View Profile</button>
            <button className="sidebar-button">Usage History</button>
            <button className="sidebar-button">Order History</button>
          </div>
          <button className="sidebar-button" onClick={handleLogout}>Logout</button>
          {showProfileModal && (
            <ProfileModal
              userData={userData}
              onClose={handleCloseProfileModal}
              onEdit={onSave}
              onDelete={onDelete}
            />
          )}
        </div>
       </div>
       <div className="p-6 space-y-3 w-full">
            <div className="inventory">
            <h2>Usage History</h2>
            {usageRecords.length > 0 ? (
            <table>
                <thead>
                    <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Date</th>
                    <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {usageRecords.map((record, index) => (
                    <tr key={index}>
                        <td>{record.productName}</td>
                        <td>{record.quantity}</td>
                        <td>{record.date}</td>
                        <td>{record.time}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <div className="no-items">No items available</div>
            )}

            </div>
        </div>
    </div>
  );
};

export default UsageHistoryPage;