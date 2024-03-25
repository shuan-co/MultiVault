// AddItem.js
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './AddItem.css';

import { auth, storage, db } from '../../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, addDoc, getDoc, getDocs } from "firebase/firestore";
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
  const [isPrioritized, setIsPrioritized] = useState(false); // New state for prioritization

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIndex = Date.now(); // - unique indexing, works cause we can only add 1 item at a time

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
            onAdd({ name: itemName, description: itemDescription, status:itemStatus, quantityOrig: itemQuantity,  quantityCurr: itemQuantity, imageurl: url, expiry: itemExpiry, index: Date.now(), prioritized: isPrioritized }); // Include prioritized field in the item data
            setItemName('');
            setItemDescription('');
            setItemQuantity('');
            setItemStatus('');
            setItemImage(null);
            setItemExpiry(currDate);
            setIsPrioritized(false);
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
      onAdd({ name: itemName, description: itemDescription, status:itemStatus, quantityOrig: itemQuantity, quantityCurr: itemQuantity, expiry: itemExpiry, index: Date.now(), prioritized: isPrioritized }); // Include prioritized field in the item data
      setItemName('');
      setItemDescription('');
      setItemQuantity('');
      setItemStatus('');
      setItemImage(null);
      setItemExpiry(currDate);
      setIsPrioritized(false);
      onHide();
    }
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleTogglePrioritize = () => {
    setIsPrioritized(prevState => !prevState); // Toggle the prioritization state
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton className='pt-7 px-9'>
          <Modal.Title className='text-blue-900 text-start'>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className='px-8 pb-9 pt-2'>
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              data-testid="itemName"
            />
            <input
              type="text"
              placeholder="Enter item description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              data-testid='itemDescription'
            />
            <input
              type="number"
              placeholder="Enter item quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              data-testid='itemQuantity'  
            />
            <select value={itemStatus} onChange={(e) => setItemStatus(e.target.value)} data-testid='itemStatus' className='p-4 rounded-lg border' required>
              <option value="">Select Status</option>
              <option value="Perishable">Perishable</option>
              <option value="Non-Perishable">Non-Perishable</option>
            </select>
            <input
              type="date"
              placeholder="Expiry Date"
              value={itemExpiry}
              onChange={(e) => setItemExpiry(e.target.value)}
              data-testid='itemDate'  
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              data-testid='itemImage'  
            />
            <button type="submit" className='rounded-xl bg-blue-900 hover:bg-blue-800 text-white'>Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddItem;
