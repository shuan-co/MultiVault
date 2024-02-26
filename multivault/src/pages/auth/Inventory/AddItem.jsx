// AddItem.js
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './AddItem.css';

import { auth, storage } from '../../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid';

const AddItem = ({ onAdd, show, onHide }) => {
  const currDate = new Date().toISOString().split('T')[0]
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemStatus, setItemStatus] = useState('');
  const [itemExpiry, setItemExpiry] = useState(currDate);
  const [itemImage, setItemImage] = useState(null);
  const [itemIndex, setItemIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Upload image
    if (itemImage != null) {
      const imageRef = ref(storage,  `${auth.currentUser?.uid}/${itemImage.name + v4()}`);

      uploadBytes(imageRef, itemImage)
      .then(() => {
        // Get Image URL for rendering
        getDownloadURL(imageRef)
        .then((url) => {
            // Data with image URL
            if (!itemName.trim() || !itemDescription.trim() || !itemQuantity.trim()) return;
            onAdd({ name: itemName, description: itemDescription, status:itemStatus, quantity: itemQuantity, imageurl: url, expiry: itemExpiry });
            setItemName('');
            setItemDescription('');
            setItemQuantity('');
            setItemStatus('');
            setItemImage(null);
            setItemExpiry(currDate);
            setItemIndex(itemIndex+1);
            onHide();
        })
        .catch((err) => {
          console.error(err);
        })
      })
      .catch((err) => {
        console.error(err);
      })
    }
    else {
      // Data without image URL
      if (!itemName.trim() || !itemDescription.trim() || !itemQuantity.trim()) return;
      onAdd({ name: itemName, description: itemDescription, status:itemStatus, quantity: itemQuantity, imageurl: '', expiry: itemExpiry });
      setItemName('');
      setItemDescription('');
      setItemQuantity('');
      setItemStatus('');
      setItemImage(null);
      setItemExpiry(currDate);
      onHide();
    }
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };


  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter item description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter item quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <select value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Perishable">Perishable</option>
              <option value="Non-Perishable">Non-Perishable</option>
            </select>
            <input
              type="date"
              placeholder="Expiry Date"
              value={itemExpiry}
              onChange={(e) => setItemExpiry(e.target.value)}
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            <button type="submit">Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddItem;
