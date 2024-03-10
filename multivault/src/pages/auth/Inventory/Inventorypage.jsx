import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import Inventory from './Inventory';
import AddItem from './AddItem';
import EditItem from './EditItem';

import { auth, db } from '../../../firebase/firebase';
import { collection, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

function Inventorypage() {
  const currDate = new Date()
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);

  useEffect(() => {
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

  const handleAddItem = (item) => {
    // Add the item
    addDoc(itemsCollectionRef, item)
    .then(() => {
      alert('Item Added Successfully');
    })
    .catch((err) => {
      alert('Error Adding Item');
      console.error(err);
    })

    setShowAddItem(false); // Close the modal after item is added
    retrieveItems();
  };

  const handleEditItem = async (updatedItem) => {
    console.log("updatedItem:", updatedItem); // Check the value of updatedItem

    const index = updatedItem.index;

    const querySnapshot = await getDocs(query( 
        itemsCollectionRef,
        where('index', '==', index )
    ));

    const docs = querySnapshot.docs;
    console.log( docs );
    if (docs.length === 0) {
      console.log('No matching document.');
      return null;
    }

    // - Assuming there's only one document matching the index
    const doc = docs[0];
    const itemId = doc.id;

    console.log("doc:", doc); // Check the value of docs
    console.log("documentID", itemId); // Check the value of docs

    try {
      // Update the document with the new data
      updateDoc(doc.ref, updatedItem).then(() => {
        alert('Item Updated Successfully');

        const expiryDate = new Date(updatedItem.expiry);
        // Calculate the difference between the two dates in milliseconds
        const differenceMs = expiryDate - currDate;
        // Convert milliseconds to days
        const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
        if (differenceDays <= 2) {
          // EMAIL HERE
        }
      }).catch((err) => {
        alert('Error Updating Item');
        console.error(err);
      })
      retrieveItems(); // Refresh the items list after updating
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    }

    setShowEditItem(false); // Close the modal after item is added
  };

  const handleToggleSelectItem = (index) => {
    setSelectedItems(prevSelectedItems => {
        if (prevSelectedItems.includes(index)) {
            return prevSelectedItems.filter(itemIndex => itemIndex !== index);
        } else {
            return [...prevSelectedItems, index];
        }
    });
  };

  function sortItemsByMinQuantity () {
    setItems(items.slice().sort((a, b) => a.quantity - b.quantity))
  }

  function sortItemsByMaxQuantity () {
    setItems(items.slice().sort((a, b) => b.quantity - a.quantity))
  }

  function sortItemsAsc () {
    setItems(items.slice().sort((a, b) => a.name.localeCompare(b.name)));
  }

  function sortItemsDesc () {
    setItems(items.slice().sort((a, b) => b.name.localeCompare(a.name)));
  }

  function sortExpAsc() {
    setItems(
      items.slice().sort((a, b) => new Date(a.expiry) - new Date(b.expiry))
    );
  }
  
  function sortExpDesc() {
    setItems(
      items.slice().sort((a, b) => new Date(b.expiry) - new Date(a.expiry))
    );
  }

  return (
    <div className="Inventorypage">
      <div className="content">
        <main>
          <Inventory items={items} onShowAddItem={() => setShowAddItem(true)}
                     onShowEditItem={() => setShowEditItem(true)} setItemToEdit={(item) => setItemToEdit(item)} 
                     onToggleSelectItem={handleToggleSelectItem} selectedItems={selectedItems}                     
                     sortItemsByMinQuantity={sortItemsByMinQuantity} 
                     sortItemsByMaxQuantity={sortItemsByMaxQuantity}
                     sortItemsAsc={sortItemsAsc}
                     sortItemsDesc={sortItemsDesc}
                     sortExpAsc={sortExpAsc}
                     sortExpDesc={sortExpDesc} />
          <AddItem onAdd={handleAddItem} show={showAddItem} onHide={() => setShowAddItem(false)} />
          <EditItem onEdit={handleEditItem} show={showEditItem} onHide={() => setShowEditItem(false)} item={itemToEdit} />
        </main>
      </div>
    </div>
  );
}

export default Inventorypage;
