// AddItem.js
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './AddItem.css';

const AddItem = ({ onAdd, show, onHide }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemStatus, setItemStatus] = useState('');
  const [itemImage, setItemImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemDescription.trim() || !itemQuantity.trim()) return;
    onAdd({ name: itemName, description: itemDescription, status:itemStatus, quantity: itemQuantity, image: itemImage });
    setItemName('');
    setItemDescription('');
    setItemQuantity('');
    setItemStatus('');
    setItemImage(null);
    onHide();
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  return (
    <>
      {/* Removed the Button component that shows the modal since it's now in the Inventory component */}

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
            <input
              type="text"
              placeholder="Enter item status"
              value={itemStatus}
              onChange={(e) => setItemStatus(e.target.value)}
            />
            <input
              type="file"
              onChange={handleImageChange}
            />
            <button type="submit">Submit</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddItem;
