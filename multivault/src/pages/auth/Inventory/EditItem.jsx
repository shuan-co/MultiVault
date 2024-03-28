// EditItem.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './AddItem.css';

import { auth, storage } from '../../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid';

const EditItem = ({ onEdit, show, onHide, item, onDelete }) => {
    const currDate = new Date().toISOString().split('T')[0]
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemStatus, setItemStatus] = useState('');
    const [itemIndex, setItemIndex] = useState(null);
    const [itemExpiry, setItemExpiry] = useState(currDate);
    const [itemImage, setItemImage] = useState(null);

    useEffect(() => {
        // Initialize state with item values when the component mounts
        if( item ) {
            setItemName(item.name);
            setItemDescription(item.description);
            setItemQuantity(item.quantityCurr);
            setItemStatus(item.status);
            setItemExpiry(item.expiry);
            setItemImage(item.imageurl);
            setItemIndex(item.index);
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if( !itemName.trim() || !itemDescription.trim() || !itemQuantity.trim() ) return;

        // - Upload image
        if (itemImage != null) {
            const imageRef = ref(storage,  `${auth.currentUser?.uid}/${itemImage.name + v4()}`);

            uploadBytes( imageRef, itemImage )
            .then(() => {
                getDownloadURL(imageRef)
                .then((url) => {

                    const updatedItem = {
                        ...item,
                        name: itemName,
                        description: itemDescription,
                        quantityCurr: itemQuantity,
                        status: itemStatus,
                        expiry : itemExpiry, 
                        index: itemIndex,
                        imageurl: imageRef
                    };

                    onEdit(updatedItem);
                    onHide();
                })
            });
        } else {
            // - Data without image URL
            const updatedItem = {
                ...item,
                name: itemName,
                description: itemDescription,
                quantityCurr: itemQuantity,
                status: itemStatus,
                expiry : itemExpiry, 
                index: itemIndex,
                imageurl: ''
            };

            onEdit(updatedItem);
            onHide();
        }
    }

    const handleImageChange = (e) => {
        setItemImage(e.target.files[0]);
    };

    const handleDelete = () => {
        onDelete(itemIndex);
        onHide();
    };
    
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className='modal-header-2 px-9 pt-8'>
                <Modal.Title>Edit Item</Modal.Title>
                <button className="delete-item-button text-red rounded-lg p-2 bg-red-100" onClick={handleDelete}>Delete</button>
            </Modal.Header>
            <Modal.Body className='px-9 pb-8 pt-5'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        datatest-id="editItemName"
                    />
                    <input
                        type="text" placeholder="Enter item description" value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        datatest-id="editItemDescription"
                    />
                    <input
                        type="number" placeholder="Enter item quantity" value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                        datatest-id="editItemQuantity"
                    />
                    <select value={itemStatus} onChange={(e) => setItemStatus(e.target.value)} datatest-id="editItemStatus" className='p-3 rounded-md border'>
                        <option value="">Select Status</option>
                        <option value="Perishable">Perishable</option>
                        <option value="Non-Perishable">Non-Perishable</option>
                    </select>
                    <input
                        type="date"
                        placeholder="Expiry Date"
                        value={itemExpiry}
                        onChange={(e) => setItemExpiry(e.target.value)}
                        datatest-id="editItemDate"
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <button type="submit" className='text-white rounded-lg p-3 bg-blue-900'>Submit</button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default EditItem;