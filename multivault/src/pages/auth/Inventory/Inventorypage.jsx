import React, { useState, useEffect } from 'react';
import SideNav from './SideNav';
import Inventory from './Inventory';
import AddItem from './AddItem';
import EditItem from './EditItem';
import UseItem from './UseItem';
import OrderItem from './OrderItem';

import { auth, db } from '../../../firebase/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { signOut, updateProfile } from 'firebase/auth';
import { sendEmailNotification } from '../../../utils/EmailNotification';
import Navbar from '../Components/Navbar';

function Inventorypage() {

  /*************************************************************** 
                      Inventory Page Functions
  ***************************************************************/
  // - Item Details
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);

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

  /*************************************************************** 
                      Email Notification Functions
  ***************************************************************/
  // Alert Expiration
  const alertExpiry = (item) => {
    const currDate = new Date();
    const expiryDate = new Date(item.expiry);
    // Calculate the difference between the two dates in milliseconds
    const differenceMs = expiryDate - currDate;
    // Convert milliseconds to days
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    return differenceDays <= 2;
  }

  // Check if an item is low on stock
  const isLowOnStock = (item) => {
    const tenPercentOfOriginal = item.quantityOrig * 0.1;
    return item.quantityCurr <= tenPercentOfOriginal;
  }

  const checkItemCondition = (item) => {
    if (alertExpiry(item)) {
      sendEmailNotification(auth.currentUser?.email, item, "expiry");
    }
    else if (isLowOnStock(item)) {
      sendEmailNotification(auth.currentUser?.email, item, "lowstock");
    } 
  }

  /*************************************************************** 
                      Add Items Functions
  ***************************************************************/
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (item) => {
    // Add the item
    addDoc(itemsCollectionRef, item)
    .then(() => {
      alert('Item Added Successfully');
      checkItemCondition(item);
    })
    .catch((err) => {
      alert('Error Adding Item');
      console.error(err);
    })

    setShowAddItem(false); // Close the modal after item is added
    retrieveItems();
  };

  /*************************************************************** 
                      Edit Items Functions
  ***************************************************************/
   // - Edit Items
   const [showEditItem, setShowEditItem] = useState(false);
   const [itemToEdit, setItemToEdit] = useState(null);

  const handleEditItem = async (updatedItem) => {
    console.log("updatedItem:", updatedItem); // Check the value of updatedItem

    const index = updatedItem.index;

    const querySnapshot = await getDocs(query( 
        itemsCollectionRef,
        where('index', '==', index )
    ));

    const docs = querySnapshot.docs;
    if( docs.length === 0 ) {
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
        checkItemCondition(updatedItem);
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

  /*************************************************************** 
                      Delete Item Functionality
  ***************************************************************/
  const handleDeleteItem = async (itemIndex) => {
    try {
      const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);
      const q = query(itemsCollectionRef, where('index', '==', itemIndex));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const itemDoc = querySnapshot.docs[0];
        await deleteDoc(doc(itemsCollectionRef, itemDoc.id));
        console.log('Item deleted successfully');
        setShowEditItem(false);
        retrieveItems();
      } else {
        console.log('Item not found');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  /*************************************************************** 
                      Multiselect Functionality
  ***************************************************************/
  const [selectedItems, setSelectedItems] = useState([]);
  const handleToggleSelectItem = (index) => {
    setSelectedItems(selectedItems => {
      const selectedItemIndex = selectedItems.findIndex( item => item.index === index );

      // - If the item is already in selectedItems, remove it
      if( selectedItemIndex !== -1 ) {
        return selectedItems.filter( item => item.index !== index );
      } 
      // - If the item is not in selectedItems, find it in items and add it to selectedItems
      else {
        const selectedItem = items.find( item => item.index === index );
        if( selectedItem ) { return [...selectedItems, selectedItem]; }
        return selectedItems;
      }
    });
  };

  /*************************************************************** 
                      Usage History Functions
  ***************************************************************/
  const [showUseItem, setShowUseItem] = useState(false);
  const usageHistoryCollectionRef = collection(db, `users/${auth.currentUser?.uid}/usageHistory`);

  const handleUsageHistory = async( usedItems ) => {
    const currentDateTime = new Date().toISOString();
    const currentDate = currentDateTime.split('T')[0]; 
    const currentTime = currentDateTime.split('T')[1].split('.')[0];    

    try {
      // - Add used items to the usage history collection
      for( const usedItem of usedItems ) {
        await addDoc(usageHistoryCollectionRef, {
          index: usedItem.index,
          name: usedItem.name,
          quantityUsed: usedItem.quantityUsed,
          usageDate: currentDate,
          usageTime: currentTime,
        });
      }

      // - Update the remaining quantity in the items collection
      for( const usedItem of usedItems ) {
        const usedItemSnapshot = await getDocs(query(
          itemsCollectionRef, 
          where('index', '==', usedItem.index)
        ));

        const docs = usedItemSnapshot.docs;
        if( docs.length === 0 ) {
          console.log('No matching document.');
          return null;
        }

        // - Assuming there's only one document matching the index
        const doc = docs[0];

        // - Update the document with the new data
        const item = doc.data();
        const updatedQuantity = parseInt(item.quantityCurr) - parseInt(usedItem.quantityUsed);
        updateDoc(doc.ref, {quantityCurr: updatedQuantity})

        // - Update selected item
        const selectedItemIndex = selectedItems.findIndex(selectedItem => selectedItem.index === usedItem.index );
        if( selectedItemIndex !== - 1 ) {
          selectedItems[selectedItemIndex].quantityCurr = updatedQuantity;
          checkItemCondition(selectedItems[selectedItemIndex]);
        }
      }

      setShowUseItem(false); // - Close the modal after item is added
      retrieveItems(); // - Refresh the items after updating the quantities
      alert('Item(s) Used Successfully');

    } catch( error ) {
      console.error('Error handling usage history:', error);
    }
  };

  /*************************************************************** 
                      Order History Functions
  ***************************************************************/
  const [showOrderItem, setShowOrderItem] = useState(false);
  const orderHistoryCollectionRef = collection(db, `users/${auth.currentUser?.uid}/orderHistory`);

  const handleOrderHistory = async( orderedItems ) => {
    const currentDateTime = new Date().toISOString();
    const currentDate = currentDateTime.split('T')[0]; 
    const currentTime = currentDateTime.split('T')[1].split('.')[0];    

    try {
      // - Add used items to the usage history collection
      for( const orderedItem of orderedItems ) {
        await addDoc(orderHistoryCollectionRef, {
          index: orderedItem.index,
          name: orderedItem.name,
          quantityOrdered: orderedItem.quantityOrdered,
          usageDate: currentDate,
          usageTime: currentTime,
        });
      }

      // - Update the remaining quantity in the items collection
      for( const orderedItem of orderedItems ) {
        const orderedItemSnapshot = await getDocs(query(
          itemsCollectionRef, 
          where('index', '==', orderedItem.index)
        ));

        const docs = orderedItemSnapshot.docs;
        if( docs.length === 0 ) {
          console.log('No matching document.');
          return null;
        }

        // - Assuming there's only one document matching the index
        const doc = docs[0];

        // - Update the document with the new data
        const item = doc.data();
        const updatedQuantity =  parseInt(item.quantityCurr) + parseInt(orderedItem.quantityOrdered);
        updateDoc(doc.ref, {quantityCurr: updatedQuantity})

        // - Update selected item
        const selectedItemIndex = selectedItems.findIndex(selectedItem => selectedItem.index === orderedItem.index );
        if( selectedItemIndex !== - 1 ) {
          selectedItems[selectedItemIndex].quantityCurr = updatedQuantity;
        }
      }

      setShowOrderItem(false); // - Close the modal after item is added
      retrieveItems(); // - Refresh the items after updating the quantities
      alert('Item(s) Ordered Successfully');

    } catch( error ) {
      console.error('Error handling usage history:', error);
      alert('Item Order Error');
    }
  };


  /*************************************************************** 
                      Sort Items Functions
  ***************************************************************/
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

  /*************************************************************** 
                    Profile Sidebar Functions
  ***************************************************************/
  // - Profile Details
  const [userData, setUserData] = useState(null);

  const retrieveUser = async () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.error('User data not found');
      }
    }
  };

  const deleteUser = async () => {
    
  }

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
                          Return Function
  ***************************************************************/
  return (
    <div className="Inventorypage">
        <Navbar/>
      <div className="content">
        <main>
          <Inventory userData={userData}
                     onSave={handleSave}
                     onDelete={handleDeleteAccount}
                     onLogout={handleLogout}
                     items={items} onShowAddItem={() => setShowAddItem(true)}
                     onShowEditItem={() => setShowEditItem(true)} setItemToEdit={(item) => setItemToEdit(item)} 
                     onToggleSelectItem={handleToggleSelectItem} 
                     selectedItems={selectedItems}                     
                     sortItemsByMinQuantity={sortItemsByMinQuantity} 
                     sortItemsByMaxQuantity={sortItemsByMaxQuantity}
                     sortItemsAsc={sortItemsAsc}
                     sortItemsDesc={sortItemsDesc}
                     sortExpAsc={sortExpAsc}
                     sortExpDesc={sortExpDesc} 
                     onShowUseItem={() => setShowUseItem(true)}
                     onShowOrderItem={() => setShowOrderItem(true)}
                     />
          <AddItem onAdd={handleAddItem} show={showAddItem} onHide={() => setShowAddItem(false)} />
          <EditItem onEdit={handleEditItem} show={showEditItem} onHide={() => setShowEditItem(false)} item={itemToEdit} onDelete={handleDeleteItem}/>
          <UseItem onUse={handleUsageHistory} show={showUseItem} onHide={() => setShowUseItem(false)} selectedItems={selectedItems}/>
          <OrderItem onOrder={handleOrderHistory} show={showOrderItem} onHide={() => setShowOrderItem(false)} selectedItems={selectedItems}/>
        </main>
      </div>
    </div>
  );
}

export default Inventorypage;