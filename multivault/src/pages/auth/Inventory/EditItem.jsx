// EditItem.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './AddItem.css';

const EditItem = ({ onEdit, show, onHide, item }) => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemStatus, setItemStatus] = useState('');
    const [itemIndex, setItemIndex] = useState(null);

    useEffect(() => {
        // Initialize state with item values when the component mounts
        if (item) {
            setItemName(item.name);
            setItemDescription(item.description);
            setItemQuantity(item.quantity);
            setItemStatus(item.status);
            setItemIndex(item.index);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!itemName.trim() || !itemDescription.trim() || !itemQuantity.trim()) return;
        const updatedItem = {
            ...item,
            name: itemName,
            description: itemDescription,
            quantity: itemQuantity,
            status: itemStatus,
            index: itemIndex
        };
        console.log( itemIndex );
        
        onEdit(updatedItem);
        onHide();
    };
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    <input
                        type="text" placeholder="Enter item description" value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                    />
                    <input
                        type="number" placeholder="Enter item quantity" value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                    />
                    <input
                        type="text" placeholder="Enter item status" value={itemStatus}
                        onChange={(e) => setItemStatus(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditItem;