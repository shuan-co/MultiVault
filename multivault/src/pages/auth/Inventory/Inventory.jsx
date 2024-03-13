import React, { useState, useMemo, useEffect } from 'react';
import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';
import { Pagination, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, getDoc, addDoc, getDocs, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import { auth, db } from '../../../firebase/firebase';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ProfileSection from './ProfileSection';

const Inventory = ({ 
  userData, onSave, onDelete, onLogout, items, onShowAddItem, onShowEditItem, 
  activeSubPage, sortItemsByMinQuantity, sortItemsByMaxQuantity, sortItemsAsc, 
  sortItemsDesc, sortExpAsc, sortExpDesc, setItemToEdit, onToggleSelectItem
}) => {
  // - Inventory Details
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('Name');
  const [filterBy, setFilterBy] = useState('All');
  const [prioritizedItems, setPrioritizedItems] = useState({});
  const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(itemsCollectionRef, (snapshot) => {
      const itemsData = [];
      snapshot.forEach(doc => {
        itemsData.push({ id: doc.id, ...doc.data() });
      });
      setAllItems(itemsData);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchPrioritizedItems = async () => {
      try {
        setSortBy('Priority');
        const querySnapshot = await getDocs(itemsCollectionRef);
        const prioritizedItemsData = {};
        querySnapshot.forEach(doc => {
          prioritizedItemsData[doc.id] = doc.data().prioritized || false;
        });
        setPrioritizedItems(prioritizedItemsData);
      } catch (error) {
        console.error('Error fetching prioritized items:', error);
      }
    };

    fetchPrioritizedItems();
  }, []);

  // Check if an item is low on stock
  const isLowOnStock = (item) => {
    const tenPercentOfOriginal = item.quantityOrig * 0.1;
    return item.quantityCurr <= tenPercentOfOriginal;
  }

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


  /*************************************************************** 
                      Inventory Functions
  ***************************************************************/
  const filteredItems = useMemo(() => {
    let tempItems = allItems;

    if (activeSubPage === 'low-stock') {
      tempItems = allItems.filter(item => item.quantity <= 50);
    }

    if (filterBy === 'Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Perishable');
    } else if (filterBy === 'Non-Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Non-Perishable');
    }

    if (filterBy === "Prioritized") {
      tempItems = tempItems.filter((item) => prioritizedItems[item.id]);
    }
    

    switch (sortBy) {
      case 'Name':
        return [...tempItems].sort((a, b) => a.name.localeCompare(b.name));
      case 'Quantity':
        return [...tempItems].sort((a, b) => Number(a.quantity) - Number(b.quantity));
      case 'Priority':
        return [...tempItems].sort((a, b) => {
          if (prioritizedItems[a.id] && !prioritizedItems[b.id]) {
            return -1;
          } else if (!prioritizedItems[a.id] && prioritizedItems[b.id]) {
            return 1;
          } else {
            return a.name.localeCompare(b.name);
          }
        });
      default:
        return tempItems;
    }
     
  }, [allItems, activeSubPage, sortBy, filterBy, prioritizedItems]);

  const togglePrioritize = async (itemId) => {
    console.log(itemId);
    try {
      const itemRef = doc(itemsCollectionRef, itemId);
      const itemSnap = await getDoc(itemRef);
  
      if (!itemSnap.exists()) {
        console.log('No matching document.');
        return null;
      }
  
      const itemData = itemSnap.data();
  
      const updatedItemData = {
        ...itemData,
        prioritized: !itemData.prioritized
      };
  
      await updateDoc(itemRef, updatedItemData);
  
      console.log('Prioritization status updated successfully.');
  
      setPrioritizedItems(prevPrioritizedItems => ({
        ...prevPrioritizedItems,
        [itemId]: updatedItemData.prioritized
      }));
  
      setSortBy(prevSortBy => prevSortBy === 'Priority' ? null : prevSortBy);
    } catch (error) {
      console.error('Error updating prioritization status:', error);
  
      setPrioritizedItems(prevPrioritizedItems => ({
        ...prevPrioritizedItems,
        [itemId]: !prevPrioritizedItems[itemId]
      }));
    }
  };
  
  
  
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = (isOpen) => {
    console.log("Dropdown state before:", dropdownOpen);
    setDropdownOpen(isOpen);
    console.log("Dropdown state after:", dropdownOpen);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="main-container">
       <div className="sidebar">
          {userData ? (
              <ProfileSection userData={userData} onSave={onSave} onDelete={onDelete} onLogout={onLogout}/>
              ) : (
                <div className="profile">
                  <h3 className="profile-name">Loading...</h3>
                </div>
              )}
       </div>
       <div className="inventory-content">
        <div className="header">
          <h2 className="title">
            Sort By:
            <Dropdown show={dropdownOpen} onToggle={handleToggleDropdown}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {sortBy}
                <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setSortBy('A-Z'); setDropdownOpen(false); sortItemsAsc()}}>A-Z</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Z-A'); setDropdownOpen(false); sortItemsDesc()}}>Z-A</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Quantity Ascending'); setDropdownOpen(false); sortItemsByMinQuantity()}}>Quantity Ascending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Quantity Descending'); setDropdownOpen(false); sortItemsByMaxQuantity()}}>Quantity Descending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Expiration Date Ascending'); setDropdownOpen(false); sortExpAsc()}}>Expiration Ascending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Expiration Date Descending'); setDropdownOpen(false); sortExpDesc()}}>Expiration Descending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Favorited'); setDropdownOpen(false); }}>Favorited</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="filter-buttons">
              <button onClick={() => setFilterBy('All')} className={filterBy === 'All' ? 'active' : ''}>All</button>
              <button onClick={() => setFilterBy('Perishable')} className={filterBy === 'Perishable' ? 'active' : ''}>Perishable</button>
              <button onClick={() => setFilterBy('Non-Perishable')} className={filterBy === 'Non-Perishable' ? 'active' : ''}>Non-Perishable</button>
            </div>
            <button className="add-button" onClick={onShowAddItem}>ADD</button>
          </h2>
        </div>
        <div className="inventory">
          {currentItems.length > 0 ? (
             currentItems.map((item, index) => (
                <div key={index} className={`item ${isLowOnStock(item) || alertExpiry(item) ? 'highlight-red' : null}`}>
                  <div className = "item-header">
                  <input
											class="item-select-checkbox"
											type="checkbox"
											onChange={() => onToggleSelectItem(item.index)}
										/>
										<button className="item-edit-button" onClick={() => {setItemToEdit(item); onShowEditItem();}}></button>
                    <button
                      className="prioritize-button"
                      onClick={() => {
                        console.log('Button clicked. Item id:', item.id);
                        togglePrioritize(item.id);
                      }}
                    >
                      {prioritizedItems[item.id] ? <StarIcon /> : <StarBorderIcon />}
                    </button>
                  </div>
                  <img src={item.imageurl} alt={item.name || "Default placeholder"}/>
                  <div className="item-name">
                  <span className="item-value-name">{item.name}</span>
                    </div>
                  <div className="item-details">
                  <div className="item-row">
                     <span className="item-title">DESCRIPTION:</span>
                     <span className="item-value">{item.description}</span>
                  </div>
                  <div className="item-row">
                     <span className="item-title">PERISHABLE:</span>
                     <span className="item-value">{item.status}</span>
                  </div>
                  <div className="item-row">
                     <span className={`item-title ${isLowOnStock(item) ? 'text-red': null}`}>QTY:</span>
                     <span className={`item-value ${isLowOnStock(item) ? 'text-red': null}`}>{item.quantityCurr}</span>
                  </div>
                  <div className="item-row">
                     <span className={`item-title ${alertExpiry(item) ? 'text-red': null}`}>EXP:</span>
                     <span className={`item-value ${alertExpiry(item) ? 'text-red': null}`}>{item.expiry}</span>
                  </div>
                 </div>
               </div>
             ))
           ) : (
               <div className="no-items">No items available</div>
           )}
        </div>
        <div className="pagination-container">
         <Pagination>
          {currentPage > 1 && (
            <Pagination.Item onClick={handlePrevPage}>
            <FontAwesomeIcon icon={faAngleLeft} />
            </Pagination.Item>
          )}

          {[...Array(totalPages)].map((_, idx) => (
           <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
           >
            {idx + 1}
           </Pagination.Item>
          ))}
 
          {currentPage < totalPages && (
           <Pagination.Item onClick={handleNextPage}>
            <FontAwesomeIcon icon={faAngleRight} />
           </Pagination.Item>
          )}
         </Pagination>
       </div>
      </div>
    </div>
  );
};

export default Inventory;