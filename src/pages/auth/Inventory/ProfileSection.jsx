import React, { useState } from 'react';
import ProfileModal from './ProfileModal';

const ProfileSection = ({ userData, onSave, onDelete, onLogout }) => {

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

  const handleLogout = () => {
    onLogout();
  }

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

  return (
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
            <>
              <p> Business Account </p>
              <p>Company Name: {userData.companyName}</p>
              <p>Business Type: {userData.businessType}</p>
              <p>Business Description: {userData.businessDesc}</p>
            </>
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
  );
};

export default ProfileSection;