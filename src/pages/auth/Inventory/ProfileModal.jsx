// ProfileModal.jsx
import React, { useState } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ userData, onClose, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onEdit(updatedUserData);
    setEditing(false);
  };

  const handleDelete = () => {
    const randomCode = generateRandomCode(8);
    const userInput = prompt(`Please enter the following code to confirm account deletion: ${randomCode}`);
    if (userInput === randomCode) {
      onDelete();
    } else {
      alert('Incorrect code. Account deletion canceled.');
    }
  };

  // - For account deletion confirmation
  const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-container">
        <div className="profile-modal-header"> 
            {editing ? ( 
            <div>
                <h2 className="profile-modal-header-title"> Edit Profile</h2>
                <button className="profile-modal-close-button" onClick={onClose}>x</button>
            </div>
            ) : ( 
            <div>
                <h2 className="profile-modal-header-title"> View Profile</h2>
                <button className="profile-modal-close-button" onClick={onClose}>x</button>
            </div>
            )}
        </div>
        <div className="profile-modal-content-container">
            {editing ? (
            <div>
                <div className="profile-modal-text-view">
                    <p className="profile-modal-input-label"> First Name:</p>
                    <input className="profile-modal-input-content" type="text" name="firstName" value={updatedUserData.firstName} onChange={handleChange} />
                </div>
                <div className="profile-modal-text-view">
                    <p className="profile-modal-input-label"> Last Name:</p>
                    <input className="profile-modal-input-content" type="text" name="lastName" value={updatedUserData.lastName} onChange={handleChange} />
                </div>
                

                <div className="profile-modal-actions">
                <button className="profile-save-button" onClick={handleSave}>Save</button>
                <button className="profile-edit-button" onClick={() => setEditing(false)}>Cancel</button>
                </div>
            </div>
            ) : (
            <div>
                <div className="profile-modal-text-view">
                    <p className="profile-modal-input-label"> Name:</p>
                    <p className="profile-modal-input-display">{userData.firstName} {userData.lastName}</p>
                </div>
                <div className="profile-modal-text-view">
                    <p className="profile-modal-input-label"> Birthday:</p>
                    <p className="profile-modal-input-display">{userData.birthday}</p>
                </div>

                <div className="profile-modal-actions">
                <button className="profile-edit-button" onClick={() => setEditing(true)}>Edit</button>
                <button className="profile-delete-button" onClick={handleDelete}>Delete Account</button>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;